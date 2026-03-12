import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tonalpohualli',
    loadComponent: () =>
      import('./tonalpohualli/tonalpohualli').then((m) => m.TonalpohualliComponent),
  },
  {
    path: 'xiuhpohualli',
    loadComponent: () =>
      import('./xiuhpohualli/xiuhpohualli').then((m) => m.XiuhpohualliComponent),
  },
  {
    path: 'sun-stone',
    loadComponent: () =>
      import('./sun-stone-canvas/sun-stone-canvas').then((m) => m.SunStoneCanvasComponent),
  },
  { path: '', redirectTo: 'tonalpohualli', pathMatch: 'full' },
];
