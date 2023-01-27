// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import InternalContainer from './internal';
import { ContainerProps } from './interfaces';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

import { useTelemetryContext, TelemetryContext } from '../internal/context/telemetry-context';

export { ContainerProps };

export default function Container({
  variant = 'default',
  disableHeaderPaddings = false,
  disableContentPaddings = false,
  ...props
}: ContainerProps) {
  const baseComponentProps = useBaseComponent('Container');
  const externalProps = getExternalProps(props);
  const { context } = useTelemetryContext();

  return (
    <TelemetryContext.Provider value={{ context: [...context, 'container'] }}>
      <InternalContainer
        variant={variant}
        disableHeaderPaddings={disableHeaderPaddings}
        disableContentPaddings={disableContentPaddings}
        {...externalProps}
        {...baseComponentProps}
      />
    </TelemetryContext.Provider>
  );
}

applyDisplayName(Container, 'Container');
