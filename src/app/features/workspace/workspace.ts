import { Component, effect, inject, input, output, signal } from '@angular/core';
import { TutorflowApiService } from '../../core/services/tutorflow-api.service';
import { StudentDetail } from '../../core/models/tutorflow.models';
import { SessionLogComponent } from '../sessions/session-log';
import { HomeworkTrackerComponent } from '../homework/homework-tracker';
import { ProgressReportViewerComponent } from '../progress-reports/progress-report-viewer';

type Tab = 'sessions' | 'homework' | 'reports';

@Component({
  selector: 'app-student-workspace',
  imports: [SessionLogComponent, HomeworkTrackerComponent, ProgressReportViewerComponent],
  templateUrl: './workspace.html',
  styleUrl: './workspace.css',
})
export class StudentWorkspaceComponent {
  private api = inject(TutorflowApiService);

  studentId = input.required<number>();
  /** Emitted after any write that could change roster-visible data (like
   * overdue homework counts), so the parent can bump the roster's
   * refreshTick without this component needing to know about the roster. */
  dataChanged = output<void>();

  activeTab = signal<Tab>('sessions');
  detail = signal<StudentDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.fetchDetail(this.studentId());
    });
  }

  private fetchDetail(id: number) {
    this.loading.set(true);
    this.api.getStudentDetail(id).subscribe({
      next: (detail) => {
        this.detail.set(detail);
        this.loading.set(false);
        this.error.set(null);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load this student.');
      },
    });
  }

  private refetch() {
    this.fetchDetail(this.studentId());
    this.dataChanged.emit();
  }

  onLogSession(payload: { session_date: string; note: string }) {
    this.api
      .logSessionNote(this.studentId(), payload.session_date, payload.note)
      .subscribe(() => this.refetch());
  }

  onAssignHomework(payload: { description: string; due_date: string | null }) {
    this.api
      .assignHomework(this.studentId(), payload.description, payload.due_date)
      .subscribe(() => this.refetch());
  }

  onToggleHomework(payload: { id: number; completed: boolean }) {
    this.api.setHomeworkCompleted(payload.id, payload.completed).subscribe(() => this.refetch());
  }

  onDeleteHomework(id: number) {
    this.api.deleteHomework(id).subscribe(() => this.refetch());
  }

  onReportSaved() {
    this.refetch();
  }
}
