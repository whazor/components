// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalFormField from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { FormFieldProps } from './interfaces';

import { useTelemetryContext, TelemetryContext } from '../internal/context/telemetry-context';

export { FormFieldProps };

export default function FormField({ stretch = false, ...props }: FormFieldProps) {
  const baseComponentProps = useBaseComponent('FormField');
  const { context } = useTelemetryContext();

  return (
    <TelemetryContext.Provider value={{ context: [...context, 'form-field'] }}>
      <InternalFormField stretch={stretch} {...props} __hideLabel={false} {...baseComponentProps} />
    </TelemetryContext.Provider>
  );
}

applyDisplayName(FormField, 'FormField');
