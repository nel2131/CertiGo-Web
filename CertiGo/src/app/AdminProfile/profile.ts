import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  showChangePassword = false;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  openChangePassword() {
    this.showChangePassword = true;
  }

  closeChangePassword() {
    this.showChangePassword = false;
  }
}
