// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { IllustrationProps } from './interfaces';
import styles from './styles.css.js';

const allSkinOptions = Object.keys(styles)
  .filter(key => key.startsWith('human-skin-'))
  .map(key => styles[key]);

const allHairColorOptions = Object.keys(styles)
  .filter(key => key.startsWith('human-hair-'))
  .map(key => styles[key]);

function random(...options: Array<string | undefined>) {
  return options[Math.floor(Math.random() * options.length)];
}

function useOneOf(values: Array<string | undefined>) {
  return useState(() => random(...values))[0];
}

export { IllustrationProps };

export default function Illustration(props: IllustrationProps): JSX.Element {
  const { __internalRootRef } = useBaseComponent('Illustration');
  const baseProps = getBaseProps(props);

  const skinOverride = useOneOf(allSkinOptions);
  const hairColorOverride = useOneOf(allHairColorOptions);

  const isVisualRefresh = useVisualRefresh();

  if (!isVisualRefresh) {
    return <></>;
  }

  return (
    <div
      ref={__internalRootRef}
      {...baseProps}
      className={clsx(baseProps.className, styles.root, skinOverride, hairColorOverride)}
      aria-hidden={true}
    >
      {props.children}
    </div>
  );
}

applyDisplayName(Illustration, 'Illustration');
