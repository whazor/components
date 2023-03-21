// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import FormField from '~components/form-field';
import Table from '~components/table';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Pagination from '~components/pagination';
import Input from '~components/input';
import Header from '~components/header';
import Button from '~components/button';
import Select from '~components/select';
import ScreenshotArea from '../utils/screenshot-area';
import { Navigation, Tools, Breadcrumbs } from '../app-layout/utils/content-blocks';
import * as toolsContent from '../app-layout/utils/tools-content';
import labels from '../app-layout/utils/labels';
import { allItems, states, TableItem } from '../property-filter/table.data';
import { columnDefinitions, filteringProperties } from '../property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import styles from './with-collection-select-filter.scss';
import CollectionPreferences from '~components/collection-preferences';

const instanceTypes = new Set(allItems.map(item => item.instancetype));
const instanceOptions = Array.from(instanceTypes).map(type => {
  return { label: type, value: type };
});
const stateOptions = Object.entries(states).map(([key, value]) => {
  return { label: value, value: key };
});

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Items' },
  { value: 30, label: '30 Items' },
  { value: 50, label: '50 Items' },
];

export default function () {
  const { items, collectionProps, actions, paginationProps, propertyFilterProps } = useCollection(allItems, {
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
      defaultQuery: { tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }], operation: 'and' },
    },
    sorting: {},
  });

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        contentType={'table'}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        content={
          <Table<TableItem>
            className="main-content"
            stickyHeader={true}
            header={
              <Header
                variant="awsui-h1-sticky"
                info={<Link variant="info"> Info </Link>}
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button data-testid="header-btn-view-details">View details</Button>
                    <Button data-testid="header-btn-edit" disabled={true}>
                      Edit
                    </Button>
                    <Button data-testid="header-btn-delete" disabled={true}>
                      Delete
                    </Button>
                    <Button data-testid="header-btn-create" variant="primary">
                      Create instance
                    </Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <div className={styles['input-container']}>
                <div className={styles['input-filter']}>
                  <Input
                    data-testid="input-filter"
                    type="search"
                    value={''}
                    onChange={() => {}}
                    placeholder="Find instances"
                    clearAriaLabel="clear"
                  />
                </div>
                <div className="select-filter">
                  <FormField label={'Filter instance type'}>
                    <Select
                      data-testid="instance-type-filter"
                      options={instanceOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={instanceOptions[0]}
                      onChange={() => {}}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
                <div className="select-filter">
                  <FormField label={'Filter status'}>
                    <Select
                      data-testid="state-filter"
                      options={stateOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={stateOptions[0]}
                      onChange={() => {}}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
              </div>
            }
            columnDefinitions={columnDefinitions.slice(0, 7)}
            pagination={<Pagination {...paginationProps} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                pageSizePreference={{
                  title: 'Page size',
                  options: PAGE_SIZE_OPTIONS,
                }}
                wrapLinesPreference={{
                  label: 'Wrap lines',
                  description: 'Select to see all the text and wrap the lines',
                }}
                stripedRowsPreference={{
                  label: 'Striped rows',
                  description: 'Select to add alternating shaded rows',
                }}
                contentDensityPreference={{
                  label: 'Compact mode',
                  description: 'Select to display content in a denser, more compact mode',
                }}
              />
            }
          />
        }
      />
    </ScreenshotArea>
  );
}
