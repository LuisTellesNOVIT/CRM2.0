import { CLIENTS } from './mock';
import type { Client, Company, Opportunity, StatusId } from '@/types';

const STATUS_MAP: Record<string, StatusId> = {
  'lead nuevo': 'lead',
  lead: 'lead',
  contactado: 'contacted',
  demo: 'demo',
  propuesta: 'proposal',
  negociacion: 'negotiation',
  'firma del contrato': 'signing',
  ganado: 'won',
  perdido: 'lost',
};

const COMPANY_MAP: Record<string, Company> = {
  novit: 'NOVIT',
  sharky: 'SHARKY',
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

interface GVizCell {
  v: string | number | boolean | null;
  f?: string;
}

interface GVizRow {
  c: (GVizCell | null)[];
}

interface GVizTable {
  cols: { id: string; label: string; type: string }[];
  rows: GVizRow[];
}

interface GVizResponse {
  table: GVizTable;
}

export interface SheetSyncResult {
  opportunities: Opportunity[];
  clients: Client[];
  fetchedAt: string;
}

const PALETTE = [
  '#6366f1',
  '#0ea5e9',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#0d9488',
];

function clientIdFromName(name: string): string {
  const known = CLIENTS.find((c) => normalize(c.name) === normalize(name));
  if (known) return known.id;
  return `c-${normalize(name).replace(/\s+/g, '-').slice(0, 30)}`;
}

function clientFromName(name: string, idx: number): Client {
  const known = CLIENTS.find((c) => normalize(c.name) === normalize(name));
  if (known) return known;
  return {
    id: clientIdFromName(name),
    name,
    industry: 'Por definir',
    contact: '—',
    email: '—',
    phone: '—',
  };
}

function findHeaderIndex(cols: GVizTable['cols'], label: string): number {
  const target = normalize(label);
  return cols.findIndex((c) => normalize(c.label || '') === target);
}

export async function fetchSheetOpportunities(sheetId: string): Promise<SheetSyncResult> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
  }
  const text = await res.text();
  const match = text.match(/setResponse\(([\s\S]*)\)\s*;?\s*$/);
  if (!match) throw new Error('Unexpected GViz response shape');
  const json = JSON.parse(match[1]) as GVizResponse;

  const cols = json.table.cols;
  const idIdx = findHeaderIndex(cols, 'ID');
  const clienteIdx = findHeaderIndex(cols, 'Cliente');
  const estadoIdx = findHeaderIndex(cols, 'Estado');
  const proyectoIdx = findHeaderIndex(cols, 'Proyecto');
  const empresaIdx = findHeaderIndex(cols, 'empresa');
  const setupIdx = findHeaderIndex(cols, 'setup');
  const monthlyIdx = findHeaderIndex(cols, 'mensualidad');
  const ownerIdx = findHeaderIndex(cols, 'Responsable');
  const nextActionIdx = findHeaderIndex(cols, 'Próx. acción');
  const nextDateIdx = findHeaderIndex(cols, 'Próx. fecha');
  const notesIdx = findHeaderIndex(cols, 'Notas');

  const cellString = (row: GVizRow, idx: number): string => {
    if (idx < 0) return '';
    const c = row.c[idx];
    if (!c || c.v == null) return '';
    return String(c.v).trim();
  };
  const cellNumber = (row: GVizRow, idx: number): number => {
    if (idx < 0) return 0;
    const c = row.c[idx];
    if (!c || c.v == null || c.v === '') return 0;
    const n = typeof c.v === 'number' ? c.v : Number(c.v);
    return isFinite(n) ? n : 0;
  };

  const clientsMap = new Map<string, Client>();
  const opportunities: Opportunity[] = [];

  json.table.rows.forEach((row, idx) => {
    const cliente = cellString(row, clienteIdx);
    const proyecto = cellString(row, proyectoIdx);
    if (!cliente || !proyecto) return;

    const idRaw = cellString(row, idIdx);
    const id = idRaw ? `o${idRaw}` : `o-row${idx + 1}`;
    const estadoRaw = cellString(row, estadoIdx);
    const empresaRaw = cellString(row, empresaIdx);

    const status =
      STATUS_MAP[normalize(estadoRaw)] ||
      ('lead' as StatusId);
    const company = COMPANY_MAP[normalize(empresaRaw)] || 'NOVIT';

    const client = clientFromName(cliente, idx);
    if (!clientsMap.has(client.id)) clientsMap.set(client.id, client);

    opportunities.push({
      id,
      client_id: client.id,
      project: proyecto,
      company,
      status,
      setup: cellNumber(row, setupIdx),
      monthly: cellNumber(row, monthlyIdx),
      owner_id: cellString(row, ownerIdx) || '',
      source: '',
      created: '',
      last: '',
      next_action: cellString(row, nextActionIdx),
      next_date: cellString(row, nextDateIdx),
      notes: cellString(row, notesIdx),
      tags: [],
    });
  });

  // Assign deterministic colors to dynamically-created clients
  let colorIdx = 0;
  for (const c of clientsMap.values()) {
    if (!CLIENTS.find((known) => known.id === c.id)) {
      (c as Client & { color?: string }).color = PALETTE[colorIdx++ % PALETTE.length];
    }
  }

  return {
    opportunities,
    clients: Array.from(clientsMap.values()),
    fetchedAt: new Date().toISOString(),
  };
}
