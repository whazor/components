// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';

export default function Simple() {
  return (
    <article>
      <ScreenshotArea>
        <div data-analytics="customer-context" data-analytics-type="eventContext">
          <Button data-analytics="Submit" data-analytics-type="eventValue" variant="primary">
            Primary
          </Button>
        </div>
      </ScreenshotArea>
    </article>
  );
}
