// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useReducer, useState } from 'react';
import Box from '~components/box';
import FormField from '~components/form-field';
import RadioGroup from '~components/radio-group';
import Select, { SelectProps } from '~components/select';

const langOptions: Array<SelectProps.Option> = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'en-NZ', label: 'English (New Zealand)' },
  { value: 'de-DE', label: 'Deutsch (Deutschland)' },
  { value: 'de-CH', label: 'Deutsch (Schweiz)' },
  { value: 'de-AT', label: 'Deutsch (Österreich)' },
];

const optionsPerLanguage = langOptions.reduce((acc, option) => {
  const [lang] = option.value!.split('-');
  if (!acc[lang]) {
    acc[lang] = [];
  }
  acc[lang].push(option);
  return acc;
}, {} as Record<string, Array<SelectProps.Option>>);

const initialState = {
  en: optionsPerLanguage.en[0],
  de: optionsPerLanguage.de[0],
};

type State = { [K in keyof typeof initialState]: SelectProps.Option };
interface Action {
  type: `update/${string & keyof State}`;
  payload: Partial<State[keyof State]>;
}

const langReducer: React.Reducer<State, Action> = (state = initialState, action) => {
  switch (action.type) {
    case 'update/en':
      return { ...state, en: action.payload };
    case 'update/de':
      return { ...state, deu: action.payload };
    default:
      return state;
  }
};

export default function RadiosPage() {
  const [radioSelection, setRadioSelection] = useState<string>('');

  const [lang, dispatch] = useReducer(langReducer, initialState);
  const setLang = (type: keyof State, option: SelectProps.Option) =>
    dispatch({ type: `update/${type}`, payload: option });

  return (
    <Box padding="l">
      <h1>Radio group progressive disclosure demo</h1>
      <FormField
        label="Language settings"
        description="You can select a specific language or have this service automatically identify the language in your media."
      >
        <RadioGroup
          value={radioSelection}
          onChange={event => setRadioSelection(event.detail.value)}
          ariaControls="dialekt-settings"
          items={[
            {
              label: 'English',
              value: 'en',
              description:
                'If you know the language spoken in the source media is English, choose this option for optimal results.',
            },
            {
              label: 'Deutsch',
              value: 'de',
              description:
                'Wenn Sie wissen, dass die in den Quellmedien gesprochene Sprache Deutsch ist, wählen Sie diese Option für optimale Ergebnisse.',
            },
            {
              label: 'Automatic language detection',
              value: 'automatic',
              description: 'If you do not know the language spoken in the source media, choose this option.',
            },
          ]}
        />
      </FormField>
      <Box id="dialekt-settings" display={!Object.keys(lang).includes(radioSelection) ? 'none' : 'block'}>
        {radioSelection === 'en' && (
          <FormField label="English Dialect" description="Select the English dialect you want to use.">
            <Select
              selectedOption={lang.en}
              onChange={event => setLang('en', event.detail.selectedOption)}
              options={optionsPerLanguage.en}
            />
          </FormField>
        )}
        {radioSelection === 'de' && (
          <FormField
            label="Deutscher Dialekt"
            description="Wählen Sie das Deutsch-Dialekt aus, den Sie verwenden möchten."
          >
            <Select
              selectedOption={lang.de}
              onChange={event => setLang('de', event.detail.selectedOption)}
              options={optionsPerLanguage.de}
            />
          </FormField>
        )}
      </Box>
    </Box>
  );
}
