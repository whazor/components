// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState, createRef, useEffect, useCallback, useMemo } from 'react';
import { TableProps } from './interfaces';
import { CellOffsets } from './internal';
import clsx from 'clsx';
interface StickyStyles {
  sticky: {
    left?: string;
    right?: string;
  };
  stuck: {
    paddingLeft?: string;
  };
}

interface StickyColumnParams {
  containerWidth: number | null;
  hasSelection: boolean;
  isWrapperScrollable: boolean;
  stickyColumns?: TableProps.StickyColumns;
  visibleColumnsLength: number;
  tableRefObject: React.RefObject<HTMLTableElement>;
  wrapperRefObject: React.RefObject<HTMLDivElement>;
}

export interface GetStickyColumnProperties {
  isSticky: boolean;
  isLastStickyLeft: boolean;
  isLastStickyRight: boolean;
  stickyStyles: StickyStyles;
}

// We allow the table to have a minimum of 148px of available space besides the sum of the widths of the sticky columns
// This value is an UX recommendation and is approximately 1/3 of our smallest breakpoint (465px)
const MINIMUM_SCROLLABLE_SPACE = 148;

const useCellOffsets = (tableCellRefs: Array<React.RefObject<HTMLTableCellElement>>) => {
  // This hook calculates the cumulative offsets of the cells in each column of the table, based on the widths of their siblings

  const [cellOffsets, setCellOffsets] = useState<CellOffsets>({ first: [], last: [] });

  const updateCellOffsets = useCallback(() => {
    // Calculate widths of all previous siblings of each table cell in the `tableCellRefs` array
    let firstColumnsOffsets = tableCellRefs
      .map(ref => (ref?.current?.previousSibling as HTMLTableCellElement)?.offsetWidth)
      .filter(Boolean);
    // Calculate cumulative widths of previous siblings to get the total offset of each of the cells
    firstColumnsOffsets = firstColumnsOffsets.map((elem, index) =>
      firstColumnsOffsets.slice(0, index + 1).reduce((a, b) => a + b)
    );

    // Calculate widths of all next siblings of each table cell in the `tableCellRefs` array
    let lastColumnsOffsets = tableCellRefs.map(ref => (ref?.current?.nextSibling as HTMLTableCellElement)?.offsetWidth);
    lastColumnsOffsets = lastColumnsOffsets.filter(Boolean).reverse();
    // Calculate cumulative widths of next siblings to get the the total offset of each of the cells
    lastColumnsOffsets = lastColumnsOffsets
      .map((elem, index) => lastColumnsOffsets.slice(0, index + 1).reduce((a, b) => a + b))
      .reverse();

    setCellOffsets({ first: [0, ...firstColumnsOffsets], last: [...lastColumnsOffsets, 0] });
  }, [tableCellRefs]);

  useLayoutEffect(() => {
    // Request animation frame to make sure effect runs after the browser's automatic table layout algorithm
    requestAnimationFrame(() => {
      updateCellOffsets();
    });
  }, [updateCellOffsets]);

  return { cellOffsets, updateCellOffsets };
};

interface GetStickyClassNamesProps {
  styles: { [key: string]: string };
  isSticky: boolean;
  isLastStickyLeft: boolean;
  isLastStickyRight: boolean;
  isStuckToTheLeft: boolean;
  isStuckToTheRight: boolean;
}

export function getStickyClassNames({
  styles,
  isSticky,
  isLastStickyLeft,
  isLastStickyRight,
  isStuckToTheLeft,
  isStuckToTheRight,
}: GetStickyClassNamesProps) {
  return clsx({
    [styles['sticky-cell']]: isSticky,
    [styles['sticky-cell-last-left']]: isStuckToTheLeft && isLastStickyLeft,
    [styles['sticky-cell-last-right']]: isStuckToTheRight && isLastStickyRight,
  });
}

export const useStickyColumns = ({
  containerWidth,
  hasSelection,
  isWrapperScrollable,
  stickyColumns,
  tableRefObject,
  visibleColumnsLength,
}: StickyColumnParams) => {
  // Check if there are any sticky columns
  const noStickyColumns = !stickyColumns || (stickyColumns.first === 0 && stickyColumns.last === 0);
  const columnsLengthWithSelection = visibleColumnsLength + (hasSelection ? 1 : 0);

  const [shouldDisable, setShouldDisable] = useState<boolean>(noStickyColumns);
  const [tableCellRefs, setTableCellRefs] = useState<Array<React.RefObject<HTMLTableCellElement>>>([]);
  const { cellOffsets, updateCellOffsets } = useCellOffsets(tableCellRefs);

  // Compute left table padding
  const table = tableRefObject.current;
  const tableLeftPadding = table ? parseInt(getComputedStyle(table).paddingLeft) : 0;

  const { first = 0, last = 0 } = stickyColumns || {};
  // Calculate the indexes of the last left and right sticky columns, taking into account the selection column
  const lastLeftStickyColumnIndex = first + (hasSelection ? 1 : 0);
  const lastRightStickyColumnIndex = columnsLengthWithSelection - 1 - last;

  // Get the width of the first and last sticky columns using the `cellOffsets` state, or use 0 if it's not available
  const firstStickyColumnsWidth = cellOffsets.first[lastLeftStickyColumnIndex] ?? 0;
  const lastStickyColumnsWidth = cellOffsets.last[lastRightStickyColumnIndex] ?? 0;

  // Calculate the sum of all sticky columns' widths
  const totalStickySpace = firstStickyColumnsWidth + lastStickyColumnsWidth;

  useEffect(() => {
    // Check if there is enough scrollable space for sticky columns to be enabled
    const hasEnoughScrollableSpace =
      totalStickySpace + MINIMUM_SCROLLABLE_SPACE + tableLeftPadding < (containerWidth ?? 0);

    // Determine if sticky columns should be disabled based on the conditions
    const shouldDisable = noStickyColumns || !isWrapperScrollable || !hasEnoughScrollableSpace;
    setShouldDisable(shouldDisable);
  }, [
    containerWidth,
    noStickyColumns,
    stickyColumns,
    totalStickySpace,
    visibleColumnsLength,
    tableLeftPadding,
    isWrapperScrollable,
  ]);

  useEffect(() => {
    // Create new refs for the visible columns and selection column, if present
    setTableCellRefs(tableCellRefs =>
      [...new Array(columnsLengthWithSelection)].map(
        (_: any, i: number) => tableCellRefs[i] || createRef<HTMLTableCellElement>()
      )
    );
  }, [columnsLengthWithSelection, hasSelection]);

  const getStickyStyles = useCallback(
    (colIndex: number, stickySide: 'left' | 'right' | '') => {
      if (!stickySide) {
        return { sticky: {}, stuck: {} };
      }

      const isFirstColumn = colIndex === 0;
      let stuck = {};
      if (isFirstColumn && !hasSelection && tableLeftPadding !== 0) {
        stuck = { paddingLeft: `${tableLeftPadding}px` };
      }
      // Determine the offset of the sticky column using the `cellOffsets` state object
      const offsetKey = stickySide === 'right' ? 'last' : 'first';
      const stickyColumnOffset = cellOffsets[offsetKey]?.[colIndex + (hasSelection ? 1 : 0)];

      return {
        sticky: {
          [stickySide]: `${stickyColumnOffset}px`,
        },
        stuck,
      };
    },
    [cellOffsets, hasSelection, tableLeftPadding]
  );

  const getStickyColumnProperties = React.useCallback(
    (colIndex: number): GetStickyColumnProperties => {
      const disabledStickyColumn = {
        isSticky: false,
        isLastStickyLeft: false,
        isLastStickyRight: false,
        stickyStyles: { sticky: {}, stuck: {} },
      };

      if (shouldDisable) {
        return disabledStickyColumn;
      }

      // Determine if the column is sticky on the left or right side
      const isStickyLeft = colIndex + 1 <= (stickyColumns?.first ?? 0);
      const isStickyRight = colIndex + 1 > visibleColumnsLength - (stickyColumns?.last ?? 0);

      // Determine if the column is the last left or right sticky column
      const isLastStickyLeft = colIndex + 1 === stickyColumns?.first;
      const isLastStickyRight = colIndex === visibleColumnsLength - (stickyColumns?.last ?? 0);

      // Get the sticky styles
      const stickySide = isStickyLeft ? 'left' : isStickyRight ? 'right' : '';
      const stickyStyles = getStickyStyles(colIndex, stickySide);
      return {
        isSticky: isStickyLeft || isStickyRight,
        isLastStickyLeft,
        isLastStickyRight,
        stickyStyles,
      };
    },
    [getStickyStyles, shouldDisable, stickyColumns, visibleColumnsLength]
  );

  const wrapperScrollPadding = useMemo(() => {
    return { left: firstStickyColumnsWidth, right: lastStickyColumnsWidth };
  }, [firstStickyColumnsWidth, lastStickyColumnsWidth]);

  return {
    tableCellRefs,
    getStickyColumnProperties,
    shouldDisableStickyColumns: shouldDisable,
    wrapperScrollPadding,
    updateCellOffsets,
    cellOffsets,
  };
};
