import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Target,
  Check,
  List,
  Settings,
  Search,
  Plus,
  ChevronRight,
  X,
  Bell,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Flame,
  Clock,
  Paperclip,
  Filter,
  GripVertical,
  LogOut,
  Zap,
  MessageSquare,
  ArrowRight,
  File,
  BarChart3,
  Handshake,
  TrendingUp,
  Eye,
  Edit3,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

export type IconName =
  | 'dashboard'
  | 'kanban'
  | 'users'
  | 'target'
  | 'check'
  | 'list'
  | 'settings'
  | 'search'
  | 'plus'
  | 'chevron'
  | 'close'
  | 'bell'
  | 'whatsapp'
  | 'mail'
  | 'phone'
  | 'calendar'
  | 'arrow_up'
  | 'arrow_down'
  | 'sparkles'
  | 'flame'
  | 'clock'
  | 'paperclip'
  | 'filter'
  | 'drag'
  | 'logout'
  | 'bolt'
  | 'chat'
  | 'arrow_right'
  | 'file'
  | 'chart'
  | 'handshake'
  | 'trend_up'
  | 'eye'
  | 'edit';

const MAP: Record<IconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  kanban: KanbanSquare,
  users: Users,
  target: Target,
  check: Check,
  list: List,
  settings: Settings,
  search: Search,
  plus: Plus,
  chevron: ChevronRight,
  close: X,
  bell: Bell,
  whatsapp: MessageCircle,
  mail: Mail,
  phone: Phone,
  calendar: Calendar,
  arrow_up: ArrowUp,
  arrow_down: ArrowDown,
  sparkles: Sparkles,
  flame: Flame,
  clock: Clock,
  paperclip: Paperclip,
  filter: Filter,
  drag: GripVertical,
  logout: LogOut,
  bolt: Zap,
  chat: MessageSquare,
  arrow_right: ArrowRight,
  file: File,
  chart: BarChart3,
  handshake: Handshake,
  trend_up: TrendingUp,
  eye: Eye,
  edit: Edit3,
};

interface IconProps extends Omit<LucideProps, 'size'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, strokeWidth = 1.6, ...rest }: IconProps) {
  const Cmp = MAP[name];
  return <Cmp size={size} strokeWidth={strokeWidth} {...rest} />;
}
