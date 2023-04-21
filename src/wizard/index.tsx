// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getExternalProps } from '../internal/utils/external-props';
import { WizardProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalWizard from './internal';
import { AnalyticsFunnel } from '../internal/analytics/components/analytics-funnel';
import { FunnelType } from '../internal/analytics/funnel';

export { WizardProps };

function Wizard(props: WizardProps) {
  const baseComponentProps = useBaseComponent('Wizard');
  const externalProps = getExternalProps(props);

  return (
    <AnalyticsFunnel
      funnelType={FunnelType.MULTI_PAGE}
      optionalStepNumbers={props.steps.map((step, index) => (step.isOptional ? index : -1)).filter(step => step !== -1)}
      totalFunnelSteps={props.steps.length}
    >
      <InternalWizard {...externalProps} {...baseComponentProps} />
    </AnalyticsFunnel>
  );
}

applyDisplayName(Wizard, 'Wizard');

export default Wizard;
