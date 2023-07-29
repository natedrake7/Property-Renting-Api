import { Routes } from '@angular/router';
import { HomeComponent } from './components/ClientView/home/home.component';
import { DetailsComponent } from './components/ClientView/details/details.component';
import { LoginComponent } from './components/Authentication/login/login.component';
import { RegisterComponent } from './components/Authentication/register/register.component';
import { UserProfileComponent } from './components/User/user-profile/user-profile.component';
import { HostProfileComponent } from './components/User/host-profile/host-profile.component';
import { EmailComponent } from './components/User/email/email.component';
import { PasswordComponent } from './components/User/password/password.component';
import { PersonalDataComponent } from './components/User/personal-data/personal-data.component';
import { AddHouseComponent } from './components/Property/add-house/add-house.component';
import { EditHouseComponent } from './components/Property/edit-house/edit-house.component';
import { PreviewHostComponent } from './components/ClientView/preview-host/preview-host.component';

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
  },
  {
    path:'Profile/Password',
    component: PasswordComponent,
    title: 'Password'
  },
  {
    path: 'Profile/PersonalData',
    component: PersonalDataComponent,
    title: 'PersonalData'
  },
  {
    path: 'Profile/Host/AddHouse',
    component: AddHouseComponent,
    title: 'AddHouse'
  },
  {
    path: 'Profile/Host/EditHouse/:id',
    component: EditHouseComponent,
    title: 'EditHouse'
  },
  {
    path: 'details/PreviewHost/:id',
    component: PreviewHostComponent,
    title: 'PreviewHost'
  }
];

export default routeConfig;
