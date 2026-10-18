import { Injectable, computed, signal } from '@angular/core';

/**
 * Holds the signed-in administrator's identity.
 * Values are placeholders until the backend / login response is connected —
 * replace them with the data returned by the auth API.
 */
@Injectable({ providedIn: 'root' })
export class AdminSession {
  readonly firstName = signal('');
  readonly lastName = signal('');
  readonly username = signal('Username');

  /** First letter of the first name + first letter of the last name. */
  readonly initials = computed(() => {
    const first = this.firstName().trim();
    const last = this.lastName().trim();

    if (first && last) {
      return (first.charAt(0) + last.charAt(0)).toUpperCase();
    }

    // Single-word name (e.g. "Username") -> fall back to its first letter.
    const single = first || last || this.username().trim();
    return single ? single.charAt(0).toUpperCase() : '';
  });

  /** Full display name, collapsing to whichever value is available. */
  readonly displayName = computed(() => {
    const full = `${this.firstName().trim()} ${this.lastName().trim()}`.trim();
    return full || this.username().trim();
  });

  setProfile(firstName: string, lastName: string, username: string) {
    this.firstName.set(firstName);
    this.lastName.set(lastName);
    this.username.set(username);
  }
}
