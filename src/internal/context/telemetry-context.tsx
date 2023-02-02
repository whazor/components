// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, createContext } from 'react';

export const TelemetryContext = createContext<string | undefined>(undefined);

export function useTelemetryContext() {
  return useContext(TelemetryContext);
}

interface TelemetryContextProviderProps {
  children?: React.ReactNode;
  value: string;
}

const contextSet = new Set<string>();

const toContextString = (...context: string[]) => context.filter(Boolean).join('_');

function getContext(rootContext = '', value: string) {
  let contextId = 1;

  let context = toContextString(rootContext, `${value}-${contextId}`);
  while (contextSet.has(context)) {
    context = toContextString(rootContext, `${value}-${++contextId}`);
  }

  contextSet.add(context);
  return context;
}

export const TelemetryContextProvider = ({ children, value }: TelemetryContextProviderProps) => {
  const rootContext = useTelemetryContext();
  const context = getContext(rootContext, value);

  return <TelemetryContext.Provider value={context}>{children}</TelemetryContext.Provider>;
};
