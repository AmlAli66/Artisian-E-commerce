import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MiniNavComponent } from "./components/mini-nav/mini-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MiniNavComponent],
  template: `
    <div class="main-container">
      <app-navbar></app-navbar>
      <app-mini-nav></app-mini-nav>
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      min-height: 100vh;
      position: relative;
    }
  `]
})
export class AppComponent {
  title = 'artisan-marketplace';
}
