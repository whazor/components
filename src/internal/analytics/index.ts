// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  IFunnelMetrics,
  FunnelMetrics,
  FunnelStartProps,
  FunnelInteractionProps,
  FunnelStepInteractionProps,
  FunnelStepNavigationProps,
  FunnelSubStepStartProps,
  FunnelSubStepErrorProps,
  FunnelLinkInteractionProps,
} from './interfaces';

const StubFunnelMetrics: IFunnelMetrics = {
  funnelStart(_props: FunnelStartProps): string {
    console.log('Funnel start');
    return 'funnel-1';
  },

  funnelError(_props: FunnelInteractionProps): void {
    console.log('Funnel error');
  },

  funnelComplete(_props: FunnelInteractionProps): void {
    console.log('Funnel complete');
  },

  funnelSuccessful(_props: FunnelInteractionProps): void {
    console.log('Funnel successful');
  },

  funnelCancelled(_props: FunnelInteractionProps): void {
    console.log('Funnel cancelled');
  },

  funnelStepStart(_props: FunnelStepInteractionProps): void {
    console.log('Funnel step start');
  },

  funnelStepComplete(_props: FunnelStepInteractionProps): void {
    console.log('Funnel step complete');
  },

  funnelStepNavigation(_props: FunnelStepNavigationProps): void {
    console.log('Funnel step navigation');
  },

  funnelSubStepStart(_props: FunnelSubStepStartProps): void {
    console.log('Funnel substep start');
  },

  funnelSubStepComplete(_props: FunnelSubStepStartProps): void {
    console.log('Funnel substep complete');
  },

  funnelSubStepError(_props: FunnelSubStepErrorProps): void {
    console.log('Funnel substep error');
  },

  helpPanelInteracted(_props: FunnelLinkInteractionProps): void {
    console.log('Help panel interacted');
  },

  externalLinkInteracted(_props: FunnelLinkInteractionProps): void {
    console.log('External link interacted');
  },
};

export default FunnelMetrics.create(StubFunnelMetrics);
