// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const FUNNEL_VERSION = '1.0';
export const enum FunnelType {
  SINGLE_PAGE = 'single-page',
  MULTI_PAGE = 'multi-page',
}

export interface FunnelProps {
  totalFunnelSteps: number;
  optionalStepNumbers: number[];
  funnelType: FunnelType;
}

interface FunnelInteractionProps {
  funnelInteractionId: string;
}

export interface FunnelStartProps extends FunnelProps {
  funnelNameSelector: string;
}

export interface FunnelStepInteractionProps extends FunnelInteractionProps {
  stepName?: string;
  stepNumber: number | null;
}

interface FunnelStepNavigationProps extends FunnelStepInteractionProps {
  destinationStepNumber: number | null;
  navigationType: string;
}

interface FunnelSubStepInteractionProps extends FunnelStepInteractionProps {
  subStepNumber: number | null;
}

interface FunnelSubStepErrorProps extends FunnelSubStepInteractionProps {
  fieldLabelSelector?: string;
  fieldErrorSelector?: string;
}

interface FunnelSubStepStartProps extends FunnelSubStepInteractionProps {
  subStepNameSelector: string;
}

interface FunnelLinkInteractionProps extends FunnelSubStepInteractionProps {
  selector: string;
}

type FunnelInteractionFn = (props: FunnelInteractionProps) => void;
type FunnelStartFn = (props: FunnelStartProps) => string;
type FunnelStepStartFn = (props: FunnelStepInteractionProps) => void;
type FunnelStepFn = (props: FunnelStepInteractionProps) => void;
type FunnelStepNavigationFn = (props: FunnelStepNavigationProps) => void;
type FunnelSubStepStartFn = (props: FunnelSubStepStartProps) => void;
type FunnelSubStepCompleteFn = (props: FunnelSubStepStartProps) => void;
type FunnelSubStepErrorFn = (props: FunnelSubStepErrorProps) => void;
type HelpInteractedFn = (props: FunnelLinkInteractionProps) => void;
type ExternalLinkInteractedFn = (props: FunnelLinkInteractionProps) => void;

export const FUNNEL_NAME_SELECTOR = '[data-analytics-context="breadcrumb"]';
export function findSubStepNameSelector(subStepNumber: number) {
  return `[data-analytics-substep-index="${subStepNumber}"] [data-analytics="heading-text"]`;
}

export const funnelStart: FunnelStartFn = (props: FunnelStartProps) => {
  console.log('funnelStart', { ...props, funnelVersion: FUNNEL_VERSION });

  const funnelName = (document.querySelector(props.funnelNameSelector) as HTMLElement).innerText;
  console.log('Query selector [funnelNameSelector]:', funnelName);
  return 'funnel-1';
};

export const funnelError: FunnelInteractionFn = (props: FunnelInteractionProps) => {
  console.log('funnelError', props);
};

export const funnelComplete: FunnelInteractionFn = (props: FunnelInteractionProps) => {
  console.log('funnelComplete', props);
};

export const funnelSuccessful: FunnelInteractionFn = (props: FunnelInteractionProps) => {
  console.log('funnelSuccessful', props);
};

export const funnelCancelled: FunnelInteractionFn = (props: FunnelInteractionProps) => {
  console.log('funnelCancelled', props);
};

export const funnelStepStart: FunnelStepStartFn = (props: FunnelStepInteractionProps) => {
  console.log('funnelStepStart', { ...props });
};

export const funnelStepComplete: FunnelStepFn = (props: FunnelStepInteractionProps) => {
  console.log('funnelStepComplete', props);
};

export const funnelStepNavigation: FunnelStepNavigationFn = (props: FunnelStepNavigationProps) => {
  console.log('funnelStepNavigation', props);
};

export const funnelSubStepStart: FunnelSubStepStartFn = (props: FunnelSubStepStartProps) => {
  console.log('funnelSubStepStart', props);

  const subStepName = (document.querySelector(props.subStepNameSelector) as HTMLElement).innerText;
  console.log('Query selector [subStepNameSelector]:', subStepName);
};

export const funnelSubStepComplete: FunnelSubStepCompleteFn = (props: FunnelSubStepStartProps) => {
  console.log('funnelSubStepComplete', props);

  const subStepName = (document.querySelector(props.subStepNameSelector) as HTMLElement).innerText;
  console.log('Query selector [subStepNameSelector]:', subStepName);
};

export const funnelSubStepError: FunnelSubStepErrorFn = (props: FunnelSubStepErrorProps) => {
  console.log('funnelSubStepError', props);

  if (props.fieldLabelSelector) {
    const fieldLabel = (document.querySelector(props.fieldLabelSelector) as HTMLElement).innerText;
    console.log('Query selector [fieldLabelSelector]:', fieldLabel);
  }

  if (props.fieldErrorSelector) {
    const errorLabel = (document.querySelector(props.fieldErrorSelector) as HTMLElement).innerText;
    console.log('Query selector [fieldErrorSelector]:', errorLabel);
  }
};

export const helpPanelInteracted: HelpInteractedFn = (props: FunnelLinkInteractionProps) => {
  console.log('helpPanelInteracted', props);

  const linkName = (document.querySelector(props.selector) as HTMLElement).innerText;
  console.log('Query selector [selector]:', linkName);
};

export const externalLinkInteracted: ExternalLinkInteractedFn = (props: FunnelLinkInteractionProps) => {
  console.log('externalLinkInteracted', props);

  const linkName = (document.querySelector(props.selector) as HTMLElement).innerText;
  console.log('Query selector [selector]:', linkName);
};
