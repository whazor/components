// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const prettier = require('prettier');
const { pascalCase } = require('change-case');
const execa = require('execa');
const { task } = require('../utils/gulp-utils');
const themes = require('../utils/themes');

const messagesPath = path.join(process.cwd(), 'src', 'i18n', 'messages');
const i18nOutputPath = path.join(process.cwd(), 'src', 'i18n', 'interfaces');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

const locales = ['default', 'de-DE'];

async function buildI18n() {
  const { componentNames, messages } = await generateComponentTypes();

  await writeIndexFile(componentNames);

  await writeTokensFile();

  await writeJSONFiles(messages);
}

async function generateComponentTypes() {
  const componentNames = [];
  const messages = {};

  for (const sourceFilePath of await globby(path.join(messagesPath, '**', 'default.json'))) {
    try {
      const componentName = sourceFilePath
        .split('/')
        .slice(-2)[0]
        .replace(/\.json/, '');
      componentNames.push(componentName);

      const dictionary = await getDictionary(componentName, sourceFilePath);
      messages[componentName] = dictionary;
      const interfacesFileContent = generateInterfaceForJSON(componentName, dictionary.parsed);

      const interfacesFolderPath = path.join(i18nOutputPath, componentName);
      const interfacesFilePath = path.join(interfacesFolderPath, 'index.ts');
      await fs.ensureDir(interfacesFolderPath);
      await fs.writeFile(interfacesFilePath, interfacesFileContent);
    } catch (error) {
      console.error('ERROR', sourceFilePath, error);
    }
  }

  return { componentNames, messages };
}

async function writeIndexFile(components) {
  const sorted = [...components].sort();
  const indexFilePath = path.join(i18nOutputPath, 'index.ts');
  const indexFileContent = prettify(
    indexFilePath,
    `
    // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    // SPDX-License-Identifier: Apache-2.0

    ${sorted.map(componentName => `import { ${pascalCase(componentName)}I18n } from './${componentName}'`).join('\n')}

    export interface ComponentsI18N {
      ${sorted.map(componentName => `['${componentName}']: ${pascalCase(componentName)}I18n;`).join('\n')}
    }

    export {${sorted.map(componentName => `${pascalCase(componentName)}I18n`).join(',')}}
    `
  );
  await fs.writeFile(indexFilePath, indexFileContent);
}

async function getDictionary(componentName, defaultJsonPath) {
  const dictionary = {};
  for (const locale of locales) {
    const localeJsonPath = defaultJsonPath.replace(/[\w-]+\.json$/, `${locale}.json`);
    dictionary[locale] = JSON.parse(await fs.readFile(localeJsonPath, 'utf-8'));
  }
  const metaJsonPath = defaultJsonPath.replace(/[\w-]+\.json$/, 'meta.json');
  if (fs.existsSync(metaJsonPath)) {
    dictionary.meta = JSON.parse(await fs.readFile(metaJsonPath, 'utf-8'));
  }

  const parsed = {};
  Object.entries(dictionary.default)
    .filter(([name]) => name !== 'enums')
    .forEach(([name, message]) => defineProperty(componentName, name, message, dictionary.meta?.[name], parsed));

  return {
    ...dictionary,
    parsed,
  };
}

function generateInterfaceForJSON(componentName, messages) {
  const definition = renderNamespace(messages);
  return prettify(
    'temp.ts',
    `
      // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
      // SPDX-License-Identifier: Apache-2.0

      ${
        definition.indexOf(`${pascalCase(componentName)}Props`) !== -1
          ? `import {${pascalCase(componentName)}Props} from '../../../${componentName}/interfaces'`
          : ''
      }
            
      export interface ${`${pascalCase(componentName)}I18n`} ${definition}
      `
  );
}

async function writeTokensFile() {
  const tokensDefinitionPath = path.join(messagesPath, 'tokens', 'default.json');
  const dictionary = await getDictionary('tokens', tokensDefinitionPath);

  const tokensInterface = generateInterfaceForJSON('tokens', dictionary.parsed);

  await fs.writeFile(path.join(i18nOutputPath, 'tokens.ts'), tokensInterface);
}

async function writeJSONFiles(componentMessages) {
  const combined = {};
  for (const locale of locales) {
    combined[locale] = {};
    for (const component of Object.keys(componentMessages)) {
      combined[locale][component] = componentMessages[component][locale];
    }
    const tokens = combined[locale].tokens;
    combined[locale].tokens = Object.keys(tokens).reduce(
      (acc, key) => ({ ...acc, [`tokens__${key}`]: tokens[key] }),
      {}
    );
  }
  for (const theme of themes) {
    const dest = path.join(theme.outputPath, 'i18n', 'messages');
    await fs.mkdir(dest, { recursive: true });

    // copy raw component/token messages directly
    await execa('rsync', ['-a', `${path.join(messagesPath, '/')}.`, dest, '--exclude', 'meta.json']);

    // write combined bundles
    for (const locale of locales) {
      await fs.writeFile(path.join(dest, `all.${locale}.json`), JSON.stringify(combined[locale]));
    }
  }
}

function renderNamespace(namespace) {
  return `{
      ${Object.entries(namespace)
        .map(([name, value]) => `'${name}': ${typeof value === 'string' ? value : renderNamespace(value)}`)
        .join(';\n')}
  }`;
}

function defineProperty(componentName, name, message, messageMeta, namespace) {
  const [rootName, ...restName] = name.split('.');

  if (restName.length === 0) {
    namespace[rootName] = definePropertyType(componentName, message, messageMeta);
  } else {
    if (!namespace[rootName]) {
      namespace[rootName] = {};
    }
    defineProperty(componentName, restName.join('.'), message, messageMeta, namespace[rootName]);
  }
}

function definePropertyType(componentName, message, messageMeta) {
  const args = captureArguments(componentName, message, messageMeta);
  return args.length === 0 ? 'string' : `(${args.map(arg => `${arg[0]}: ${arg[1]}`).join(',')}) => string`;
}

function captureArguments(componentName, message, messageMeta) {
  if (!messageMeta || !messageMeta.arguments) {
    return [];
  }
  return Object.entries(messageMeta.arguments).map(([argName, argType]) => {
    if (argType[0] === argType[0].toLowerCase()) {
      return [argName, argType];
    }
    return [argName, `${pascalCase(componentName)}Props.${argType}`];
  });
}

function prettify(filepath, content) {
  if (prettierOptions && ['.ts', '.tsx', '.js', '.json'].some(ext => filepath.endsWith(ext))) {
    return prettier.format(content, { ...prettierOptions, filepath });
  }
  return content;
}

module.exports = task('build-i18n', buildI18n);
