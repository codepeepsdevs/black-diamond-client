/**
 * Role helper functions for checking user permissions
 */

export const isAdmin = (role: string): boolean => role === "admin";

export const isViewer = (role: string): boolean => role === "viewer";

export const isAdminOrViewer = (role: string): boolean =>
  role === "admin" || role === "viewer";

export const canViewAdminDashboard = (role: string): boolean =>
  role === "admin" || role === "viewer";

export const canModifyData = (role: string): boolean => role === "admin";

export const isReadOnly = (role: string): boolean => role === "viewer";



