// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ThemeBuilder } from '@cloudscape-design/theming-build';
import { createColorMode, createDensityMode, createMotionMode } from '../utils/modes';
import {
  createTopNavigationContext,
  createCompactTableContext,
  createHeaderContext,
  createFlashbarContext,
} from '../utils/contexts';
import alertContextTokens from './contexts/alert';

const modes = [
  createColorMode('.awsui-dark-mode'),
  createDensityMode('.awsui-compact-mode'),
  createMotionMode('.awsui-motion-disabled'),
];

const tokenCategories = [
  require('./color-palette'),
  require('./color-charts'),
  require('./color-illustrations'),
  require('./colors'),
  require('./typography'),
  require('./borders'),
  require('./motion'),
  require('./sizes'),
  require('./spacing'),
  require('./shadows'),
];

export function buildVisualRefresh(builder: ThemeBuilder) {
  tokenCategories.forEach(({ tokens, mode: modeId }) => {
    const mode = modes.find(mode => mode.id === modeId);
    builder.addTokens(tokens, mode);
  });

  /* eslint-disable @typescript-eslint/no-var-requires */

  builder.addContext(createCompactTableContext(require('./contexts/compact-table').tokens));
  builder.addContext(createTopNavigationContext(require('./contexts/top-navigation').tokens));
  builder.addContext(createHeaderContext(require('./contexts/header').tokens));
  builder.addContext(createFlashbarContext(require('./contexts/flashbar').tokens));
  builder.addContext({
    id: 'alert',
    selector: '.awsui-context-alert',
    tokens: alertContextTokens,
  });

  /* eslint-enable @typescript-eslint/no-var-requires */

  return builder.build();
}

const builder = new ThemeBuilder('visual-refresh', ':root', modes);
const theme = buildVisualRefresh(builder);

export default theme;
