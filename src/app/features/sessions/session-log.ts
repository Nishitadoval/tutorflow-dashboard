import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Session } from '../../core/models/tutorflow.models';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-session-log',
  imports: [FormsModule],
  templateUrl: './session-log.html',
  styleUrl: './session-log.css',
})
export class SessionLogComponent {
  sessions = input.required<Session[]>();
  logNote = output<{ session_date: string; note: string }>();

  date = signal(todayIso());
  note = signal('');

  submit() {
    const note = this.note().trim();
    if (!note) return;
    this.logNote.emit({ session_date: this.date(), note });
    this.note.set('');
  }
}
