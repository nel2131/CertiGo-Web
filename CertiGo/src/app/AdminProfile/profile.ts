import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminSession } from '../core/admin-session';
import { ThemeService } from '../core/theme';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  readonly session = inject(AdminSession);
  readonly theme = inject(ThemeService);

  /** Initials for the avatar: first + last initial, or a single letter for one-word names. */
  get initials(): string {
    return this.session.initials();
  }

  get darkMode(): boolean {
    return this.theme.isDark;
  }

  toggleDarkMode() {
    this.theme.toggle();
  }

  showChangePassword = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  submitted = false;
  saving = false;
  errorMessage = '';
  toast = '';

  private toastTimer?: ReturnType<typeof setTimeout>;

  /** Password policy shown in the modal checklist. */
  readonly rules = [
    { key: 'length', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
    { key: 'upper', label: '1 uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
    { key: 'number', label: '1 number', test: (v: string) => /\d/.test(v) },
    { key: 'special', label: '1 special char (!@#$)', test: (v: string) => /[^A-Za-z0-9\s]/.test(v) },
  ];

  /** Live evaluation of each rule against the new password. */
  get requirements() {
    return this.rules.map((rule) => ({ key: rule.key, label: rule.label, met: rule.test(this.newPassword) }));
  }

  get metCount(): number {
    return this.requirements.filter((r) => r.met).length;
  }

  get newPasswordValid(): boolean {
    return this.newPassword.length > 0 && this.metCount === this.rules.length;
  }

  get passwordsMatch(): boolean {
    return this.confirmPassword.length > 0 && this.newPassword === this.confirmPassword;
  }

  get sameAsCurrent(): boolean {
    return this.newPassword.length > 0 && this.newPassword === this.currentPassword;
  }

  get formValid(): boolean {
    return this.currentPassword.trim().length > 0 && this.newPasswordValid && this.passwordsMatch && !this.sameAsCurrent;
  }

  openChangePassword() {
    this.resetForm();
    this.showChangePassword = true;
  }

  closeChangePassword() {
    if (this.saving) return;
    this.showChangePassword = false;
  }

  resetForm() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.submitted = false;
    this.errorMessage = '';
  }

  async updatePassword() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.currentPassword.trim().length === 0) {
      this.errorMessage = 'Please enter your current password.';
      return;
    }
    if (!this.newPasswordValid) {
      const missing = this.rules.length - this.metCount;
      this.errorMessage = `Your new password is missing ${missing} requirement${missing === 1 ? '' : 's'}.`;
      return;
    }
    if (this.sameAsCurrent) {
      this.errorMessage = 'Your new password must be different from your current password.';
      return;
    }
    if (!this.passwordsMatch) {
      this.errorMessage = 'The new password and its confirmation do not match.';
      return;
    }

    this.saving = true;
    try {
      await this.changePasswordRequest(this.currentPassword, this.newPassword);
      this.showChangePassword = false;
      this.resetForm();
      this.showToast('Password updated successfully.');
    } catch (err) {
      this.errorMessage = (err as Error).message || 'Could not update the password. Please try again.';
    } finally {
      this.saving = false;
    }
  }

  showToast(message: string) {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 4000);
  }

  /**
   * Placeholder for the real API call.
   * Replace the body with e.g. `firstValueFrom(this.http.post('/api/admin/change-password', { currentPassword, newPassword }))`
   * once the backend is connected.
   */
  private changePasswordRequest(currentPassword: string, newPassword: string): Promise<void> {
    const accepted = currentPassword.trim().length > 0 && newPassword.length >= 8;
    return new Promise((resolve, reject) =>
      setTimeout(
        () => (accepted ? resolve() : reject(new Error('Could not update the password. Please try again.'))),
        900,
      ),
    );
  }
}
