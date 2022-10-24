// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// `d3-scale` and its transitive dependencies are using ESM format which causes
// issues during unit tests at clients using jest and do not have the associated
// jest-preset package installed.
export { scaleLinear, scaleLog, scaleTime, scaleBand } from 'd3-scale';
