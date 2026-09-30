import { Component, signal } from '@angular/core';
import { RosterComponent } from './features/roster/roster';
import { StudentWorkspaceComponent } from './features/workspace/workspace';

@Component({
  selector: 'app-root',
  imports: [RosterComponent, StudentWorkspaceComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  selectedId = signal<number | null>(null);
  rosterRefreshTick = signal(0);

  onSelect(id: number) {
    this.selectedId.set(id);
  }

  onWorkspaceDataChanged() {
    this.rosterRefreshTick.update((n) => n + 1);
  }
}
