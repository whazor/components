// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DateRangePickerProps, PendingAbsoluteValue } from './interfaces';
import { setTimeOffset } from './time-offset';
import { joinDateTime, splitDateTime } from '../internal/utils/date-time';

export function formatValue(
  value: null | DateRangePickerProps.Value,
  { timeOffset, dateOnly }: { timeOffset: { startDate?: number; endDate?: number }; dateOnly: boolean }
): null | DateRangePickerProps.Value {
  if (!value || value.type === 'relative') {
    return value;
  }
  if (dateOnly) {
    return {
      type: 'absolute',
      startDate: value.startDate.split('T')[0],
      endDate: value.endDate.split('T')[0],
    };
  }
  return setTimeOffset(value, timeOffset);
}

export function getDefaultMode(
  value: null | DateRangePickerProps.Value,
  relativeOptions: readonly DateRangePickerProps.RelativeOption[],
  rangeSelectorMode: DateRangePickerProps.RangeSelectorMode
) {
  if (value && value.type) {
    return value.type;
  }
  if (rangeSelectorMode === 'relative-only') {
    return 'relative';
  }
  if (rangeSelectorMode === 'absolute-only') {
    return 'absolute';
  }
  return relativeOptions.length > 0 ? 'relative' : 'absolute';
}

export function splitAbsoluteValue(value: null | DateRangePickerProps.AbsoluteValue): PendingAbsoluteValue {
  if (!value) {
    return {
      start: { date: '', time: '' },
      end: { date: '', time: '' },
    };
  }
  return { start: splitDateTime(value.startDate), end: splitDateTime(value.endDate) };
}

export function joinAbsoluteValue(value: PendingAbsoluteValue): DateRangePickerProps.AbsoluteValue {
  return {
    type: 'absolute',
    startDate: joinDateTime(value.start.date, value.start.time || '00:00:00'),
    endDate: joinDateTime(value.end.date, value.end.time || '23:59:59'),
  };
}
