// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonProps } from './interfaces';
import { InternalButton } from './internal';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { TelemetryContextProvider } from '../internal/context/telemetry-context';

export { ButtonProps };

const Button = React.forwardRef(({ children, ...props }: ButtonProps, ref: React.Ref<ButtonProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Button');
  const baseProps = getBaseProps(props);
  return (
    <TelemetryContextProvider value="button">
      <InternalButton {...baseProps} {...baseComponentProps} {...props} ref={ref}>
        {children}
      </InternalButton>
    </TelemetryContextProvider>
  );
});

applyDisplayName(Button, 'Button');
export default Button;
