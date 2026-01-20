import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeStore } from '@features/theme/model/theme.store';
import { ToastComponent } from '@shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // Ensure ThemeStore is instantiated on every route.
  private readonly themeStore = inject(ThemeStore);
}
