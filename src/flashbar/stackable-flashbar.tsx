// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import customCssProps from '../internal/generated/custom-css-properties';
import { Flash, focusFlashById } from './flash';
import { FlashbarProps, StackedFlashbarProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import InternalIcon from '../icon/internal';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useContainerBreakpoints, useResizeObserver } from '../internal/hooks/container-queries';
import useFocusVisible from '../internal/hooks/focus-visible';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useReducedMotion, useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { getVisualContextClassname } from '../internal/components/visual-context';

import styles from './styles.css.js';
import { getFlashTypeCount, getStackedItems, StackableItem } from './utils';
import { animate, getDOMRects } from '../internal/animate';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { IconProps } from '../icon/interfaces';
import Name = IconProps.Name;

export { FlashbarProps };

const maxUnstackedItems = 1;

export default function StackableFlashbar({ items, ...restProps }: FlashbarProps & StackedFlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const baseProps = getBaseProps(restProps);

  const ref = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const mergedRef = useMergeRefs(ref, breakpointRef, __internalRootRef);

  const isFocusVisible = useFocusVisible();
  const isVisualRefresh = useVisualRefresh();

  const [previousItems, setPreviousItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(items);
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);
  const [enteringItems, setEnteringItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [exitingItems, setExitingItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);

  const collapsedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const expandedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const [initialAnimationState, setInitialAnimationState] = useState<Record<string | number, DOMRect> | null>(null);
  const listElementRef = useRef<HTMLUListElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);
  const [listTop, setListTop] = useState<number>();
  const bodyRef = useRef(document.body);

  const isReducedMotion = useReducedMotion(breakpointRef as any);
  const allItemsHaveId = useMemo(() => items.every(item => 'id' in item), [items]);

  const flashbarElementId = useUniqueId('flashbar');
  const toggleButtonElementId = useUniqueId('toggle-button');

  const getElementsToAnimate = useCallback(() => {
    const flashElements = isFlashbarStackExpanded ? expandedItemRefs.current : collapsedItemRefs.current;
    return { ...flashElements, toggleButton: toggleButtonRef.current };
  }, [isFlashbarStackExpanded]);

  const prepareAnimations = useCallback(() => {
    if (isReducedMotion) {
      return;
    }
    const rects = getDOMRects(getElementsToAnimate());
    setInitialAnimationState(rects);
  }, [getElementsToAnimate, isReducedMotion]);

  // Track new or removed item IDs in state to only trigger focus changes for newly added items.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  if (items) {
    const newItems = items.filter(({ id }) => id && !previousItems.some(item => item.id === id));
    const removedItems = previousItems.filter(({ id }) => id && !items.some(item => item.id === id));
    if (newItems.length > 0 || removedItems.length > 0) {
      setPreviousItems(items);
      setEnteringItems([...enteringItems, ...newItems]);
      setExitingItems([...exitingItems, ...removedItems]);
      const newFocusItems = newItems.filter(({ ariaRole }) => ariaRole === 'alert');
      if (newFocusItems.length > 0) {
        setNextFocusId(newFocusItems[0].id!);
      }
      // If not all items have ID, we can still animate collapse/expand transitions
      // because we can rely on each item's index in the original array,
      // but we can't do that when elements are added or removed, since the index changes.
      if (allItemsHaveId) {
        prepareAnimations();
      }
    }
  }

  useEffect(() => {
    if (nextFocusId) {
      focusFlashById(ref.current, nextFocusId);
    }
  }, [nextFocusId]);

  useEffect(() => {
    if (items.length <= maxUnstackedItems) {
      setIsFlashbarStackExpanded(false);
    }
  }, [items.length]);

  /**
   * All the flash items should have ids so we can identify which DOM element is being
   * removed from the DOM to animate it. Motion will be disabled if any of the provided
   * flash messages does not contain an `id`.
   */

  const animateFlash = !isReducedMotion;

  function toggleCollapseExpand() {
    prepareAnimations();
    setIsFlashbarStackExpanded(prev => !prev);
  }

  const applyBottomSpacing = useCallback(() => {
    // Apply vertical space between Flashbar and page bottom only when the Flashbar is reaching the end of the page.
    const listElement = listElementRef?.current;
    const parent = listElement?.parentElement;
    if (listElement && parent && listTop !== undefined) {
      const parent = listElement.parentElement;
      const desiredSpace = 32;
      const bottom = listTop + listElement.clientHeight;
      if (bottom > window.innerHeight - desiredSpace) {
        parent.style.paddingBottom = `${desiredSpace}px`;
      } else {
        parent.style.paddingBottom = '';
      }
    }
  }, [listTop]);

  useResizeObserver(bodyRef, applyBottomSpacing);

  useLayoutEffect(() => {
    // When `useLayoutEffect` is called, the DOM is updated but has not been painted yet,
    // so it's a good moment to trigger animations that will make calculations based on old and new DOM state.
    // The old state is kept in `initialAnimationState`
    // and the new state can be retrieved from the current DOM elements.

    if (listTop === undefined) {
      const listElement = listElementRef?.current;
      if (listElement) {
        setListTop(listElement.getBoundingClientRect().y);
      }
    }

    if (initialAnimationState) {
      applyBottomSpacing();
      animate({
        elements: getElementsToAnimate(),
        oldState: initialAnimationState,
        newElementInitialState: ({ top }) => ({ scale: 0.9, y: -0.2 * top }),
        onTransitionsEnd: () => setTransitioning(false),
      });
      setTransitioning(true);
      setInitialAnimationState(null);
    }
  }, [applyBottomSpacing, getElementsToAnimate, initialAnimationState, isFlashbarStackExpanded, listTop]);

  /**
   * If the `isFlashbarStacked` is true (which is only possible if `stackItems` is true)
   * then the first item should be rendered followed by two dummy items that visually indicate
   * two, three, or more items exist in the stack.
   */
  function renderStackedItems() {
    // When using the stacking feature, the items are shown in reverse order (last item on top)
    const reversedItems = items.slice().reverse();

    const countByType = getFlashTypeCount(items);

    const stackDepth = Math.min(3, items.length);

    const itemsToShow = isFlashbarStackExpanded
      ? reversedItems.map((item, index) => ({ ...item, expandedIndex: index }))
      : getStackedItems(reversedItems, stackDepth).map((item: StackableItem, index: number) => ({
          ...item,
          collapsedIndex: index,
        }));

    const { i18nStrings } = restProps;
    const ariaLabel = i18nStrings?.ariaLabel;
    const toggleButtonText = i18nStrings?.toggleButtonText;

    const getItemId = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      item.id ?? (item as StackableItem).expandedIndex ?? 0;

    // This check allows us to use the standard "enter" Transition only when the notification was not existing before.
    // If instead it was moved to the top of the stack but was already present in the array
    // (e.g, after dismissing another notification),
    // we need to use different, more custom and more controlled animations.
    const hasEntered = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      enteringItems.some(_item => _item.id && _item.id === item.id);
    const hasLeft = (item: StackableItem | FlashbarProps.MessageDefinition) => !('expandedIndex' in item);
    const hasEnteredOrLeft = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      hasEntered(item) || hasLeft(item);

    const showInnerContent = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      isFlashbarStackExpanded || hasLeft(item) || ('expandedIndex' in item && item.expandedIndex === 0);

    const shouldUseStandardAnimation = (item: StackableItem, index: number) => index === 0 && hasEnteredOrLeft(item);

    const getAnimationElementId = (item: StackableItem) => `flash-${getItemId(item)}`;

    const renderList = () => (
      <ul
        ref={listElementRef}
        className={clsx(
          styles['flash-list'],
          isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
          transitioning && styles['animation-running'],
          initialAnimationState && styles['animation-ready'],
          isVisualRefresh && styles['visual-refresh']
        )}
        id={flashbarElementId}
        aria-label={ariaLabel}
        aria-describedby={toggleButtonElementId}
        style={
          !isFlashbarStackExpanded || transitioning
            ? {
                [customCssProps.flashbarStackDepth]: stackDepth,
              }
            : undefined
        }
      >
        <TransitionGroup component={null}>
          {itemsToShow.map((item: StackableItem, index: number) => (
            <Transition
              key={getItemId(item)}
              in={!hasLeft(item)}
              onStatusChange={status => {
                if (status === 'entered') {
                  setEnteringItems([]);
                } else if (status === 'exited') {
                  setExitingItems([]);
                }
              }}
            >
              {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) => (
                <li
                  aria-hidden={!showInnerContent(item)}
                  className={
                    showInnerContent(item)
                      ? clsx(
                          styles['flash-list-item'],
                          !isFlashbarStackExpanded && styles.item,
                          !collapsedItemRefs.current[getAnimationElementId(item)] && styles['expanded-only']
                        )
                      : clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`], styles.item)
                  }
                  ref={element => {
                    if (isFlashbarStackExpanded) {
                      expandedItemRefs.current[getAnimationElementId(item)] = element;
                    } else {
                      collapsedItemRefs.current[getAnimationElementId(item)] = element;
                    }
                  }}
                  style={
                    !isFlashbarStackExpanded || transitioning
                      ? {
                          [customCssProps.flashbarStackIndex]:
                            (item as StackableItem).collapsedIndex ?? (item as StackableItem).expandedIndex ?? index,
                        }
                      : undefined
                  }
                  key={getItemId(item)}
                >
                  {showInnerContent(item) &&
                    renderItem(
                      item,
                      getItemId(item),
                      shouldUseStandardAnimation(item, index) ? transitionRootElement : undefined,
                      shouldUseStandardAnimation(item, index) ? state : undefined
                    )}
                </li>
              )}
            </Transition>
          ))}
        </TransitionGroup>
      </ul>
    );

    return (
      <>
        {isFlashbarStackExpanded && renderList()}
        {items.length > maxUnstackedItems && (
          <button
            aria-expanded={isFlashbarStackExpanded}
            aria-controls={flashbarElementId}
            id={toggleButtonElementId}
            className={clsx(
              styles.toggle,
              isVisualRefresh && styles['visual-refresh'],
              isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
              transitioning && styles['animation-running']
            )}
            onClick={toggleCollapseExpand}
            ref={toggleButtonRef}
            {...isFocusVisible}
          >
            {toggleButtonText && <h2 className={styles.text}>{toggleButtonText}</h2>}
            <span className={styles['types-count']}>
              <NotificationTypeCount
                iconName="status-negative"
                label={i18nStrings?.errorCountAriaLabel}
                count={countByType.error}
              />{' '}
              <NotificationTypeCount
                iconName="status-warning"
                label={i18nStrings?.warningCountAriaLabel}
                count={countByType.warning}
              />{' '}
              <NotificationTypeCount
                iconName="status-positive"
                label={i18nStrings?.successCountAriaLabel}
                count={countByType.success}
              />{' '}
              <NotificationTypeCount
                iconName="status-in-progress"
                label={i18nStrings?.inProgressCountAriaLabel}
                count={countByType.progress}
              />
            </span>
            <span className={clsx(styles.icon, isFlashbarStackExpanded && styles.expanded)}>
              <InternalIcon size="normal" name="angle-down" />
            </span>
          </button>
        )}
        {!isFlashbarStackExpanded && renderList()}
      </>
    );
  }

  /**
   * This is a shared render function for a single flashbar item to be used
   * by the stacking, motion, and non-motion item group render functions.
   */
  function renderItem(
    item: FlashbarProps.MessageDefinition,
    key: string | number,
    transitionRootElement?: React.Ref<HTMLDivElement> | undefined,
    transitionState?: string | undefined
  ) {
    return (
      <Flash
        // eslint-disable-next-line react/forbid-component-props
        className={clsx(
          getVisualContextClassname('flashbar'),
          animateFlash && styles['flash-with-motion'],
          isVisualRefresh && styles['flash-refresh']
        )}
        key={key}
        ref={transitionRootElement}
        transitionState={transitionState}
        {...item}
      />
    );
  }

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.flashbar, styles[`breakpoint-${breakpoint}`], styles.stack)}
      ref={mergedRef}
    >
      {renderStackedItems()}
    </div>
  );
}

const NotificationTypeCount = ({ iconName, label, count }: { iconName: Name; label?: string; count: number }) => (
  <span className={styles['type-count']}>
    <span aria-label={label} title={label}>
      <InternalIcon name={iconName} />
    </span>
    <span className={styles['count-number']}>{count}</span>
  </span>
);
