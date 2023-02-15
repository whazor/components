// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces';
import { tokens as parentTokens } from '../../classic/spacing';
import merge from 'lodash/merge';
import { expandDensityDictionary } from '../../utils';

const spacingTokens: StyleDictionary.SpacingDictionary = {
  spaceScaledXxxs: '{spaceXxxs}',
  spaceScaledXxs: '{spaceXxs}',
  spaceScaledXs: '{spaceXs}',
  spaceScaledS: '{spaceS}',
  spaceScaledM: '{spaceM}',
  spaceScaledL: '{spaceL}',
  spaceScaledXl: '{spaceXl}',
  spaceScaledXxl: '{spaceXxl}',
  spaceScaledXxxl: '{spaceXxxl}',
};

const sizeTokens: StyleDictionary.SizesDictionary = {
  sizeVerticalInput: '32px',
};

const expandedTokens: StyleDictionary.ExpandedDensityScopeDictionary = expandDensityDictionary(
  merge({}, parentTokens, { ...spacingTokens, ...sizeTokens })
);

export { expandedTokens as tokens };
