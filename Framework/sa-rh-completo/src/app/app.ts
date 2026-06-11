import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './view/fragmentos/header/header';
import { Footer } from './view/fragmentos/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('sa-rh-completo');
}
