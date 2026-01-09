
export interface AdminSession {
  id: string;
  name: string;
  loginDate: string;
  loginTime: string;
  logoutDate?: string;
  logoutTime?: string;
  isActive: boolean;
}
