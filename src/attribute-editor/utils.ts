// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type AnyFunction<T, U> = (...args: T[]) => U;

/**
 * Utility function to return a function that calls both the given functions.
 * @param funcA A function to call.
 * @param funcB Another function to call. The return value of this function is ignored.
 * @returns Returns a function that calls both the given functions.
 */
export function callBoth<T, U>(funcA?: AnyFunction<T, U>, funcB?: AnyFunction<T, void>) {
  return (...args: T[]) => {
    funcB?.(...args);
    return funcA?.(...args);
  };
}
