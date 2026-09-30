import { Component, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, map, catchError, of, startWith, switchMap } from 'rxjs';
import { TutorflowApiService } from '../../core/services/tutorflow-api.service';
import { Student } from '../../core/models/tutorflow.models';

interface RosterState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: RosterState = { students: [], loading: true, error: null };

@Component({
  selector: 'app-roster',
  imports: [FormsModule],
  templateUrl: './roster.html',
  styleUrl: './roster.css',
})
export class RosterComponent {
  private api = inject(TutorflowApiService);

  selectedId = input<number | null>(null);
  refreshTick = input<number>(0);
  select = output<number>();

  searchTerm = signal('');

  private state$ = combineLatest([
    toObservable(this.searchTerm).pipe(debounceTime(250), distinctUntilChanged(), startWith('')),
    toObservable(this.refreshTick),
  ]).pipe(
    switchMap(([term]) =>
      this.api.listStudents(term || undefined).pipe(
        map((students): RosterState => ({ students, loading: false, error: null })),
        startWith<RosterState>({ ...INITIAL_STATE, loading: true }),
        catchError(() =>
          of<RosterState>({
            students: [],
            loading: false,
            error: 'Could not load students — is the API running?',
          })
        )
      )
    )
  );

  state = toSignal(this.state$, { initialValue: INITIAL_STATE });
}
