import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeworkItem } from '../../core/models/tutorflow.models';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-homework-tracker',
  imports: [FormsModule],
  templateUrl: './homework-tracker.html',
  styleUrl: './homework-tracker.css',
})
export class HomeworkTrackerComponent {
  items = input.required<HomeworkItem[]>();
  assign = output<{ description: string; due_date: string | null }>();
  toggle = output<{ id: number; completed: boolean }>();
  remove = output<number>();

  description = signal('');
  dueDate = signal('');

  submit() {
    const description = this.description().trim();
    if (!description) return;
    this.assign.emit({ description, due_date: this.dueDate() || null });
    this.description.set('');
    this.dueDate.set('');
  }

  isOverdue(item: HomeworkItem): boolean {
    if (!item.due_date) return false;
    return item.due_date < todayIso();
  }

  confirmDelete(item: HomeworkItem) {
    if (confirm(`Delete "${item.description}"?`)) {
      this.remove.emit(item.id);
    }
  }
}
