// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { callBoth } from '../utils';

describe('Utility functions => callBoth', () => {
  it('should call both functions', () => {
    const funcA = jest.fn();
    const funcB = jest.fn();
    const funcC = callBoth(funcA, funcB);
    funcC();
    expect(funcA).toHaveBeenCalled();
    expect(funcB).toHaveBeenCalled();
  });

  it('should call only the first function', () => {
    const funcA = jest.fn();
    const funcC = callBoth(funcA);
    funcC();
    expect(funcA).toHaveBeenCalled();
  });

  it('should call only the second function', () => {
    const funcB = jest.fn();
    const funcC = callBoth(undefined, funcB);
    funcC();
    expect(funcB).toHaveBeenCalled();
  });

  it('should call both functions with the same arguments', () => {
    const funcA = jest.fn();
    const funcB = jest.fn();
    const funcC = callBoth(funcA, funcB);
    funcC(1, 2, 3);
    expect(funcA).toHaveBeenCalledWith(1, 2, 3);
    expect(funcB).toHaveBeenCalledWith(1, 2, 3);
  });
});
