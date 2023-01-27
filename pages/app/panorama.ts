// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

function collectTags(targetNode: HTMLElement) {
  const tags: Record<string, string> = {};
  let node: HTMLElement | null | undefined = targetNode;
  while (node) {
    const analyticsType = node?.getAttribute('data-analytics-type');
    if (analyticsType && tags[analyticsType] === undefined) {
      const value = node?.getAttribute('data-analytics');
      if (value) {
        tags[analyticsType] = value;
      }
    }

    node = node?.parentElement;
  }

  return tags;
}

export default function (functionName: string, opts: any) {
  const { targetNode, ...metric } = opts;

  const metricTags = collectTags(targetNode);
  const hydratedMetric = { ...metric, ...metricTags };

  console.log('Panorama event', functionName, hydratedMetric);
  console.log(JSON.stringify(hydratedMetric));
}
