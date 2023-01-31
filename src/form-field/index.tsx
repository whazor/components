// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalFormField from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { FormFieldProps } from './interfaces';

import { TelemetryContextProvider } from '../internal/context/telemetry-context';

function FormField({ stretch = false, ...props }: FormFieldProps) {
  const baseComponentProps = useBaseComponent('FormField');

  return (
    <TelemetryContextProvider value="form-field">
      <InternalFormField stretch={stretch} {...props} __hideLabel={false} {...baseComponentProps} />
    </TelemetryContextProvider>
  );
}

applyDisplayName(FormField, 'FormField');

export { FormFieldProps };
export default FormField;
