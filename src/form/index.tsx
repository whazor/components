// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

import { TelemetryContextProvider } from '../internal/context/telemetry-context';

function Form(props: FormProps) {
  const baseComponentProps = useBaseComponent('Form');

  return (
    <TelemetryContextProvider value="form">
      <InternalForm {...props} {...baseComponentProps} />
    </TelemetryContextProvider>
  );
}

applyDisplayName(Form, 'Form');

export { FormProps };
export default Form;
