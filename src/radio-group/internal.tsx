// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { RadioGroupProps } from './interfaces';
import RadioButton from './radio-button';
import styles from './styles.css.js';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import useRadioGroupForwardFocus from '../internal/hooks/forward-focus/radio-group';

type InternalRadioGroupProps = RadioGroupProps & InternalBaseComponentProps;

const InternalRadioGroup = React.forwardRef(
  (
    {
      name,
      value,
      items,
      ariaLabel,
      ariaRequired,
      onChange,
      __internalRootRef = null,
      ...props
    }: InternalRadioGroupProps,
    ref: React.Ref<RadioGroupProps.Ref>
  ) => {
    const { ariaDescribedby, ariaLabelledby } = useFormFieldContext(props);
    const baseProps = getBaseProps(props);
    const generatedName = useUniqueId('awsui-radio-');
    const secondaryControlName = useUniqueId('awsui-radio-secondary-content-');

    const [radioButtonRef, radioButtonRefIndex] = useRadioGroupForwardFocus(ref, items, value);

    const secondaryControlExists = items?.some(item => item?.secondaryControl);
    const currentSecondaryControl = items?.reduce((controls, item) => {
      if (item.value === value && item.secondaryControl) {
        return [...controls, item.secondaryControl];
      }
      return controls;
    }, [] as React.ReactNode[]);

    const groupProps: React.HTMLAttributes<HTMLDivElement> = {
      ...baseProps,
      ...(secondaryControlExists ? { 'aria-controls': secondaryControlName } : {}),
    };

    return (
      <>
        <div
          role="radiogroup"
          aria-labelledby={ariaLabelledby}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-required={ariaRequired}
          {...groupProps}
          className={clsx(baseProps.className, styles.root)}
          ref={__internalRootRef}
        >
          {items &&
            items.map((item, index) => (
              <RadioButton
                key={item.value}
                ref={index === radioButtonRefIndex ? radioButtonRef : undefined}
                checked={item.value === value}
                name={name || generatedName}
                value={item.value}
                label={item.label}
                description={item.description}
                disabled={item.disabled}
                onChange={onChange}
                controlId={item.controlId}
              />
            ))}
        </div>
        {secondaryControlExists ? (
          <div className={styles['secondary-controls']} id={secondaryControlName}>
            {currentSecondaryControl}
          </div>
        ) : null}
      </>
    );
  }
);

export default InternalRadioGroup;
