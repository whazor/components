// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalContainer from './internal';
import { ContainerProps } from './interfaces';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

import { TelemetryContextProvider } from '../internal/context/telemetry-context';

function Container({
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  ...props
}: ContainerProps) {
  const baseComponentProps = useBaseComponent('Container');
  const externalProps = getExternalProps(props);

  return (
    <TelemetryContextProvider value="container">
      <InternalContainer
        variant={variant}
        disableHeaderPaddings={disableHeaderPaddings}
        disableContentPaddings={disableContentPaddings}
        {...externalProps}
        {...baseComponentProps}
      />
    </TelemetryContextProvider>
  );
}

applyDisplayName(Container, 'Container');

export { ContainerProps };
export default Container;
