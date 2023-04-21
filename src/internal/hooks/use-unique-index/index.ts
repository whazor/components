// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState, useRef } from 'react';

// Global object to store the state of each prefix.
const prefixState: Record<string, { index: number; availableIndices: number[] }> = {};

const getNextIndex = (prefix: string): number => {
  // Initialize the state for the prefix if it doesn't exist.
  if (!prefixState[prefix]) {
    prefixState[prefix] = { index: 0, availableIndices: [] };
  }

  const state = prefixState[prefix];

  // If there are available indices in the stack, pop and return one.
  if (state.availableIndices.length > 0) {
    return state.availableIndices.pop() as number;
  }

  // If there are no available indices, increment the index and return it.
  state.index += 1;
  return state.index;
};

const returnIndex = (prefix: string, index: number): void => {
  const state = prefixState[prefix];
  if (state) {
    state.availableIndices.push(index);
  }
};

export const useUniqueIndex = (prefix: string) => {
  const [index, setIndex] = useState<number>(0);
  const indexRef = useRef<number>(index);

  // Update the indexRef whenever the index changes.
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    setIndex(getNextIndex(prefix));

    // Return the index to the available indices stack when the component unmounts.
    return () => {
      returnIndex(prefix, indexRef.current);
    };
  }, [prefix]);

  // Return the index for the current component.
  return index;
};
