// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Portal from '../portal';
import FocusDetector from '../focus-detector';
import { getFirstTabbable, getLastTabbable, getTabbables } from '../../utils/tabbables';

export interface FocusPortalProps {
  container?: Element;
  children?: React.ReactNode;
}

export default function FocusPortal({ container, children }: FocusPortalProps) {
  // As much as we can fake browser focus moves, one thing we can't fake is the
  // ability to tab past the end of the browser and into the chrome (tabs,
  // address bar, etc.). So if the user tabs into this "organically", we
  // shouldn't activate the portal guards around the children.
  const [active, setActive] = useState(false);

  // Focus the element before this component in the DOM tree.
  const beforeSelfRef = useRef<HTMLDivElement | null>(null);
  const focusBeforeSelf = () => {
    const allTabbableElements = getTabbables(document.documentElement);
    const beforeIndex = beforeSelfRef.current ? allTabbableElements.indexOf(beforeSelfRef.current) : -1;
    if (beforeIndex !== -1 && beforeIndex !== 0) {
      allTabbableElements[beforeIndex - 1].focus();
    } else {
      document.body.focus();
    }
  };

  // Focus the element after this component in the DOM tree.
  const afterSelfRef = useRef<HTMLDivElement | null>(null);
  const focusAfterSelf = () => {
    if (afterSelfRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(afterSelfRef.current);
      if (anchorIndex !== -1 && anchorIndex !== allTabbableElements.length - 1) {
        allTabbableElements[anchorIndex + 1].focus();
        return true;
      }
    }
  };

  // Focus the first (or last) element in the children slot.
  const childrenWrapperRef = useRef<HTMLDivElement | null>(null);
  const focusInsideChildren = (backwards = false) => {
    if (childrenWrapperRef.current) {
      const element = backwards
        ? getLastTabbable(childrenWrapperRef.current)
        : getFirstTabbable(childrenWrapperRef.current);
      if (element) {
        element.focus();
        return true;
      }
      return false;
    }
  };

  // Focus the element before the children slot in the DOM tree.
  // This is the element before the portal.
  const beforeChildrenRef = useRef<HTMLDivElement | null>(null);
  const focusBeforeChildren = () => {
    if (beforeChildrenRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(beforeChildrenRef.current);
      if (anchorIndex !== -1 && anchorIndex !== 0) {
        allTabbableElements[anchorIndex - 1].focus();
        return true;
      }
    }
  };

  // Focus the element before the children slot in the DOM tree.
  // This is the element after the portal.
  const afterChildrenRef = useRef<HTMLDivElement | null>(null);
  const focusAfterChildren = () => {
    if (afterChildrenRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(afterChildrenRef.current);
      if (anchorIndex !== -1 && anchorIndex !== allTabbableElements.length - 1) {
        allTabbableElements[anchorIndex + 1].focus();
        return true;
      }
    }
  };

  return (
    <>
      {/*
        Traps typical forward focus and moves it into the children. If there
        aren't any focusable elements inside the children, we skip past the
        portal and "emulate" standard browser behavior.
      */}
      <FocusDetector
        ref={beforeSelfRef}
        disabled={!children}
        onFocus={() => {
          const isFocusInsideChildren = focusInsideChildren();
          if (isFocusInsideChildren) {
            setActive(true);
          } else {
            focusAfterSelf();
          }
        }}
      />

      <Portal container={container}>
        {/*
          Most likely, this was triggered by a Shift+Tab inside the portal.
          If it was, we move to the element before this one in the tab order.
          If not, we came here "organically", meaning we tabbed all the way to
          the end of the DOM and stumbled into the portal. If that's the case,
          we skip past the portal.
        */}
        <FocusDetector
          ref={beforeChildrenRef}
          disabled={!active}
          onFocus={event => {
            if (!childrenWrapperRef.current?.contains(event.relatedTarget)) {
              focusAfterChildren();
            }
          }}
        />

        {/*
          This is where the portal-ed children are rendered. A wrapper is
          needed so that we can go through it and determine the first/last
          focusable elements.
        */}
        <div
          ref={childrenWrapperRef}
          onFocus={event => {
            if (event.relatedTarget === null) {
              setActive(true);
            }
          }}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setActive(false);
            }
            if (event.relatedTarget === afterChildrenRef.current) {
              focusAfterSelf();
            }
            if (event.relatedTarget === beforeChildrenRef.current) {
              focusBeforeSelf();
            }
          }}
        >
          {children}
        </div>

        {/*
          Most likely, this was triggered by a Tab past the end of the portal.
          If it was, we move back into the non-portal DOM tree and tab forward.
          If not, we came here "organically", meaning we tabbed backwards from
          the end of the document to here . If that's the case, we skip past
          to the element before the portal.
        */}
        <FocusDetector
          ref={afterChildrenRef}
          disabled={!active}
          onFocus={event => {
            if (!childrenWrapperRef.current?.contains(event.relatedTarget)) {
              focusBeforeChildren();
            }
          }}
        />
      </Portal>

      {/*
        Lastly, this can only be triggered by a Shift+Tab from after the
        component. So we move focus into the last element inside the portal.
      */}
      <FocusDetector
        ref={afterSelfRef}
        disabled={!children}
        onFocus={() => {
          const isFocusInsideChildren = focusInsideChildren(true);
          if (isFocusInsideChildren) {
            setActive(true);
          } else {
            focusBeforeSelf();
          }
        }}
      />
    </>
  );
}
