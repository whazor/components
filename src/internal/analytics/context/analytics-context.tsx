// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useState } from 'react';
import { FunnelType } from '../funnel';

export interface FunnelContextValue {
  funnelInteractionId: string | undefined;
  setFunnelInteractionId: (funnelInteractionId: string) => void;
  funnelType: FunnelType;
  optionalStepNumbers: number[];
  totalFunnelSteps: number;
  funnelSubmit: () => void;
  funnelCancel: () => void;
}

export const FunnelContext = createContext<FunnelContextValue>({
  funnelInteractionId: undefined,
  setFunnelInteractionId: () => {},
  funnelType: FunnelType.SINGLE_PAGE,
  optionalStepNumbers: [],
  totalFunnelSteps: 0,
  funnelSubmit: () => {},
  funnelCancel: () => {},
});

export interface FunnelStepContextValue {
  stepNumber: number | null;
  stepName?: string;
}

export const FunnelStepContext = createContext<FunnelStepContextValue>({
  stepNumber: null,
});

export interface FunnelSubStepContextValue extends FunnelStepContextValue {
  funnelInteractionId: string | undefined;
  subStepNumber: number | null;
}

export const FunnelSubStepContext = createContext<FunnelSubStepContextValue>({
  funnelInteractionId: undefined,
  stepNumber: null,
  subStepNumber: null,
});

interface FocusContextData {
  focusedElement: number | null;
  setFocus: (elementId: number) => void;
  removeFocus: (elementId: number) => void;
}

const FocusHandlerContext = createContext<FocusContextData>({
  focusedElement: null,
  setFocus: () => {},
  removeFocus: () => {},
});

export const FocusHandlerProvider: React.FC = ({ children }) => {
  const [focusedElement, setFocusedElement] = useState<number | null>(null);

  const setFocus = (elementId: number) => {
    setFocusedElement(elementId);
  };

  const removeFocus = (elementId: number) => {
    if (focusedElement === elementId) {
      setFocusedElement(null);
    }
  };

  return (
    <FocusHandlerContext.Provider value={{ focusedElement, setFocus, removeFocus }}>
      {children}
    </FocusHandlerContext.Provider>
  );
};

export const useFocusHandler = () => useContext(FocusHandlerContext);
export const useFunnelSubStepContext = () => useContext(FunnelSubStepContext);
export const useFunnelStepContext = () => useContext(FunnelStepContext);
export const useFunnelContext = () => useContext(FunnelContext);
