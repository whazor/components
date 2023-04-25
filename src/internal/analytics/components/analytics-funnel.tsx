// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef, useEffect, useRef, useState } from 'react';

import {
  useFunnelContext,
  FunnelStepContext,
  FunnelStepContextValue,
  FunnelSubStepContext,
  useFunnelStepContext,
  FocusHandlerProvider,
  useFocusHandler,
  FunnelContextValue,
  FunnelContext,
} from '../context/analytics-context';

import FunnelMetrics from '../';
import { FunnelProps } from '../interfaces';

import { useUniqueIndex } from '../../hooks/use-unique-index';
import { getFunnelNameSelector, getSubStepNameSelector } from '../selectors';

export const AnalyticsFunnel: React.FC<FunnelProps> = ({ children, ...props }) => {
  const [funnelInteractionId, setFunnelInteractionId] = useState<string>();
  const funnelResultRef = useRef<boolean>(false);

  const funnelContextValue: FunnelContextValue = {
    funnelInteractionId,
    setFunnelInteractionId,
    funnelType: props.funnelType,
    optionalStepNumbers: props.optionalStepNumbers,
    totalFunnelSteps: props.totalFunnelSteps,
    funnelSubmit: () => {
      funnelResultRef.current = true;
    },
    funnelCancel: () => {
      funnelResultRef.current = false;
    },
  };

  useEffect(() => {
    const funnelInteractionId = FunnelMetrics.funnelStart({ funnelNameSelector: getFunnelNameSelector(), ...props });
    setFunnelInteractionId(funnelInteractionId);

    return () => {
      if (funnelResultRef.current === true) {
        FunnelMetrics.funnelComplete({ funnelInteractionId });
      } else {
        FunnelMetrics.funnelCancelled({ funnelInteractionId });
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FunnelContext.Provider value={funnelContextValue}>
      <FocusHandlerProvider>{children}</FocusHandlerProvider>
    </FunnelContext.Provider>
  );
};

export const AnalyticsFunnelStep: React.FC<FunnelStepContextValue> = ({ children, stepNumber, stepName }) => {
  const { funnelInteractionId } = useFunnelContext();
  const { focusedElement, setFocus, removeFocus } = useFocusHandler();
  useEffect(() => {
    if (funnelInteractionId && focusedElement !== stepNumber) {
      setFocus(stepNumber!);
      FunnelMetrics.funnelStepStart({ funnelInteractionId, stepNumber, stepName });
    }

    return () => {
      if (funnelInteractionId) {
        removeFocus(stepNumber!);
        FunnelMetrics.funnelStepComplete({ funnelInteractionId, stepNumber, stepName });
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelInteractionId, stepNumber]);

  return (
    <FocusHandlerProvider>
      <FunnelStepContext.Provider value={{ stepNumber, stepName }}>
        <div data-analytics-step-index={stepNumber}>{children}</div>
      </FunnelStepContext.Provider>
    </FocusHandlerProvider>
  );
};

export const AnalyticsFunnelSubStep: React.FC = ({ children }) => {
  const { focusedElement, setFocus, removeFocus } = useFocusHandler();
  const { funnelInteractionId } = useFunnelContext();
  const { stepNumber, stepName } = useFunnelStepContext();

  const rootRef = createRef<HTMLDivElement>();
  const subStepNumber = useUniqueIndex('substep');
  const subStepNameSelector = getSubStepNameSelector(subStepNumber);

  return (
    <FunnelSubStepContext.Provider value={{ funnelInteractionId, stepNumber, stepName, subStepNumber }}>
      <div
        ref={rootRef}
        data-analytics-substep-index={subStepNumber}
        onFocus={() => {
          if (focusedElement !== subStepNumber) {
            setFocus(subStepNumber);
            if (funnelInteractionId) {
              FunnelMetrics.funnelSubStepStart({
                funnelInteractionId,
                subStepNameSelector,
                subStepNumber,
                stepNumber,
              });
            }
          }
        }}
        onBlur={event => {
          if (focusedElement === subStepNumber && !rootRef.current?.contains(event.relatedTarget)) {
            removeFocus(subStepNumber);
            if (funnelInteractionId) {
              FunnelMetrics.funnelSubStepComplete({
                funnelInteractionId,
                subStepNameSelector,
                subStepNumber,
                stepNumber,
              });
            }
          }
        }}
      >
        {children}
      </div>
    </FunnelSubStepContext.Provider>
  );
};
