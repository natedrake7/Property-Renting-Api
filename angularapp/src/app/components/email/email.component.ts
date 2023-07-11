import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      email works!
    </p>
  `,
  styleUrls: ['./email.component.css']
})
export class EmailComponent {

}
