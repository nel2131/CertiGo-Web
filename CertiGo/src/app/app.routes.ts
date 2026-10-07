import { Routes } from '@angular/router';
import { Login } from './Login/login';
import { SignUp } from './SignUp/signup';
import { ForgotPass } from './ForgotPassword/forgotpass';
import { ResetPass } from './ResetPassword/resetpass';
import { Dashboard } from './Dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
  { path: 'forgot-password', component: ForgotPass },
  { path: 'reset-password', component: ResetPass },
  { path: 'dashboard', component: Dashboard },
];
