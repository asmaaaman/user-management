export type UserStatus = "active" | "inactive" | "pending";

export interface Project {
  name: string;
  logoUrl: string;
  subtitle: string;
}

export type DocumentType = "pdf" | "doc" | "image";

export interface Document {
  id: number;
  name: string;
  sizeMB: number;
  type: DocumentType;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  title: string;
  since: string; 
  project: Project;
  documents: Document[];
  status: UserStatus;
}

export type UsersResponse = User[];
