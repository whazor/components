// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import AppContext from '../app-context';

const locales = ['en-US', 'de-DE'];

export default function () {
  const { urlParams, setUrlParams } = useContext(AppContext);

  const changeLocale = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    setUrlParams({ locale: target.value });
    window.location.reload();
  };

  return (
    <label>
      Locale
      <select defaultValue={urlParams.locale} onChange={changeLocale}>
        {locales.map(locale => (
          <option key={locale}>{locale}</option>
        ))}
      </select>
    </label>
  );
}
