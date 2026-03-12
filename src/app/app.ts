import { Component, signal } from '@angular/core';
import { SunStoneCanvasComponent } from './sun-stone-canvas/sun-stone-canvas';

@Component({
  selector: 'app-root',
  imports: [SunStoneCanvasComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xiuhkoatl');
}
