// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Suspense, useContext, useEffect } from 'react';
import { render } from 'react-dom';
import { HashRouter, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import { applyMode, applyDensity, disableMotion } from '@cloudscape-design/global-styles';
import './polyfills';

// import font-size reset and Ember font
import '@cloudscape-design/global-styles/index.css';
// screenshot test overrides
import styles from './styles.scss';

import PageView from './components/page-view';
import IndexPage from './components/index-page';
import Header from './components/header';
import StrictModeWrapper from './components/strict-mode-wrapper';
import AppContext, { AppContextProvider, parseQuery } from './app-context';
import { I18NContextProvider } from '~components/i18n/context';

function App() {
  const {
    mode,
    pageId,
    urlParams: { density, motionDisabled },
  } = useContext(AppContext);

  const isAppLayout =
    pageId !== undefined && (pageId.indexOf('app-layout') > -1 || pageId.indexOf('content-layout') > -1);
  // AppLayout already contains <main>
  // Also, AppLayout pages should resemble the ConsoleNav 2.0 styles
  const ContentTag = isAppLayout ? 'div' : 'main';
  const isMacOS = navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;

  useEffect(() => {
    applyMode(mode ?? null);
  }, [mode]);

  useEffect(() => {
    applyDensity(density ?? null);
  }, [density]);

  useEffect(() => {
    disableMotion(motionDisabled);
  }, [motionDisabled]);

  useEffect(() => {
    if (isMacOS) {
      document.body.classList.add(styles.macos);
    } else {
      document.body.classList.remove(styles.macos);
    }
  }, [isMacOS]);

  if (!mode) {
    return <Redirect to="/light/" />;
  }
  return (
    <StrictModeWrapper pageId={pageId}>
      <Suspense fallback={<span>Loading...</span>}>
        <ContentTag>
          <Header sticky={isAppLayout && pageId !== undefined && pageId.indexOf('legacy') === -1} />
          {pageId ? <PageView pageId={pageId} /> : <IndexPage />}
        </ContentTag>
      </Suspense>
    </StrictModeWrapper>
  );
}

async function doRender() {
  const history = createHashHistory();
  const { visualRefresh, locale } = parseQuery(history.location.search);

  // The VR class needs to be set before any React rendering occurs.
  document.body.classList.toggle('awsui-visual-refresh', visualRefresh);

  document.documentElement.lang = locale;

  const messages = await require(`../../lib/components/i18n/messages/all.${
    locale === 'en-US' ? 'default' : locale
  }.json`);

  render(
    <HashRouter>
      <I18NContextProvider
        messages={{
          '@cloudscape-design/components': messages,
        }}
      >
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </I18NContextProvider>
    </HashRouter>,
    document.getElementById('app')
  );
}

doRender();
