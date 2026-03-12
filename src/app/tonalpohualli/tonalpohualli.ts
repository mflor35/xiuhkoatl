import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tonalpohualli',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Tonalpohualli</h1>
    </main>
  `,
})
export class TonalpohualliComponent {}
