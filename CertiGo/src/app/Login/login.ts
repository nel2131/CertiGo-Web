import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showPassword = false;

  constructor(private router: Router) {}

  goToDashboard(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dashboard']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
