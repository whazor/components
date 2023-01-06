// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextContent from '~components/text-content';
import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { pairs1, pairs2, pairs3 } from './utils';

export default function TextContentDescriptionList() {
  return (
    <Container header={<Header variant="h2">Text content - dl, dt, dd</Header>}>
      <TextContent>
        <SpaceBetween size="xxl">
          <dl>
            {pairs1.map((pair, index) => (
              <div key={index}>
                <dt>{pair.label}</dt>
                <dd>{pair.value || '–'}</dd>
              </div>
            ))}
          </dl>
          <dl>
            {pairs1.concat(pairs2).map((pair, index) => (
              <div key={index}>
                <dt>{pair.label}</dt>
                <dd>{pair.value || '–'}</dd>
              </div>
            ))}
          </dl>
          <dl>
            {pairs1
              .concat(pairs2)
              .concat(pairs3)
              .map((pair, index) => (
                <div key={index}>
                  <dt>{pair.label}</dt>
                  <dd>{pair.value || '–'}</dd>
                </div>
              ))}
          </dl>
          {/* <dl>
            {generate(
              <div>
                <dt>Key</dt>
                {generate(<dd>Value</dd>)}
              </div>
            )}
          </dl> */}
        </SpaceBetween>
      </TextContent>
    </Container>
  );
}
