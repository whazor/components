// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import CurrentKeyValuePairs from './current';
import KeyValueGroups from './key-value-groups';
import KeyValueList from './key-value-list';
import TextContentDescriptionList from './text-content';

export default function KeyValuePairsExamples() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <SpaceBetween size="l">
        <Box variant="h1">Key/value pairs examples</Box>
        <TextContentDescriptionList />
        <KeyValueList />
        <KeyValueGroups />
        <CurrentKeyValuePairs />
      </SpaceBetween>
    </ScreenshotArea>
  );
}
