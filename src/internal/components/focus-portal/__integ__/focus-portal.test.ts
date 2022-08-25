// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';

function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new BasePageObject(browser);
    await browser.url('/#/light/focus-portal');
    await testFn(page);
  });
}

test(
  'should move focus into the portal when tabbing forward',
  setupTest(async page => {
    await page.click('[data-testid="before-portal"]');
    await page.keys(['Tab']);
    return expect(page.isFocused('[data-testid="first-inside-portal"]')).resolves.toBe(true);
  })
);

test(
  'should move focus out of the portal when tabbing backward',
  setupTest(async page => {
    await page.click('[data-testid="first-inside-portal"]');
    await page.keys(['Shift', 'Tab']);
    return expect(page.isFocused('[data-testid="before-portal"]')).resolves.toBe(true);
  })
);

test(
  'should move focus out of the portal when tabbing forward',
  setupTest(async page => {
    await page.click('[data-testid="last-inside-portal"]');
    await page.keys(['Tab']);
    return expect(page.isFocused('[data-testid="after-portal"]')).resolves.toBe(true);
  })
);

test(
  'should move focus into last element in the portal when tabbing backward',
  setupTest(async page => {
    await page.click('[data-testid="after-portal"]');
    await page.keys(['Shift', 'Tab']);
    return expect(page.isFocused('[data-testid="last-inside-portal"] input')).resolves.toBe(true);
  })
);

test(
  'should not behave as a portal if portal is tabbed into directly',
  setupTest(async page => {
    await page.click('[data-testid="before-container"]');
    await page.keys(['Tab']);
    return expect(page.isFocused('[data-testid="first-inside-portal"]')).resolves.toBe(true);
  })
);

test(
  'should behave as a portal if portal is focused into directly',
  setupTest(async page => {
    await page.click('[data-testid="last-inside-portal"]');
    await page.keys(['Tab']);
    return expect(page.isFocused('[data-testid="after-portal"]')).resolves.toBe(true);
  })
);
