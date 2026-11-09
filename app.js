/**
 * app.js — Lógica principal da aplicação
 * GestãoEventos — Protótipo Frontend
 */

'use strict';

// ══════════════════════════════════════════
//  NAVEGAÇÃO
// ══════════════════════════════════════════

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  kanban:       'Visão Kanban',
  ordens:       'Ordens de Serviço',
  compras:      'Compras & Ordens de Compra',
  fornecedores: 'Fornecedores Homologados',
  licitacoes:   'Contratos Licitatórios',
};

function go(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('screen-' + screen).classList.add('active');
  document.getElementById('page-title').textContent = PAGE_TITLES[screen] || screen;

  // Marca item ativo no sidebar
  document.querySelectorAll('.nav-item').forEach(n => {
    if (n.getAttribute('onclick')?.includes(`'${screen}'`)) n.classList.add('active');
  });

  render(screen);
}

// ══════════════════════════════════════════
//  RENDER DISPATCHER
// ══════════════════════════════════════════

function render(screen) {
  const map = {
    dashboard:    renderDashboard,
    kanban:       renderKanban,
    ordens:       renderOrdens,
    compras:      renderCompras,
    fornecedores: renderFornecedores,
    licitacoes:   renderLicitacoes,
  };
  map[screen]?.();
}

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════

function statusBadge(s) {
  const cls = {
    EM_COTACAO:           'badge-em_cotacao',
    PRONTO_PARA_EXECUCAO: 'badge-pronto',
    EM_EXECUCAO:          'badge-em_execucao',
    AGUARDANDO_APROVACAO: 'badge-aguardando',
    APROVADO_CLIENTE:     'badge-aprovado',
    NF_EMITIDA:           'badge-nf',
    CONCLUIDO:            'badge-concluido',
  };
  return `<span class="badge ${cls[s] || ''}">${STATUS_LABELS[s] || s}</span>`;
}

function ocStatusColor(s) {
  if (s === 'CONFIRMADA') return 'var(--success)';
  if (s === 'CANCELADA')  return 'var(--danger)';
  return 'var(--warning)';
}

function brMoney(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function fmtDate(isoDate) {
  if (!isoDate) return '—';
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR');
}

function nowDt() {
  return new Date().toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

// ══════════════════════════════════════════
//  RENDER: DASHBOARD
// ══════════════════════════════════════════

function renderDashboard() {
  const counts = {};
  STATUS_FLOW.forEach(s => { counts[s] = state.ordens.filter(o => o.status === s).length; });

  document.getElementById('stat-cotacao').textContent = counts.EM_COTACAO || 0;
  document.getElementById('stat-exec').textContent    = counts.EM_EXECUCAO || 0;
  document.getElementById('stat-aguard').textContent  = counts.AGUARDANDO_APROVACAO || 0;
  document.getElementById('stat-conc').textContent    = counts.CONCLUIDO || 0;

  const totalFaturado = state.ordens_compra
    .filter(oc => oc.status === 'CONFIRMADA')
    .reduce((acc, oc) => acc + oc.valor, 0);
  document.getElementById('stat-faturado').textContent = brMoney(totalFaturado) + ' em OCs confirmadas';

  // Últimas OS
  const osTbody = document.getElementById('dash-os-list');
  osTbody.innerHTML = [...state.ordens].reverse().slice(0, 5).map(o => `
    <tr>
      <td><span class="link" onclick="openDetail(${o.id})">${o.numero}</span></td>
      <td style="font-size:12px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.titulo}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>`).join('');

  // OCs recentes
  const ocTbody = document.getElementById('dash-oc-list');
  ocTbody.innerHTML = [...state.ordens_compra].reverse().slice(0, 5).map(oc => `
    <tr>
      <td style="font-size:12px">${oc.fornecedor}</td>
      <td><span class="cat-pill cat-${oc.categoria}" style="margin-bottom:0">${oc.categoria}</span></td>
      <td style="font-weight:600">${brMoney(oc.valor)}</td>
    </tr>`).join('');
}

// ══════════════════════════════════════════
//  RENDER: KANBAN
// ══════════════════════════════════════════

function renderKanban() {
  const board = document.getElementById('kanban-board');
  board.innerHTML = '';

  STATUS_FLOW.forEach(status => {
    const cards = state.ordens.filter(o => o.status === status);
    const col   = document.createElement('div');
    col.className = 'kanban-col';
    col.innerHTML = `
      <div class="kanban-header">
        <span class="kanban-title">${STATUS_LABELS[status]}</span>
        <span class="kanban-badge">${cards.length}</span>
      </div>
      <div class="kanban-cards">
        ${cards.length === 0
          ? '<div class="kanban-empty">Vazio</div>'
          : cards.map(o => `
              <div class="kcard" onclick="openDetail(${o.id})">
                <div class="kcard-os">${o.numero}</div>
                <div class="kcard-title">${o.titulo}</div>
                <div class="kcard-meta">
                  <span>📅 ${fmtDate(o.data)}</span>
                  <span class="kcard-tag">${o.cliente}</span>
                </div>
              </div>`).join('')}
      </div>`;
    board.appendChild(col);
  });
}

// ══════════════════════════════════════════
//  RENDER: ORDENS DE SERVIÇO
// ══════════════════════════════════════════

function renderOrdens() {
  const tbody = document.getElementById('os-table-body');
  tbody.innerHTML = state.ordens.map(o => `
    <tr>
      <td><span class="link" onclick="openDetail(${o.id})">${o.numero}</span></td>
      <td>${o.titulo}</td>
      <td>${fmtDate(o.data)}</td>
      <td style="font-size:12px">${o.cliente}</td>
      <td>${statusBadge(o.status)}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="openDetail(${o.id})">Ver detalhes</button></td>
    </tr>`).join('');
}

// ══════════════════════════════════════════
//  RENDER: COMPRAS / OC
// ══════════════════════════════════════════

function renderCompras() {
  const tbody = document.getElementById('oc-table-body');
  tbody.innerHTML = state.ordens_compra.map(oc => {
    const os = state.ordens.find(o => o.id === oc.os_id);
    return `
      <tr>
        <td style="font-size:12px">${os?.numero || '—'}</td>
        <td>${oc.fornecedor}</td>
        <td><span class="cat-pill cat-${oc.categoria}" style="margin-bottom:0">${oc.categoria}</span></td>
        <td style="font-weight:600">${brMoney(oc.valor)}</td>
        <td style="color:${ocStatusColor(oc.status)};font-weight:600;font-size:12px">${oc.status}</td>
        <td>
          ${oc.status === 'PENDENTE'
            ? `<button class="btn btn-success btn-sm" onclick="confirmarOC(${oc.id})">Confirmar</button>`
            : '<span style="color:var(--muted);font-size:12px">—</span>'}
        </td>
      </tr>`;
  }).join('');
}

// ══════════════════════════════════════════
//  RENDER: FORNECEDORES
// ══════════════════════════════════════════

function renderFornecedores() {
  const grid = document.getElementById('forn-grid');
  grid.innerHTML = state.fornecedores.map(f => `
    <div class="forn-card">
      <span class="cat-pill cat-${f.categoria}">${f.categoria}</span>
      <div class="forn-name">${f.razao}</div>
      <div class="forn-info">📄 ${f.cnpj}</div>
      <div class="forn-info">👤 ${f.contato || '—'}</div>
      <div class="forn-info">✉️ ${f.email || '—'}</div>
    </div>`).join('');
}

// ══════════════════════════════════════════
//  RENDER: LICITAÇÕES
// ══════════════════════════════════════════

function renderLicitacoes() {
  const tbody = document.getElementById('lic-table-body');
  tbody.innerHTML = state.licitacoes.map(l => `
    <tr>
      <td style="font-weight:600;color:var(--accent)">${l.ata}</td>
      <td style="font-size:12px">${l.orgao}</td>
      <td style="font-size:12px">${l.objeto}</td>
      <td style="font-weight:600">${l.valor}</td>
      <td style="font-size:12px">${l.inicio} – ${l.fim}</td>
      <td><span class="badge badge-aprovado">${l.status}</span></td>
    </tr>`).join('');
}

// ══════════════════════════════════════════
//  MODAIS
// ══════════════════════════════════════════

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Fecha modal ao clicar no fundo
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// Fecha modal com ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
  }
});

// ── Nova OS ──
function openNovaOS() { openModal('modal-os'); }

function salvarOS() {
  const titulo   = document.getElementById('f-titulo').value.trim();
  const data     = document.getElementById('f-data').value;
  const cliente  = document.getElementById('f-cliente').value.trim() || 'Cliente';
  const local    = document.getElementById('f-local').value.trim();
  const contrato = document.getElementById('f-contrato').value;
  const desc     = document.getElementById('f-desc').value.trim();

  if (!titulo || !data) {
    showToast('⚠️ Preencha título e data!', 'var(--warning)');
    return;
  }

  const id = nextOSId();
  const ano = new Date().getFullYear();
  const os = {
    id,
    numero: `OS-${ano}-${String(id).padStart(5, '0')}`,
    titulo, data, cliente, local, desc,
    contrato: contrato || 'ATA-2024-001',
    status: 'EM_COTACAO',
    logs: [{ acao: 'OS criada', user: 'Ana Dias', dt: nowDt() }],
  };

  state.ordens.push(os);
  closeModal('modal-os');
  ['f-titulo', 'f-data', 'f-local', 'f-cliente', 'f-desc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  showToast(`✅ ${os.numero} criada com sucesso!`);
  renderDashboard();
}

// ── Detalhe OS ──
function openDetail(id) {
  const os = state.ordens.find(o => o.id === id);
  if (!os) return;

  document.getElementById('detail-title').textContent = `${os.numero} — ${os.titulo}`;

  // Barra de progresso
  const shortLabels = ['Cotação', 'Pronto', 'Execução', 'Aprovação', 'Aprovado', 'NF', 'Concluído'];
  const ci = STATUS_FLOW.indexOf(os.status);
  document.getElementById('detail-progress').innerHTML = STATUS_FLOW.map((s, i) => {
    const cls  = i < ci ? 'done' : i === ci ? 'active' : '';
    const icon = i < ci ? '✓' : String(i + 1);
    return `
      <div class="pstep ${cls}">
        <div class="pstep-circle ${cls}">${icon}</div>
        <div class="pstep-label">${shortLabels[i]}</div>
      </div>`;
  }).join('');

  // Informações gerais
  document.getElementById('detail-info').innerHTML = `
    <div class="detail-row"><span class="detail-key">Cliente</span><span class="detail-val">${os.cliente}</span></div>
    <div class="detail-row"><span class="detail-key">Data</span><span class="detail-val">${fmtDate(os.data)}</span></div>
    <div class="detail-row"><span class="detail-key">Local</span><span class="detail-val">${os.local || '—'}</span></div>
    <div class="detail-row"><span class="detail-key">Status</span><span class="detail-val">${statusBadge(os.status)}</span></div>
    <div class="detail-row"><span class="detail-key">Contrato</span><span class="detail-val" style="font-size:11px">${os.contrato}</span></div>`;

  // Timeline / Auditoria
  document.getElementById('detail-timeline').innerHTML = os.logs.map((l, i) => `
    <div class="tline-item">
      <div class="tline-dot ${i < os.logs.length - 1 ? 'done' : 'active'}"></div>
      <div class="tline-content">
        <div class="tline-label">${l.acao}</div>
        <div class="tline-meta">${l.user} · ${l.dt}</div>
      </div>
    </div>`).join('');

  // OCs vinculadas
  const ocs = state.ordens_compra.filter(oc => oc.os_id === id);
  document.getElementById('detail-oc').innerHTML = ocs.length === 0
    ? '<tr><td colspan="4" style="color:var(--muted);font-size:12px;padding:12px">Nenhuma OC vinculada</td></tr>'
    : ocs.map(oc => `
        <tr>
          <td><span class="cat-pill cat-${oc.categoria}" style="margin-bottom:0;font-size:10px">${oc.categoria}</span></td>
          <td style="font-size:12px">${oc.fornecedor}</td>
          <td style="font-weight:600;font-size:13px">${brMoney(oc.valor)}</td>
          <td style="color:${ocStatusColor(oc.status)};font-weight:600;font-size:12px">${oc.status}</td>
        </tr>`).join('');

  // Botões de ação
  const foot = document.getElementById('detail-actions');
  foot.innerHTML = `<button class="btn btn-ghost" onclick="closeModal('modal-os-detail')">Fechar</button>`;
  if (NEXT_STATUS[os.status]) {
    foot.innerHTML += `
      <button class="btn btn-primary" onclick="avancarStatus(${os.id})">
        ${NEXT_BTN_LABEL[os.status]}
      </button>`;
  }

  openModal('modal-os-detail');
}

function avancarStatus(id) {
  const os = state.ordens.find(o => o.id === id);
  if (!os || !NEXT_STATUS[os.status]) return;

  const novoStatus = NEXT_STATUS[os.status];
  os.logs.push({ acao: `Status → ${STATUS_LABELS[novoStatus]}`, user: 'Ana Dias', dt: nowDt() });
  os.status = novoStatus;

  closeModal('modal-os-detail');
  showToast(`✅ Status atualizado: ${STATUS_LABELS[novoStatus]}`);
  renderDashboard();
  renderKanban();
  renderOrdens();
}

// ── Nova OC ──
function openNovaOC() {
  const selOS = document.getElementById('oc-os-id');
  selOS.innerHTML = state.ordens.map(o =>
    `<option value="${o.id}">${o.numero} — ${o.titulo.substring(0, 32)}</option>`
  ).join('');

  const selForn = document.getElementById('oc-forn');
  selForn.innerHTML = state.fornecedores.map(f =>
    `<option value="${f.id}">${f.razao}</option>`
  ).join('');

  openModal('modal-oc');
}

function salvarOC() {
  const os_id    = parseInt(document.getElementById('oc-os-id').value);
  const categoria = document.getElementById('oc-cat').value;
  const fornId   = parseInt(document.getElementById('oc-forn').value);
  const descricao = document.getElementById('oc-desc').value.trim();
  const valor    = parseFloat(document.getElementById('oc-valor').value);

  if (!descricao || isNaN(valor) || valor <= 0) {
    showToast('⚠️ Preencha todos os campos!', 'var(--warning)');
    return;
  }

  const forn = state.fornecedores.find(f => f.id === fornId);
  state.ordens_compra.push({
    id: nextOCId(),
    os_id, fornecedor: forn.razao, categoria, descricao, valor,
    status: 'PENDENTE',
  });

  closeModal('modal-oc');
  document.getElementById('oc-desc').value  = '';
  document.getElementById('oc-valor').value = '';
  showToast('✅ Ordem de Compra criada!');
  renderCompras();
}

function confirmarOC(id) {
  const oc = state.ordens_compra.find(o => o.id === id);
  if (oc) {
    oc.status = 'CONFIRMADA';
    showToast('✅ OC confirmada com sucesso!');
    renderCompras();
  }
}

// ── Novo Fornecedor ──
function openNovoForn() { openModal('modal-forn'); }

function salvarForn() {
  const razao    = document.getElementById('fn-razao').value.trim();
  const cnpj     = document.getElementById('fn-cnpj').value.trim();
  const categoria = document.getElementById('fn-cat').value;
  const contato  = document.getElementById('fn-contato').value.trim();
  const email    = document.getElementById('fn-email').value.trim();

  if (!razao || !cnpj) {
    showToast('⚠️ Preencha razão social e CNPJ!', 'var(--warning)');
    return;
  }

  state.fornecedores.push({ id: nextFornId(), razao, cnpj, categoria, contato, email });
  closeModal('modal-forn');
  ['fn-razao', 'fn-cnpj', 'fn-contato', 'fn-email'].forEach(id => {
    document.getElementById(id).value = '';
  });
  showToast('✅ Fornecedor cadastrado com sucesso!');
  renderFornecedores();
}

// ══════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════

let toastTimer = null;

function showToast(msg, borderColor) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.style.borderColor = borderColor || 'var(--success)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ══════════════════════════════════════════
//  INICIALIZAÇÃO
// ══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});
