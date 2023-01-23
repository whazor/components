// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Pagination from '~components/pagination';
import Table from '~components/table';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import Box from '~components/box';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { allItems, TableItem } from './table.data';
import { columnDefinitions, filteringProperties } from './common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { paginationLabels, pageSizeOptions, visibleContentOptions } from '../table/shared-configs';

export default function () {
  const [tokenLimit, setTokenLimit] = useState<number>();
  const [hideOperations, setHideOperations] = useState<boolean>(false);
  const [disableFreeTextFiltering, setDisableFreeText] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 20,
    visibleContent: ['id', 'type', 'dnsName', 'state'],
    wrapLines: false,

    // set to true for default striped rows.
    stripedRows: true,
  });
  const { items, collectionProps, actions, propertyFilterProps, paginationProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            We can’t find a match.
          </Box>
          <Button
            onClick={() => actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })}
          >
            Clear filter
          </Button>
        </Box>
      ),
      filteringProperties,
    },
    sorting: {},
    pagination: { pageSize: 20 },
  });

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <ul>
          <li>
            <label>
              Token limit
              <input
                type="number"
                value={tokenLimit === undefined ? '' : tokenLimit}
                onChange={e => setTokenLimit(parseInt(e.target.value))}
              />
            </label>
          </li>
          <li>
            <label>
              Toggle hideOperations
              <input type="checkbox" checked={hideOperations} onChange={() => setHideOperations(!hideOperations)} />
            </label>
          </li>
          <li>
            <label>
              Toggle disableFreeTextFiltering
              <input
                type="checkbox"
                checked={disableFreeTextFiltering}
                onChange={() => setDisableFreeText(!disableFreeTextFiltering)}
              />
            </label>
          </li>
        </ul>
        <Table<TableItem>
          header={
            <Header
              headingTagOverride={'h1'}
              actions={
                <SpaceBetween size="xs" direction="horizontal">
                  <Button>View details</Button>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                  <Button variant="primary">Create distribution</Button>
                </SpaceBetween>
              }
            >
              Instances
            </Header>
          }
          items={items}
          {...collectionProps}
          // filter={
          //   <PropertyFilter
          //     {...propertyFilterProps}
          //     virtualScroll={true}
          //     countText={`${items.length} matches`}
          //     i18nStrings={i18nStrings}
          //     tokenLimit={tokenLimit}
          //     hideOperations={hideOperations}
          //     disableFreeTextFiltering={disableFreeTextFiltering}
          //   />
          // }
          pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              pageSizePreference={{
                title: 'Select page size',
                options: pageSizeOptions,
              }}
              visibleContentPreference={{
                title: 'Select visible columns',
                options: visibleContentOptions,
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
            />
          }
          columnDefinitions={columnDefinitions}
        />
      </ScreenshotArea>
    </>
  );
}
