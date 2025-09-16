export interface Templates {
  intLetter: string;
  extLetter: string;
}

export interface Person {
  id: string;
  name: string;
  position: string;
  workshop: string;
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
