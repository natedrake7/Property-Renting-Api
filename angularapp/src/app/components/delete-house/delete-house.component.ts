import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup,ReactiveFormsModule,FormControl, Validators } from '@angular/forms';
import { error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-delete-house',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  template: `
    <section class = "delete-property">
    <h2 class="section-heading">Delete Property</h2>
      <form [formGroup]="DeletePropertyForm " (submit)="DeleteProperty()">
      <p>Are you sure you want to delete the listing of the current property?</p>
      <p>This action cannot be revoked!</p>
      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Enter your password" formControlName="Password">
      <div class ="error"*ngIf="Password_Error">
          <div *ngFor="let message of Password_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <label for="confirm-password">Confirm Password</label>
      <input id="confirm-password" type="password" placeholder="Confirm your password" formControlName="ConfirmPassword">
      <div class ="error"*ngIf="ConfirmPassword_Error">
          <div *ngFor="let message of ConfirmPassword_Error.Errors">
            <p>{{message}}</p>
          </div>
        </div>
        <button type="submit" class="primary">Submit</button>
      </form>
    </section>
  `,
  styleUrls: ['./delete-house.component.css']
})
export class DeleteHouseComponent {
  Password_Error: error | undefined;
  ConfirmPassword_Error: error | undefined;
  DeletePropertyForm = new FormGroup({
    Password: new FormControl('',Validators.required),
    ConfirmPassword: new FormControl('',Validators.required)
  })

  DeleteProperty(){

  }

}
