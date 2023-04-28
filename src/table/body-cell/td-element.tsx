// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';
import { StickyColumnsModel, useStickyCellStyles } from '../use-sticky-columns.js';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode/index.js';

export interface TableTdElementProps {
  className?: string;
  style?: React.CSSProperties;
  wrapLines: boolean | undefined;
  isFirstRow: boolean;
  isLastRow: boolean;
  isSelected: boolean;
  isNextSelected: boolean;
  isPrevSelected: boolean;
  nativeAttributes?: Omit<React.HTMLAttributes<HTMLTableCellElement>, 'style' | 'className' | 'onClick'>;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: React.ReactNode;
  isEvenRow?: boolean;
  stripedRows?: boolean;
  hasSelection?: boolean;
  hasFooter?: boolean;
  isVisualRefresh?: boolean;
  stickyState: StickyColumnsModel;
  columnId: string;
}

export const TableTdElement = ({
  className,
  style,
  children,
  wrapLines,
  isFirstRow,
  isLastRow,
  isSelected,
  isNextSelected,
  isPrevSelected,
  nativeAttributes,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isEvenRow,
  stripedRows,
  hasSelection,
  hasFooter,
  columnId,
  stickyState,
}: TableTdElementProps) => {
  const isVisualRefresh = useVisualRefresh();
  const stickyStyles = useStickyCellStyles({
    stickyColumns: stickyState,
    columnId,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-pad-left']]: !!props?.padLeft,
      [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      [styles['sticky-cell-last-right']]: !!props?.lastRight,
    }),
  });

  return (
    <td
      style={{ ...style, ...stickyStyles.style }}
      className={clsx(
        className,
        styles['body-cell'],
        wrapLines && styles['body-cell-wrap'],
        isFirstRow && styles['body-cell-first-row'],
        isLastRow && styles['body-cell-last-row'],
        isSelected && styles['body-cell-selected'],
        isNextSelected && styles['body-cell-next-selected'],
        isPrevSelected && styles['body-cell-prev-selected'],
        !isEvenRow && stripedRows && styles['body-cell-shaded'],
        stripedRows && styles['has-striped-rows'],
        isVisualRefresh && styles['is-visual-refresh'],
        hasSelection && styles['has-selection'],
        hasFooter && styles['has-footer'],
        stickyStyles.className
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={stickyStyles.ref}
      {...nativeAttributes}
    >
      {children}
    </td>
  );
};
