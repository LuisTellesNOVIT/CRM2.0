import { findClient } from './lookups';
import { calc } from './calc';
import type { Opportunity } from '@/types';

export type RecommendationPriority = 'alta' | 'media' | 'baja';

export type RecommendationType =
  | 'cierre'
  | 'seguimiento'
  | 'avance'
  | 'crosssell'
  | 'higiene'
  | 'aprendizaje'
  | 'estrategia';

export interface RecommendationTarget {
  view: 'kanban' | 'leads' | 'clients' | 'opp';
  id?: string;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  description: string;
  action: string;
  target: RecommendationTarget;
}

const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

export function generateRecommendations(
  opps: Opportunity[],
  today: Date = new Date(),
): Recommendation[] {
  const recs: Recommendation[] = [];
  const days = (iso: string) =>
    Math.round((today.getTime() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));

  // 1. Firma del contrato pendiente — cierre inmediato
  const signing = opps.filter((o) => o.status === 'signing');
  if (signing.length) {
    const total = signing.reduce((s, o) => s + (o.setup || 0) + (o.monthly || 0) * 12, 0);
    const names = signing
      .map((o) => findClient(o.client_id)?.name ?? '—')
      .join(', ');
    recs.push({
      id: 'r-sign',
      type: 'cierre',
      priority: 'alta',
      title: `Cerrar ${signing.length} contrato${signing.length > 1 ? 's' : ''} en firma`,
      description: `${names} acumulan S/ ${(total / 1000).toFixed(0)}K listos para activar.`,
      action: 'Ver Kanban',
      target: { view: 'kanban' },
    });
  }

  // 2. Propuestas estancadas (>7d sin interacción)
  const stalled = opps.filter((o) => o.status === 'proposal' && days(o.last) >= 7);
  for (const o of stalled) {
    const c = findClient(o.client_id);
    recs.push({
      id: `r-prop-${o.id}`,
      type: 'seguimiento',
      priority: 'alta',
      title: `Reactivar propuesta ${c?.name ?? '—'}`,
      description: `${o.project} sin interacción hace ${days(o.last)} días. Enviar WhatsApp o agendar llamada.`,
      action: 'Abrir oportunidad',
      target: { view: 'opp', id: o.id },
    });
  }

  // 3. Negociaciones — mover a firma
  const negotiating = opps.filter((o) => o.status === 'negotiation');
  if (negotiating.length >= 2) {
    const sample = negotiating
      .slice(0, 2)
      .map((o) => findClient(o.client_id)?.name ?? '—')
      .join(' y ');
    recs.push({
      id: 'r-nego',
      type: 'cierre',
      priority: 'media',
      title: `${negotiating.length} negociaciones por mover a firma`,
      description: `Aceleración foco: revisa SLA, descuentos y stakeholders en ${sample}.`,
      action: 'Ver pipeline',
      target: { view: 'kanban' },
    });
  }

  // 4. Demos sin propuesta enviada (>5d en demo)
  const demoStuck = opps.filter((o) => o.status === 'demo' && days(o.created) >= 5);
  if (demoStuck.length) {
    const names = demoStuck
      .map((o) => findClient(o.client_id)?.name ?? '—')
      .join(', ');
    recs.push({
      id: 'r-demo',
      type: 'avance',
      priority: 'media',
      title: `Convertir ${demoStuck.length} demo${demoStuck.length > 1 ? 's' : ''} en propuesta`,
      description: `Las demos pierden temperatura tras 7 días. Enviar propuesta a ${names}.`,
      action: 'Ver demos',
      target: { view: 'kanban' },
    });
  }

  // 5. Cross-sell sobre ganados
  const won = opps.filter((o) => o.status === 'won');
  if (won.length) {
    const ltvByClient = won.reduce<Record<string, number>>((acc, o) => {
      acc[o.client_id] = (acc[o.client_id] || 0) + calc.ltv36(o);
      return acc;
    }, {});
    const [bestId] = Object.entries(ltvByClient).sort((a, b) => b[1] - a[1])[0]!;
    const c = findClient(bestId);
    recs.push({
      id: 'r-cross',
      type: 'crosssell',
      priority: 'media',
      title: `Cross-sell con ${c?.name ?? '—'}`,
      description: `Cliente ganado de alto LTV. Explorar segundo proyecto vía ${
        c?.name === 'Mapfre' ? 'NOVIT' : 'SHARKY'
      }.`,
      action: 'Ver cliente',
      target: { view: 'clients', id: bestId },
    });
  }

  // 6. Limpieza CRM — campos vacíos
  const dirty = opps.filter((o) => !o.setup || !o.monthly).length;
  if (dirty > 0) {
    recs.push({
      id: 'r-clean',
      type: 'higiene',
      priority: 'baja',
      title: `${dirty} oportunidades con datos incompletos`,
      description: 'Faltan setup o mensualidad — afecta proyecciones y KPIs.',
      action: 'Limpiar CRM',
      target: { view: 'leads' },
    });
  }

  // 7. Aprender de perdidos
  const lost = opps.filter((o) => o.status === 'lost');
  if (lost.length >= 2) {
    const reasons = [...new Set(lost.map((o) => o.lost_reason).filter(Boolean))];
    recs.push({
      id: 'r-lost',
      type: 'aprendizaje',
      priority: 'baja',
      title: `Aprender de ${lost.length} oportunidades perdidas`,
      description: `Motivos recurrentes: ${reasons.join(' · ')}. Ajustar discurso y filtros de calificación.`,
      action: 'Ver perdidos',
      target: { view: 'leads' },
    });
  }

  // 8. Cliente con pipeline concentrado
  const byClient: Record<string, number> = {};
  opps
    .filter((o) => !['won', 'lost'].includes(o.status))
    .forEach((o) => {
      byClient[o.client_id] = (byClient[o.client_id] || 0) + calc.pipelineValue(o);
    });
  const sorted = Object.entries(byClient).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  if (top && top[1] > 200000) {
    const c = findClient(top[0]);
    recs.push({
      id: 'r-exec',
      type: 'estrategia',
      priority: 'alta',
      title: `Reunión ejecutiva con ${c?.name ?? '—'}`,
      description: `Concentra S/ ${(top[1] / 1000).toFixed(0)}K en pipeline. Acelerar con sponsor C-level.`,
      action: 'Ver cliente',
      target: { view: 'clients', id: top[0] },
    });
  }

  recs.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return recs;
}
