// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  Box,
  Button,
  DateRangePicker,
  DateRangePickerProps,
  Link,
  Checkbox,
  SpaceBetween,
  SegmentedControl,
  FormField,
} from '~components';
import { i18nStrings, i18nStringsDateOnly, isValid, relativeOptions } from './common';

export default function DatePickerScenario() {
  const [showRelativeOptions, setShowRelativeOptions] = useState(true);
  const [dateOnly, setDateOnly] = useState(false);
  const [rangeSelectorMode, setRangeSelectorMode] = useState<DateRangePickerProps.RangeSelectorMode>('absolute-only');
  const [value, setValue] = useState<DateRangePickerProps['value']>(null);

  return (
    <Box padding="s">
      <SpaceBetween direction="vertical" size="m">
        <h1>Date range picker simple version</h1>
        <SegmentedControl
          selectedId={rangeSelectorMode}
          options={[
            { id: 'default', text: 'default' },
            { id: 'absolute-only', text: 'absolute-only' },
            { id: 'relative-only', text: 'relative-only' },
          ]}
          onChange={e => setRangeSelectorMode(e.detail.selectedId as DateRangePickerProps.RangeSelectorMode)}
        />
        <SpaceBetween direction="horizontal" size="s">
          <Checkbox checked={showRelativeOptions} onChange={event => setShowRelativeOptions(event.detail.checked)}>
            Show relative options
          </Checkbox>
          <Checkbox checked={dateOnly} onChange={event => setDateOnly(event.detail.checked)}>
            Date-only
          </Checkbox>
        </SpaceBetween>
        <Link id="focus-dismiss-helper">Focusable element before the date range picker</Link>
        <FormField label="Date Range Picker field">
          <DateRangePicker
            value={value}
            locale="en-GB"
            i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
            placeholder={'Filter by a date and time range'}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={showRelativeOptions ? relativeOptions : []}
            isValidRange={isValid}
            dateOnly={dateOnly}
            timeInputFormat="hh:mm"
            rangeSelectorMode={rangeSelectorMode}
            isDateEnabled={date => date.getDate() !== 15}
            getTimeOffset={date => -1 * date.getTimezoneOffset()}
            shortcuts={(selectedDate, setSelectedDate) => {
              console.log(selectedDate);
              return (
                <>
                  Auto-select:{' '}
                  <Link
                    onFollow={() => {
                      setSelectedDate({
                        type: 'absolute',
                        startDate: '2022-11-18T00:00:00',
                        endDate: '2022-11-18T23:59:59',
                      });
                    }}
                  >
                    1D
                  </Link>{' '}
                  <Link onFollow={() => {}}>7D</Link> <Link onFollow={() => {}}>Current month</Link>{' '}
                  <Link onFollow={() => {}}>3M</Link> <Link onFollow={() => {}}>6M</Link>{' '}
                  <Link onFollow={() => {}}>1Y</Link> <Link onFollow={() => {}}>MTD</Link>{' '}
                  <Link onFollow={() => {}}>YTD</Link> <Link onFollow={() => {}}>+3M</Link>{' '}
                  <Link onFollow={() => {}}>+12M</Link>
                </>
              );
            }}
          />
        </FormField>
        <FormField label="Second example">
          <DateRangePicker
            value={value}
            locale="en-GB"
            i18nStrings={dateOnly ? i18nStringsDateOnly : i18nStrings}
            placeholder={'Filter by a date and time range'}
            onChange={e => setValue(e.detail.value)}
            relativeOptions={showRelativeOptions ? relativeOptions : []}
            isValidRange={isValid}
            dateOnly={dateOnly}
            timeInputFormat="hh:mm"
            rangeSelectorMode={rangeSelectorMode}
            isDateEnabled={date => date.getDate() !== 15}
            getTimeOffset={date => -1 * date.getTimezoneOffset()}
            shortcuts={() => <div style={{ background: 'indianred', padding: 10 }}>This is your custom area</div>}
          />
        </FormField>
        <Link id="focusable-element-after-date-picker">Focusable element after the date range picker</Link>
        <b>Raw value</b>
        <pre>{JSON.stringify(value, undefined, 2)}</pre>
      </SpaceBetween>
    </Box>
  );
}
