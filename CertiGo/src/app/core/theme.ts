import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * App-wide light/dark theme.
 * Writes `dark` on <html> so every page can be recoloured from one place,
 * and remembers the choice in localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'certigo-theme';
  private readonly platformId = inject(PLATFORM_ID);

  readonly dark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.storageKey);
      if (stored === 'dark') {
        this.enable(true, false);
      } else if (stored === 'light') {
        this.enable(false, false);
      }
    }
  }

  get isDark(): boolean {
    return this.dark();
  }

  toggle() {
    this.enable(!this.dark(), true);
  }

  enable(isDark: boolean, persist = true) {
    this.dark.set(isDark);

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', isDark);
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

      if (persist) {
        localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
      }
    }
  }
}
