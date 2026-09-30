import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-config';
import {
  DraftReportResponse,
  HomeworkItem,
  ProgressReport,
  Session,
  Student,
  StudentDetail,
} from '../models/tutorflow.models';

@Injectable({ providedIn: 'root' })
export class TutorflowApiService {
  private http = inject(HttpClient);

  listStudents(search?: string): Observable<Student[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Student[]>(`${API_BASE_URL}/students`, { params });
  }

  getStudentDetail(studentId: number): Observable<StudentDetail> {
    return this.http.get<StudentDetail>(`${API_BASE_URL}/students/${studentId}`);
  }

  logSessionNote(studentId: number, sessionDate: string, note: string): Observable<Session> {
    return this.http.post<Session>(`${API_BASE_URL}/students/${studentId}/sessions`, {
      session_date: sessionDate,
      note,
    });
  }

  assignHomework(
    studentId: number,
    description: string,
    dueDate: string | null
  ): Observable<HomeworkItem> {
    return this.http.post<HomeworkItem>(`${API_BASE_URL}/students/${studentId}/homework`, {
      description,
      due_date: dueDate,
    });
  }

  setHomeworkCompleted(homeworkId: number, completed: boolean): Observable<HomeworkItem> {
    return this.http.patch<HomeworkItem>(`${API_BASE_URL}/homework/${homeworkId}`, { completed });
  }

  deleteHomework(homeworkId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/homework/${homeworkId}`);
  }

  draftProgressReport(studentId: number): Observable<DraftReportResponse> {
    return this.http.post<DraftReportResponse>(
      `${API_BASE_URL}/students/${studentId}/progress-report/draft`,
      {}
    );
  }

  saveProgressReport(studentId: number, summary: string): Observable<ProgressReport> {
    return this.http.post<ProgressReport>(`${API_BASE_URL}/students/${studentId}/progress-report`, {
      summary,
    });
  }
}
