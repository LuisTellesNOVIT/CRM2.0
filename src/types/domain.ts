export type UserRole = 'Admin' | 'Gerente Comercial' | 'Ejecutivo Comercial' | 'Solo Lectura';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  phone: string;
}

export type StatusId =
  | 'lead'
  | 'contacted'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'signing'
  | 'won'
  | 'lost';

export interface Status {
  id: StatusId;
  label: string;
  color: string;
  prob: number;
}

export type Company = 'NOVIT' | 'SHARKY';

export interface Opportunity {
  id: string;
  client_id: string;
  project: string;
  company: Company;
  status: StatusId;
  setup: number;
  monthly: number;
  owner_id: string;
  source: string;
  created: string;
  last: string;
  next_action: string;
  next_date: string;
  notes: string;
  lost_reason?: string;
  tags: string[];
}

export type TaskType =
  | 'llamada'
  | 'correo'
  | 'WhatsApp'
  | 'reunión'
  | 'propuesta'
  | 'contrato'
  | 'seguimiento';

export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'en proceso' | 'completada' | 'vencida';

export interface Task {
  id: string;
  opportunity_id: string;
  owner_id: string;
  title: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  due: string;
  created: string;
  completed?: string;
}

export type InteractionType = 'email' | 'whatsapp' | 'meeting' | 'note' | 'call';
export type InteractionDirection = 'in' | 'out' | '';

export interface Interaction {
  id: string;
  opportunity_id: string;
  type: InteractionType;
  direction: InteractionDirection;
  subject: string;
  status: string;
  sent_at: string;
  created_by: string;
  message: string;
}

export interface Template {
  id: string;
  name: string;
  body: string;
  subject?: string;
}

export type Currency = 'PEN' | 'USD';

export type Theme = 'light' | 'dark';
export type Density = 'comfortable' | 'compact';
