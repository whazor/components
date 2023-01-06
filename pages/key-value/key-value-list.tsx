// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { List } from '~components/key-value/composition';
import Container from '~components/container';
import Header from '~components/header';
import { pairs1, pairs2, pairs3 } from './utils';
import { SpaceBetween } from '~components';

export default function KeyValueList() {
  return (
    <Container header={<Header variant="h2">KeyValue.List - using ColumnLayout and SpaceBetween</Header>}>
      <SpaceBetween size="xxl">
        <List pairsList={pairs1} />
        <List pairsList={pairs1.concat(pairs2)} />
        <List pairsList={pairs1.concat(pairs2).concat(pairs3)} />
      </SpaceBetween>
    </Container>
  );
}
