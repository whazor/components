// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';

import { AttributeEditorForwardRefType, AttributeEditorProps } from './interfaces';
import { AdditionalInfo } from './additional-info';
import { Row } from './row';
import { callBoth } from './utils';

import styles from './styles.css.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import InternalBox from '../box/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import LiveRegion from '../internal/components/live-region';
import ScreenreaderOnly from '../internal/components/screenreader-only';

type InternalAttributeEditorProps<T> = SomeRequired<AttributeEditorProps<T>, 'items'> & InternalBaseComponentProps;

const InternalAttributeEditor = React.forwardRef(
  <T,>(
    {
      additionalInfo,
      disableAddButton,
      definition,
      items,
      isItemRemovable = () => true,
      empty,
      addButtonText,
      removeButtonText,
      i18nStrings,
      onAddButtonClick,
      onRemoveButtonClick,
      itemRemovalAriaLive,
      __internalRootRef = null,
      ...props
    }: InternalAttributeEditorProps<T>,
    ref: React.Ref<AttributeEditorProps.Ref>
  ) => {
    const [breakpoint, breakpointRef] = useContainerBreakpoints(['default', 'xxs', 'xs']);
    const removeButtonRefs = useRef<Array<ButtonProps.Ref | undefined>>([]);
    const wasNonEmpty = useRef<boolean>(false);
    const [removalAnnouncement, setRemovalAnnouncement] = useState<string>();

    const baseProps = getBaseProps(props);
    const isEmpty = items && items.length === 0;

    wasNonEmpty.current = wasNonEmpty.current || !isEmpty;

    useImperativeHandle(ref, () => ({
      focusRemoveButton(rowIndex: number) {
        removeButtonRefs.current[rowIndex]?.focus();
      },
    }));

    const mergedRef = useMergeRefs(breakpointRef, __internalRootRef);

    const additionalInfoId = useUniqueId('attribute-editor-info');
    const infoAriaDescribedBy = additionalInfo ? additionalInfoId : undefined;

    const updateRemovalAnnouncement = useCallback<NonNullable<typeof onRemoveButtonClick>>(
      event => setRemovalAnnouncement(itemRemovalAriaLive?.(event.detail.itemIndex)),
      [itemRemovalAriaLive]
    );

    return (
      <div {...baseProps} ref={mergedRef} className={clsx(baseProps.className, styles.root)}>
        <InternalBox margin={{ bottom: 'l' }}>
          {isEmpty && <div className={clsx(styles.empty, wasNonEmpty.current && styles['empty-appear'])}>{empty}</div>}
          {items.map((item, index) => (
            <Row
              key={index}
              index={index}
              breakpoint={breakpoint}
              item={item}
              definition={definition}
              i18nStrings={i18nStrings}
              removable={isItemRemovable(item)}
              removeButtonText={removeButtonText}
              removeButtonRefs={removeButtonRefs.current}
              onRemoveButtonClick={callBoth(onRemoveButtonClick, updateRemovalAnnouncement)}
            />
          ))}
        </InternalBox>

        <InternalButton
          className={styles['add-button']}
          disabled={disableAddButton}
          onClick={onAddButtonClick}
          formAction="none"
          __nativeAttributes={{ 'aria-describedby': infoAriaDescribedBy }}
        >
          {addButtonText}
        </InternalButton>
        {!!removalAnnouncement && !additionalInfo && (
          <LiveRegion delay={0} data-testid="no-additional-info-remove-announcement">
            <span>{removalAnnouncement}</span>
          </LiveRegion>
        )}
        {additionalInfo && (
          <AdditionalInfo id={infoAriaDescribedBy}>
            {!!removalAnnouncement && <ScreenreaderOnly>{removalAnnouncement}</ScreenreaderOnly>}
            {additionalInfo}
          </AdditionalInfo>
        )}
      </div>
    );
  }
) as AttributeEditorForwardRefType;

export default InternalAttributeEditor;
