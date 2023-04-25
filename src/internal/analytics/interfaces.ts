// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum FunnelType {
  SINGLE_PAGE = 'single-page',
  MULTI_PAGE = 'multi-page',
}

export interface FunnelProps {
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
}

export interface FunnelInteractionProps {
  funnelInteractionId: string;
}

export interface FunnelStartProps extends FunnelProps {
  funnelNameSelector: string;
}

export interface FunnelStepInteractionProps extends FunnelInteractionProps {
  stepName?: string;
  stepNumber: number | null;
}

export interface FunnelStepNavigationProps extends FunnelStepInteractionProps {
  destinationStepNumber: number | null;
  navigationType: string;
}

export interface FunnelSubStepInteractionProps extends FunnelStepInteractionProps {
  subStepNumber: number | null;
}

export interface FunnelSubStepErrorProps extends FunnelSubStepInteractionProps {
  fieldLabelSelector?: string;
  fieldErrorSelector?: string;
}

export interface FunnelSubStepStartProps extends FunnelSubStepInteractionProps {
  subStepNameSelector: string;
}

export interface FunnelLinkInteractionProps extends FunnelSubStepInteractionProps {
  selector: string;
}

export interface IFunnelMetrics {
  funnelStart(props: FunnelStartProps): string;
  funnelError(props: FunnelInteractionProps): void;
  funnelComplete(props: FunnelInteractionProps): void;
  funnelSuccessful(props: FunnelInteractionProps): void;
  funnelCancelled(props: FunnelInteractionProps): void;
  funnelStepStart(props: FunnelStepInteractionProps): void;
  funnelStepComplete(props: FunnelStepInteractionProps): void;
  funnelStepNavigation(props: FunnelStepNavigationProps): void;
  funnelSubStepStart(props: FunnelSubStepStartProps): void;
  funnelSubStepComplete(props: FunnelSubStepStartProps): void;
  funnelSubStepError(props: FunnelSubStepErrorProps): void;
  helpPanelInteracted(props: FunnelLinkInteractionProps): void;
  externalLinkInteracted(props: FunnelLinkInteractionProps): void;
}

export namespace FunnelMetrics {
  export function create(metrics: IFunnelMetrics): IFunnelMetrics {
    return metrics;
  }
}
