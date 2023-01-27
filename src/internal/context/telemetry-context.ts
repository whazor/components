// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useContext, createContext } from 'react';

export interface TelemetryContextProps {
  context: string[];
}

export const TelemetryContext = createContext<TelemetryContextProps>({
  context: [],
});

export function useTelemetryContext() {
  return useContext(TelemetryContext);
}
