import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  imports: [RouterLink],
  templateUrl: './forgotpass.html',
  styleUrl: './forgotpass.scss',
})
export class ForgotPass {
  constructor(private router: Router) {}

  sendCode(event: Event) {
    event.preventDefault();
    this.router.navigate(['/reset-password']);
  }
}
