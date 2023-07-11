import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HostProfileComponent } from './components/host-profile/host-profile.component';
import { EmailComponent } from './components/email/email.component';
import { Title } from '@angular/platform-browser';

const routeConfig: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Home details'
  },
  {
    path: 'Register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: 'Login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'Profile',
    component: UserProfileComponent,
    title: 'UserProfile'
  },
  {
    path:'Profile/Host',
    component: HostProfileComponent,
    title: 'HostProfile'
  },
  {
    path:'Profile/Email',
    component: EmailComponent,
    title: 'Email'
  }
];

export default routeConfig;
