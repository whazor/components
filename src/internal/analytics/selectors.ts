// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const getFunnelNameSelector = () => '[data-analytics-context="breadcrumb"]';
export const getSubStepNameSelector = (subStepNumber: number) =>
  `[data-analytics-substep-index="${subStepNumber}"] [data-analytics="heading-text"]`;
