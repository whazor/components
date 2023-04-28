// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Breadcrumbs, Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';
import appLayoutLabels from '../app-layout/utils/labels';
import { Theme, applyTheme } from '~components/theming';


export default function () {
  const [alertVisible, setVisible] = useState(true);

  const lightsailTheme = {
    colorBackgroundButtonPrimaryActive: "#eb5f07",
    colorBackgroundButtonPrimaryDefault: "#ff9900",
    colorBackgroundButtonPrimaryDisabled: "#e9ebed",
    colorBackgroundButtonPrimaryHover: "#ec7211",
    colorBackgroundCellShaded: "#f8f8f8",
    colorBackgroundContainerContent: "#ffffff",
    colorBackgroundContainerHeader: "#ffffff",
    colorBackgroundControlChecked: "#0972d3",
    colorBackgroundControlDefault: "#ffffff",
    colorBackgroundControlDisabled: "#d1d5db",
    colorBackgroundDropdownItemDefault: "#ffffff",
    colorBackgroundDropdownItemFilterMatch: "#f2f8fd",
    colorBackgroundDropdownItemHover: "#f4f4f4",
    colorBackgroundHomeHeader: "#000716",
    colorBackgroundInputDefault: "#ffffff",
    colorBackgroundInputDisabled: "#e9ebed",
    colorBackgroundItemSelected: "#f2f8fd",
    colorBackgroundLayoutMain: "#ffffff",
    colorBackgroundNotificationBlue: "#0972d3",
    colorBackgroundNotificationGreen: "#037f0c",
    colorBackgroundNotificationRed: "#d91515",
    colorBackgroundStatusError: "#fff7f7",
    colorBackgroundStatusInfo: "#f2f8fd",
    colorBackgroundStatusSuccess: "#f2fcf3",
    colorBackgroundStatusWarning: "#ffffff",
    colorBackgroundToggleCheckedDisabled: "#b5d6f4",
    colorBorderButtonNormalDefault: "#0972d3",
    colorBorderButtonNormalDisabled: "#9ba7b6",
    colorBorderButtonNormalHover: "#033160",
    colorBorderButtonPrimaryDisabled: "#e9ebed",
    colorBorderContainerTop: "#transparent",
    colorBorderControlDefault: "#7d8998",
    colorBorderDividerDefault: "#e9ebed",
    colorBorderDropdownItemHover: "#7d8998",
    colorBorderInputDefault: "#7d8998",
    colorBorderItemFocused: "#0972d3",
    colorBorderItemSelected: "#0972d3",
    colorBorderStatusError: "#d91515",
    colorBorderStatusInfo: "#0972d3",
    colorBorderStatusSuccess: "#037f0c",
    colorBorderStatusWarning: "#7d8998",
    colorForegroundControlDefault: "#ffffff",
    colorForegroundControlDisabled: "#ffffff",
    colorTextAccent: "#0972d3",
    colorTextBodyDefault: "#000716",
    colorTextBodySecondary: "#414d5c",
    colorTextButtonNormalActive: "#033160",
    colorTextButtonNormalDefault: "#0972d3",
    colorTextButtonNormalHover: "#033160",
    colorTextButtonPrimaryActive: "#000716",
    colorTextButtonPrimaryDefault: "#000716",
    colorTextButtonPrimaryHover: "#000716",
    colorTextCounter: "#5f6b7a",
    colorTextDropdownItemFilterMatch: "#0972d3",
    colorTextDropdownItemHighlighted: "#000716",
    colorTextEmpty: "#5f6b7a",
    colorTextFormDefault: "#000716",
    colorTextFormSecondary: "#5f6b7a",
    colorTextGroupLabel: "#414d5c",
    colorTextHeadingDefault: "#000716",
    colorTextHeadingSecondary: "#414d5c",
    colorTextHomeHeaderDefault: "#ffffff",
    colorTextHomeHeaderSecondary: "#d1d5db",
    colorTextInputDisabled: "#9ba7b6",
    colorTextInputPlaceholder: "#5f6b7a",
    colorTextInteractiveDefault: "#414d5c",
    colorTextInteractiveDisabled: "#9ba7b6",
    colorTextInteractiveHover: "#000716",
    colorTextInteractiveInvertedDefault: "#d1d5db",
    colorTextInteractiveInvertedHover: "#fbfbfb",
    colorTextLabel: "#000716",
    colorTextLinkDefault: "#0972d3",
    colorTextLinkHover: "#033160",
    colorTextNotificationDefault: "#fbfbfb",
    colorTextStatusError: "#d91515",
    colorTextStatusInactive: "#5f6b7a",
    colorTextStatusInfo: "#0972d3",
    colorTextStatusSuccess: "#037f0c",
    colorTextStatusWarning: "#d91515",
    colorBoardPlaceholderActive: "#e9ebed",
    colorBoardPlaceholderHover: "#d3e7f9",
    colorDragPlaceholderActive: "#e9ebed",
    colorDragPlaceholderHover: "#d3e7f9"
 }
  
  const theme: Theme = {
    tokens: {
    },
    contexts: {
      // @ts-ignore
      header: {
        tokens: {
          ...lightsailTheme
        }
      }
   },
  };

  const { reset } = applyTheme({
    theme,
    baseThemeId: 'visual-refresh',
  });

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="form"
        ariaLabels={appLayoutLabels}
        breadcrumbs={<Breadcrumbs />}
        content={
          <ContentLayout
            header={
              <SpaceBetween size="m">
                <Header
                  variant="h1"
                  info={<Link>Info</Link>}
                  description="When you create a new distribution."
                  actions={<Button variant="primary">Create distribution</Button>}
                >
                  Create distribution
                </Header>
                {alertVisible && (
                  <Alert
                    statusIconAriaLabel="Info"
                    dismissible={true}
                    dismissAriaLabel="Close alert"
                    onDismiss={() => setVisible(false)}
                  >
                    Demo alert
                  </Alert>
                )}
              </SpaceBetween>
            }
          >
            <Containers />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
