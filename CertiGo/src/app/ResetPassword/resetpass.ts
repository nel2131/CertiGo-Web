import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-pass',
  imports: [],
  templateUrl: './resetpass.html',
  styleUrl: './resetpass.scss',
})
export class ResetPass {
  code = ['', '', '', ''];
  showPassword = false;
  showConfirmPassword = false;

  onCodeInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.code[index] = input.value.slice(-1);
    input.value = this.code[index];
    if (this.code[index] && index < 3) {
      const next = input.parentElement?.querySelectorAll<HTMLInputElement>('input')[index + 1];
      next?.focus();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
