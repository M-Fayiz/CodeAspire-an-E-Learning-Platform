export interface IJwtPayload {
  id: string;
  role: 'admin' | 'mentor' | 'learner';
  isActive:boolean
  isApproved?: boolean; 
  isRequested?:boolean
}