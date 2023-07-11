import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  template: `
  <main>
    <a [routerLink]="['/']">
      <header class="brand-name">
        <img class="brand-logo" src="/assets/logo.svg" alt="logo" aria-hidden="true">
      </header>
    </a>
    <section class="content">
    <router-outlet></router-outlet>
    </section>
  </main>
`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'airbnb';
}
