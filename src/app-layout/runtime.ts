// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerItem } from './drawer/interfaces';

declare global {
  interface Window {
    awsUiConfig: AppLayoutRuntimeApi;
  }
}

export type DrawerConfig = Omit<DrawerItem, 'content'> & {
  mountContent: (container: HTMLElement) => void;
  unmountContent: (container: HTMLElement) => void;
};
type Listener = (drawers: Array<DrawerConfig>) => void;

interface AppLayoutRuntimeApi {
  registerAppLayout(listener: Listener): void;
  registerDrawer(config: DrawerConfig): void;
}

function loadApi() {
  if (typeof window === 'undefined') {
    return createApi();
  }
  if (!window.awsUiConfig) {
    window.awsUiConfig = createApi();
  }
  return window.awsUiConfig;
}

export const runtimeApi = loadApi();

function createApi(): AppLayoutRuntimeApi {
  const drawers: Array<DrawerConfig> = [];
  let appLayout: Listener | null = null;
  let updateTimeout: ReturnType<typeof setTimeout>;

  function scheduleUpdate() {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
      appLayout?.(drawers);
    });
  }

  return {
    registerAppLayout(listener) {
      appLayout = listener;
      scheduleUpdate();
    },
    registerDrawer(config) {
      drawers.push(config);
      scheduleUpdate();
    },
  };
}
