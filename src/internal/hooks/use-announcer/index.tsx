// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';
import styles from './styles.css.js';

const DEFAULT_DELAY = 5000;

export interface LiveAnnouncer {
  announce(message: string): void;
  cleanup(): void;
}

class LiveAnnouncerImpl implements LiveAnnouncer {
  private politeElement: HTMLDivElement | null = null;

  private queuedAnnouncements: Set<string> = new Set();
  private lastAnnouncementAt = 0;
  private timeout: number | undefined;

  constructor(private readonly delay: number = DEFAULT_DELAY) {
    if (typeof document !== 'undefined') {
      const polite = (this.politeElement = document.createElement('div'));
      polite.className = styles.announcer;
      polite.ariaLive = 'polite';
      document.body.appendChild(polite);
    }
  }

  private announceNow() {
    // Requesting an animation frame so that multiple calls in a single batch
    // are still announced together.
    setTimeout(() => {
      if (this.politeElement && this.queuedAnnouncements.size > 0) {
        this.politeElement.textContent = Array.from(this.queuedAnnouncements.values()).join('\n');
        this.queuedAnnouncements.clear();
        this.lastAnnouncementAt = Date.now();
      }
    }, 1000);
  }

  private announceLater() {
    if (this.timeout === undefined) {
      this.timeout = setTimeout(() => {
        this.announceNow();
        this.timeout = undefined;
      }, this.delay);
    }
  }

  announce = (message: string) => {
    // TODO: Add deduplication - it's better to discard some older messages instead of queueing them
    this.queuedAnnouncements.add(message);
    if (this.lastAnnouncementAt < Date.now() - this.delay) {
      // It's been enough time since the last announcement. Announce immediately.
      this.announceNow();
    } else {
      // We made an announcement too recently. Kick off a timer.
      this.announceLater();
    }
  };

  cleanup = () => {
    clearTimeout(this.timeout);
    this.politeElement?.remove();
  };
}

const defaultLiveAnnouncer = new LiveAnnouncerImpl();
const LiveAnnouncerContext = React.createContext<LiveAnnouncer>(defaultLiveAnnouncer);

/**
 * Provides the live announcer instance to announce messages imperatively.
 */
export function useLiveAnnouncer(): LiveAnnouncer {
  return useContext(LiveAnnouncerContext);
}

/**
 * Tracks and announces an aria message if it changed between renders.
 */
export function useLiveAnnouncement(message: string | undefined | false | 0): void {
  const { announce } = useLiveAnnouncer();
  const previousMessage = useRef<string>();
  if (typeof message === 'string' && message !== '' && message !== previousMessage.current) {
    announce(message);
    previousMessage.current = message;
  }
}
