export interface Templates {
  intLetter: string;
  extLetter: string;
}

export interface Person {
  id: string;
  name: string;
  position: string;
  workshop: string;
  email?: string;
}

export interface TemplateData {
  recipient_name: string;
  recipient_position: string;
  recipient_workshop: string;

  sender_name: string;
  sender_position: string;
  sender_workshop: string;

  date: string;
}

export interface DocumentVersion {
  versionNumber: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
  templateType?: keyof Templates;
  originalData?: TemplateData;
  route?: ReviewerStep[];
  status?: "draft" | "in_review" | "approved" | "rejected";
}

export interface GenDocument {
  id: string;
  name: string;
  template: keyof Templates;
  data: TemplateData;
  createdAt: string;
  currentVersion?: Document;
}

export interface ReviewerStep {
  userId: string; // ID рецензента
  order: number; // порядок в маршруте
  deadline?: string; // дедлайн ISO
  status: "pending" | "approved" | "rejected";
}

export interface WSMessage {
  type: string;
  document?: Document;
  documentId?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
