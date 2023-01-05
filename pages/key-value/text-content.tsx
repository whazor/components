// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextContent from '~components/text-content';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import Header from '~components/header';
import { generate } from './utils';

export default function TextContentDescriptionList() {
  return (
    <Container header={<Header variant="h2">Text content description list - dl, dt, dd</Header>}>
      <TextContent>
        <dl>
          <ColumnLayout columns={3} variant="text-grid">
            {generate(
              <div>
                <dt>Key</dt>
                <dd>Value</dd>
              </div>
            )}
          </ColumnLayout>
        </dl>
        <dl>
          <ColumnLayout columns={3} variant="text-grid">
            {generate(
              <div>
                <dt>Key</dt>
                {generate(<dd>Value</dd>)}
              </div>
            )}
          </ColumnLayout>
        </dl>
      </TextContent>
    </Container>
  );
}
