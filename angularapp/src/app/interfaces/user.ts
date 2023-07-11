export interface User {
  Id: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Bio: string;
  IsHost: boolean;
  HostId: number;
  PhoneNumber: string;
  Password: string;
  ConfirmPassword: string;
  LoggedIn: boolean;
}
