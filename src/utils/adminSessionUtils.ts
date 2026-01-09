
import { AdminSession } from "@/models/AdminSession";

export const saveAdminSession = (adminName: string): AdminSession => {
  // Create new session
  const newSession: AdminSession = {
    id: Date.now().toString(),
    name: adminName,
    loginDate: new Date().toLocaleDateString(),
    loginTime: new Date().toLocaleTimeString(),
    isActive: true
  };
  
  // Save current session
  localStorage.setItem("adminSession", JSON.stringify(newSession));
  
  return newSession;
};

export const updateAdminSessionOnLogout = (adminSessions: AdminSession[], adminInfo: AdminSession | null): AdminSession[] => {
  if (!adminInfo) return adminSessions;
  
  // Update the current session with logout time
  const updatedSessions = adminSessions.map(session => 
    session.id === adminInfo.id 
      ? {
          ...session,
          logoutDate: new Date().toLocaleDateString(),
          logoutTime: new Date().toLocaleTimeString(),
          isActive: false
        } 
      : session
  );
  
  localStorage.setItem("adminSessions", JSON.stringify(updatedSessions));
  return updatedSessions;
};

export const loadAdminSessions = (): AdminSession[] => {
  const savedSessions = localStorage.getItem("adminSessions");
  if (savedSessions) {
    try {
      return JSON.parse(savedSessions);
    } catch (error) {
      console.error("Failed to parse admin sessions:", error);
    }
  }
  return [];
};

export const loadCurrentAdminSession = (): AdminSession | null => {
  const savedSession = localStorage.getItem("adminSession");
  if (savedSession) {
    try {
      return JSON.parse(savedSession);
    } catch (error) {
      console.error("Failed to parse admin session:", error);
      localStorage.removeItem("adminSession");
    }
  }
  return null;
};

export const saveAdminSessions = (sessions: AdminSession[]): void => {
  localStorage.setItem("adminSessions", JSON.stringify(sessions));
};
