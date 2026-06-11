export interface TerminalLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  pid: string;
  thread: string;
  className: string;
  message: string;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  time: number;
  contentType: string;
  body: string;
  error?: string;
  headers: Record<string, string>;
}

export interface UnitTestResult {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "pending" | "running";
  expected: string;
  actual?: string;
  errorText?: string;
}

export interface TheoryLesson {
  id: string;
  title: string;
  shortDesc: string;
  content: string; // Markdown
}

export interface SpringExercise {
  id: string;
  title: string;
  endpoint: string;
  exampleUrl: string;
  description: string;
  expectedResult: string;
  codeSnippet: string;
}
