// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { parseDate } from '../../internal/utils/date-time';

export interface DateTime {
  dateString: string;
  timeString: string;
  date: Date | null;
}

export function useDateTime(initialDateTimeString: string): DateTime {
  const [dateString = '', timeString = ''] = initialDateTimeString.split('T');
  const date = useMemo(() => parseDate(dateString, true), [dateString]);
  return { dateString, timeString, date };
}
