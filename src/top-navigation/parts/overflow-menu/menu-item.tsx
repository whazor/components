// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { fireCancelableEvent, isPlainLeftClick } from '../../../internal/events';
import { useUniqueId } from '../../../internal/hooks/use-unique-id';
import useFocusVisible from '../../../internal/hooks/focus-visible';

import { LinkProps } from '../../../link/interfaces';
import { ButtonDropdownProps } from '../../../button-dropdown/interfaces';
import InternalIcon from '../../../icon/internal';

import { useNavigate } from './router';
import { TopNavigationProps } from '../../interfaces';
import styles from '../../styles.css.js';

interface ListItemProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  context?: 'dropdown-menu';
  children?: React.ReactNode;
  testId?: string;
}

const ListItem = ({ children, startIcon, endIcon }: ListItemProps) => {
  return (
    <>
      {!!startIcon && <span className={styles['overflow-menu-list-item-icon']}>{startIcon}</span>}
      <span className={styles['overflow-menu-list-item-text']}>{children}</span>
      {!!endIcon && endIcon}
    </>
  );
};

interface LinkItemProps extends ButtonItemProps, Pick<LinkProps, 'href' | 'external'> {}

const LinkItem = forwardRef(
  (
    { children, external, href, startIcon, endIcon, onFollow, context, testId }: LinkItemProps,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const focusVisible = useFocusVisible();
    const rel = external ? 'noopener noreferrer' : undefined;
    const target = external ? '_blank' : undefined;

    const anchorProps = {
      rel,
      target,
      href,
      onClick(event: React.MouseEvent) {
        if (isPlainLeftClick(event)) {
          onFollow?.(event);
        }
      },
    };

    const buttonProps = {
      role: 'button',
      tabIndex: 0,
      onKeyDown(event: React.KeyboardEvent) {
        if (event.key === ' ') {
          event.preventDefault();
        }
      },
      onKeyUp(event: React.KeyboardEvent) {
        if (event.key === ' ' || event.key === 'Enter') {
          onFollow?.(event);
        }
      },
      onClick: onFollow,
    };

    return (
      <a
        ref={ref}
        className={clsx(
          styles['overflow-menu-control'],
          styles['overflow-menu-control-link'],
          context && styles[`overflow-menu-control-${context}`]
        )}
        {...(typeof href === 'string' ? anchorProps : buttonProps)}
        {...focusVisible}
        {...(testId ? { 'data-testid': testId } : {})}
      >
        <ListItem startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ListItem>
      </a>
    );
  }
);

interface ButtonItemProps extends ListItemProps {
  onFollow?: (event: React.SyntheticEvent) => void;
}

const ButtonItem = forwardRef(
  (
    { children, startIcon, endIcon, onFollow: onClick, testId }: ButtonItemProps & { testId?: string },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const focusVisible = useFocusVisible();

    return (
      <button
        ref={ref}
        className={styles['overflow-menu-control']}
        onClick={onClick}
        {...focusVisible}
        {...(typeof testId === 'string' ? { 'data-testid': testId } : {})}
      >
        <ListItem startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ListItem>
      </button>
    );
  }
);

const NavigationItem = forwardRef(
  (
    {
      startIcon,
      children,
      index,
      testId,
      ...definition
    }: ButtonItemProps & TopNavigationProps.MenuDropdownUtility & { index: number; testId?: string },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const navigate = useNavigate();
    return (
      <ButtonItem
        ref={ref}
        startIcon={startIcon}
        endIcon={<InternalIcon name="angle-right" />}
        testId={testId}
        onFollow={() =>
          navigate('dropdown-menu', {
            definition,
            headerText: definition.text || definition.title,
            headerSecondaryText: definition.description,
            utilityIndex: index,
          })
        }
      >
        {children}
      </ButtonItem>
    );
  }
);

const ExpandableItem: React.FC<
  ButtonItemProps & ButtonDropdownProps.ItemGroup & { onItemClick: (item: ButtonDropdownProps.Item) => void }
> = ({ children, onItemClick, ...definition }) => {
  const focusVisible = useFocusVisible();
  const [expanded, setExpanded] = useState(false);
  const headerId = useUniqueId('overflow-menu-item');

  return (
    <>
      <button
        className={clsx(styles['overflow-menu-control'], styles['overflow-menu-control-expandable-menu-trigger'])}
        onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}
        {...focusVisible}
      >
        <ListItem
          endIcon={
            <span className={clsx(styles.icon, expanded && styles.expanded)}>
              <InternalIcon name="caret-up-filled" />
            </span>
          }
        >
          <span id={headerId}>{children}</span>
        </ListItem>
      </button>
      {!!expanded && (
        <ul
          className={clsx(styles['overflow-menu-list'], styles['overflow-menu-list-submenu'])}
          aria-labelledby={headerId}
        >
          {definition.items.map((item, index) => {
            const isGroup = typeof (item as ButtonDropdownProps.ItemGroup).items !== 'undefined';

            return (
              <li
                key={index}
                className={clsx(styles[`overflow-menu-list-item`], styles[`overflow-menu-list-item-dropdown-menu`])}
              >
                {dropdownComponentFactory(item, isGroup, onItemClick)}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

function utilityComponentFactory(
  utility: TopNavigationProps.Utility,
  index: number,
  ref?: React.Ref<HTMLAnchorElement & HTMLButtonElement>
) {
  const label = utility.text || utility.title;
  const hasIcon = !!utility.iconName || !!utility.iconUrl || !!utility.iconAlt || !!utility.iconSvg;
  const startIcon = hasIcon && (
    <InternalIcon name={utility.iconName} url={utility.iconUrl} alt={utility.iconAlt} svg={utility.iconSvg} />
  );

  switch (utility.type) {
    case 'button': {
      const handleClick = (event: Event | React.SyntheticEvent) => {
        fireCancelableEvent(utility.onClick, {}, event);
      };

      if (utility.variant === 'primary-button') {
        return (
          <ButtonItem ref={ref} startIcon={startIcon} onFollow={handleClick} testId={`__${index}`}>
            {label}
          </ButtonItem>
        );
      }

      return (
        <LinkItem
          ref={ref}
          startIcon={startIcon}
          href={utility.href}
          external={utility.external}
          testId={`__${index}`}
          onFollow={handleClick}
        >
          {label}
          {!!utility.external && (
            <>
              {' '}
              <span aria-label={utility.externalIconAriaLabel} role={utility.externalIconAriaLabel ? 'img' : undefined}>
                <InternalIcon name="external" size="normal" />
              </span>
            </>
          )}
        </LinkItem>
      );
    }
    case 'menu-dropdown': {
      return (
        <NavigationItem
          ref={ref}
          startIcon={startIcon}
          index={index}
          {...(utility as TopNavigationProps.MenuDropdownUtility)}
          testId={`__${index}`}
        >
          {label}
        </NavigationItem>
      );
    }
  }
}

function dropdownComponentFactory(
  item: ButtonDropdownProps.ItemOrGroup,
  expandable: boolean,
  onItemClick: (item: ButtonDropdownProps.Item) => void
) {
  const label = item.text;
  const hasIcon = !!item.iconName || !!item.iconUrl || !!item.iconAlt || !!item.iconSvg;
  const startIcon = hasIcon && (
    <InternalIcon name={item.iconName} url={item.iconUrl} alt={item.iconAlt} svg={item.iconSvg} />
  );

  if (expandable) {
    return (
      <ExpandableItem {...(item as ButtonDropdownProps.ItemGroup)} onItemClick={onItemClick}>
        {label}
      </ExpandableItem>
    );
  }

  return (
    <LinkItem
      startIcon={startIcon}
      href={item.href}
      external={item.external}
      context="dropdown-menu"
      testId={item.id}
      onFollow={() => onItemClick(item as ButtonDropdownProps.Item)}
    >
      {label}
      {!!item.external && (
        <>
          {' '}
          <span aria-label={item.externalIconAriaLabel} role={item.externalIconAriaLabel ? 'img' : undefined}>
            <InternalIcon name="external" size="normal" />
          </span>
        </>
      )}
    </LinkItem>
  );
}

type UtilityMenuItemProps = TopNavigationProps.Utility & { index: number };

export const UtilityMenuItem = forwardRef(
  ({ index, ...props }: UtilityMenuItemProps, ref: React.Ref<HTMLAnchorElement & HTMLButtonElement>) => {
    return (
      <li className={clsx(styles[`overflow-menu-list-item`], styles[`overflow-menu-list-item-utility`])}>
        {utilityComponentFactory(props, index, ref)}
      </li>
    );
  }
);

type SubmenuItemProps = ButtonDropdownProps.ItemOrGroup & { onItemClick: (item: ButtonDropdownProps.Item) => void };

export const SubmenuItem = (props: SubmenuItemProps) => {
  const expandable = typeof (props as ButtonDropdownProps.ItemGroup).items !== 'undefined';

  return (
    <li
      className={clsx(
        styles[`overflow-menu-list-item`],
        styles[`overflow-menu-list-item-submenu`],
        expandable && styles[`overflow-menu-list-item-expandable`]
      )}
    >
      {dropdownComponentFactory(props, expandable, props.onItemClick)}
    </li>
  );
};
