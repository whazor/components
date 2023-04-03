// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useContext } from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';

import { TutorialPanelProps } from './interfaces';
import TutorialList from './components/tutorial-list';
import TutorialDetailView from './components/tutorial-detail-view';
import { hotspotContext } from '../annotation-context/context';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

export { TutorialPanelProps };

const defaultFilteringFunction = (tutorial: TutorialPanelProps.Tutorial, searchTerm: string) => {
  if (searchTerm === '') {
    return true;
  }
  return tutorial.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
};

export default function TutorialPanel({
  i18nStrings,
  loading,
  tutorials,
  onFeedbackClick,
  downloadUrl,
  // Filtering is not available in the Beta release.
  //filteringFunction: customFilteringFunction,
  ...restProps
}: TutorialPanelProps) {
  const { __internalRootRef } = useBaseComponent('TutorialPanel');

  const baseProps = getBaseProps(restProps);
  const context = useContext(hotspotContext);

  //const filteringFunction = customFilteringFunction ?? defaultFilteringFunction;
  const filteringFunction = defaultFilteringFunction;

  return (
    <>
      <div {...baseProps} className={clsx(baseProps.className, styles['tutorial-panel'])} ref={__internalRootRef}>
        {context.currentTutorial ? (
          <TutorialDetailView
            i18nStrings={i18nStrings}
            tutorial={context.currentTutorial}
            onExitTutorial={context.onExitTutorial}
            currentStepIndex={context.currentStepIndex}
            onFeedbackClick={onFeedbackClick}
          />
        ) : (
          <TutorialList
            i18nStrings={i18nStrings}
            tutorials={tutorials}
            loading={loading}
            onStartTutorial={context.onStartTutorial}
            filteringFunction={filteringFunction}
            downloadUrl={downloadUrl}
          />
        )}
      </div>
    </>
  );
}

applyDisplayName(TutorialPanel, 'TutorialPanel');
