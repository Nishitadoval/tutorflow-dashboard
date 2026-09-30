import { Component, inject, input, output, signal } from '@angular/core';
import { TutorflowApiService } from '../../core/services/tutorflow-api.service';
import { ProgressReport } from '../../core/models/tutorflow.models';

@Component({
  selector: 'app-progress-report-viewer',
  templateUrl: './progress-report-viewer.html',
  styleUrl: './progress-report-viewer.css',
})
export class ProgressReportViewerComponent {
  private api = inject(TutorflowApiService);

  studentId = input.required<number>();
  reports = input.required<ProgressReport[]>();
  saved = output<void>();

  draft = signal<string | null>(null);
  generating = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);

  generate() {
    this.generating.set(true);
    this.error.set(null);
    this.draft.set(null);
    this.api.draftProgressReport(this.studentId()).subscribe({
      next: (res) => {
        this.draft.set(res.summary);
        this.generating.set(false);
      },
      error: (err) => {
        this.generating.set(false);
        this.error.set(
          err?.error?.error ?? 'Could not generate a report. Check ANTHROPIC_API_KEY is set on the server.'
        );
      },
    });
  }

  // Saves the exact text currently shown in the draft — never a freshly
  // regenerated one, since an LLM call isn't deterministic and what you
  // reviewed should be exactly what gets stored.
  save() {
    const text = this.draft();
    if (!text) return;
    this.saving.set(true);
    this.api.saveProgressReport(this.studentId(), text).subscribe({
      next: () => {
        this.saving.set(false);
        this.draft.set(null);
        this.saved.emit();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('Could not save the report.');
      },
    });
  }

  discardDraft() {
    this.draft.set(null);
  }
}
