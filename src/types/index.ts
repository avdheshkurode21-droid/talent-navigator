export enum AppView {
  LOGIN = 'LOGIN',
  DOMAIN_SELECTION = 'DOMAIN_SELECTION',
  INTERVIEW = 'INTERVIEW',
  SUCCESS = 'SUCCESS',
  DASHBOARD = 'DASHBOARD'
}

export interface UserData {
  fullName: string;
  phone: string;
  registrationNo: string;
  domain?: string;
}

export interface InterviewResponse {
  question: string;
  answer: string;
  score: number;
}

export interface CandidateResult {
  userData: UserData;
  responses: InterviewResponse[];
  score: number;
  recommendation: 'recommended' | 'not_recommended';
  summary: string;
  timestamp: string;
}
