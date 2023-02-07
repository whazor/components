// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Alert from '~components/alert';
// import { I18NContextProvider } from '~components/i18n/context';

// These are the translations provided by Cloudscape.
// import germanTranslationStrings from '~components/i18n/exports/de-DE/all';

export default function () {
  return (
    // <I18NContextProvider
    //   messages={{
    //     '@cloudscape-design/components': germanTranslationStrings,
    //   }}
    // >
    <Alert dismissible={true}>Hello!</Alert>
    // </I18NContextProvider>
  );
}
