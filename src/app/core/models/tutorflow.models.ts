export interface Student {
  id: number;
  name: string;
  grade: string | null;
  subject_focus: string | null;
  parent_email: string | null;
  created_at: string;
  overdue_homework_count: number;
}

export interface Session {
  id: number;
  student_id: number;
  session_date: string;
  note: string;
  created_at: string;
}

export interface HomeworkItem {
  id: number;
  student_id: number;
  description: string;
  due_date: string | null;
  completed: number;
  created_at: string;
}

export interface ProgressReport {
  id: number;
  student_id: number;
  summary: string;
  created_at: string;
}

export interface StudentDetail {
  student: Student;
  sessions: Session[];
  homework: HomeworkItem[];
  progressReports: ProgressReport[];
}

export interface DraftReportResponse {
  summary: string;
}
