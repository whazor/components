// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import ColumnLayout from '~components/column-layout';
import ExpandableSection from '~components/expandable-section';
import SpaceBetween from '~components/space-between';

export default function ColumnLayoutPage() {
  return (
    <>
      <h1>Column layout demo</h1>
      <ScreenshotArea
        style={{
          // text-grid variant has -2rem outer margins that we need to accommodate
          padding: '2rem',
        }}
      >
        <h2>With borders</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all">
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>With gutters disabled</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all" disableGutters={true}>
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>text-grid variant</h2>

        <ColumnLayout variant="text-grid" borders="none" columns={3}>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </ColumnLayout>

        <h2>Nested with borders</h2>

        <ColumnLayout columns={3} borders="vertical">
          <div>a</div>
          <ColumnLayout columns={2}>
            <div>b</div>
            <div>b</div>
          </ColumnLayout>
          <div>a</div>
        </ColumnLayout>

        <h2>Expandable section with bordered column layout</h2>
        <ExpandableSection headerText="Expandable section" expanded={true}>
          <ColumnLayout columns={4} borders="all">
            {[...Array(8)].map((_, index) => (
              <div key={index}>Option {index + 1}</div>
            ))}
          </ColumnLayout>
        </ExpandableSection>

        <h2>Expandable section with text-grid column layout</h2>
        <ExpandableSection headerText="Expandable section" variant="default" expanded={true}>
          <ColumnLayout variant="text-grid" borders="none" columns={3}>
            {[...Array(6)].map((_, index) => (
              <SpaceBetween size="l" key={index}>
                <div>Option {index + 1 + 'a'}</div>
                <div>Option {index + 1 + 'b'}</div>
              </SpaceBetween>
            ))}
          </ColumnLayout>
        </ExpandableSection>
      </ScreenshotArea>
    </>
  );
}
