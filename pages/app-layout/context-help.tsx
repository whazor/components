// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import HelpPanel from '~components/help-panel';
import '~components/app-layout/runtime';

function Content() {
  useEffect(() => {
    console.log('mounted');
    return () => console.log('unmounted');
  }, []);
  return <HelpPanel header={<h2>Security</h2>}>Everyone needs it.</HelpPanel>;
}

window.awsUiConfig.registerDrawer({
  ariaLabels: {
    closeButton: 'Security close button',
    content: 'Security drawer content',
    triggerButton: 'Security trigger button',
    resizeHandle: 'Security resize handle',
  },
  mountContent: container => {
    ReactDOM.render(<Content />, container);
  },
  unmountContent: container => unmountComponentAtNode(container),
  id: 'security',
  resizable: true,
  size: 320,

  trigger: {
    iconName: 'security',
  },
});
