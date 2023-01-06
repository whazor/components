// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import { pairs1, pairs2, pairs3, ValueWithLabel } from './utils';

export default function CurrentKeyValuePairs() {
  return (
    <Container header={<Header variant="h2">Current - not semantically a definiton list</Header>}>
      <ColumnLayout columns={3} variant="text-grid">
        <SpaceBetween size="l">
          {pairs1.map((pair, index) => (
            <ValueWithLabel key={index} label={pair.label}>
              {pair.value}
            </ValueWithLabel>
          ))}
        </SpaceBetween>
        <SpaceBetween size="l">
          {pairs2.map((pair, index) => (
            <ValueWithLabel key={index} label={pair.label}>
              {pair.value}
            </ValueWithLabel>
          ))}
        </SpaceBetween>
        <SpaceBetween size="l">
          {pairs3.map((pair, index) => (
            <ValueWithLabel key={index} label={pair.label}>
              {pair.value}
            </ValueWithLabel>
          ))}
        </SpaceBetween>
      </ColumnLayout>
    </Container>
  );
}
