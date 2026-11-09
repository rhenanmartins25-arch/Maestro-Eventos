/**
 * data.js — Estado inicial da aplicação (mock data)
 * Em produção, substituir por chamadas à API REST (FastAPI backend).
 */

const STATUS_LABELS = {
  EM_COTACAO:              'Em Cotação',
  PRONTO_PARA_EXECUCAO:    'Pronto p/ Execução',
  EM_EXECUCAO:             'Em Execução',
  AGUARDANDO_APROVACAO:    'Aguard. Aprovação',
  APROVADO_CLIENTE:        'Aprovado',
  NF_EMITIDA:              'NF Emitida',
  CONCLUIDO:               'Concluído',
};

const STATUS_FLOW = [
  'EM_COTACAO',
  'PRONTO_PARA_EXECUCAO',
  'EM_EXECUCAO',
  'AGUARDANDO_APROVACAO',
  'APROVADO_CLIENTE',
  'NF_EMITIDA',
  'CONCLUIDO',
];

const NEXT_STATUS = {
  EM_COTACAO:           'PRONTO_PARA_EXECUCAO',
  PRONTO_PARA_EXECUCAO: 'EM_EXECUCAO',
  EM_EXECUCAO:          'AGUARDANDO_APROVACAO',
  AGUARDANDO_APROVACAO: 'APROVADO_CLIENTE',
  APROVADO_CLIENTE:     'NF_EMITIDA',
  NF_EMITIDA:           'CONCLUIDO',
};

const NEXT_BTN_LABEL = {
  EM_COTACAO:           'Enviar para Execução →',
  PRONTO_PARA_EXECUCAO: 'Iniciar Execução →',
  EM_EXECUCAO:          'Aguardar Aprovação →',
  AGUARDANDO_APROVACAO: 'Marcar como Aprovado →',
  APROVADO_CLIENTE:     'Emitir NF →',
  NF_EMITIDA:           'Confirmar Pagamento ✓',
};

/** Estado reativo da aplicação */
const state = {
  ordens: [
    {
      id: 1,
      numero: 'OS-2024-00001',
      titulo: 'Seminário de Inovação Municipal',
      data: '2024-11-15',
      cliente: 'Secretaria de Educação',
      local: 'Centro de Convenções',
      status: 'EM_EXECUCAO',
      contrato: 'ATA-2024-001',
      logs: [
        { acao: 'OS criada', user: 'Ana Dias', dt: '01/11 09:00' },
        { acao: 'Status → Em Cotação', user: 'Ana Dias', dt: '01/11 09:01' },
        { acao: 'Status → Pronto p/ Execução', user: 'Carlos M.', dt: '05/11 14:30' },
        { acao: 'Status → Em Execução', user: 'Produtor', dt: '15/11 08:00' },
      ],
    },
    {
      id: 2,
      numero: 'OS-2024-00002',
      titulo: 'Conferência de Sustentabilidade',
      data: '2024-11-20',
      cliente: 'Governo Estadual',
      local: 'Palácio das Convenções',
      status: 'AGUARDANDO_APROVACAO',
      contrato: 'ATA-2024-003',
      logs: [
        { acao: 'OS criada', user: 'Ana Dias', dt: '03/11 10:15' },
        { acao: 'Status → Em Cotação', user: 'Ana Dias', dt: '03/11 10:16' },
        { acao: 'Status → Pronto p/ Execução', user: 'Carlos M.', dt: '06/11 11:00' },
        { acao: 'Evento realizado com sucesso', user: 'Produtor', dt: '20/11 18:00' },
      ],
    },
    {
      id: 3,
      numero: 'OS-2024-00003',
      titulo: 'Workshop de Capacitação RH',
      data: '2024-12-05',
      cliente: 'Secretaria de Administração',
      local: 'Auditório Central',
      status: 'EM_COTACAO',
      contrato: 'ATA-2024-001',
      logs: [
        { acao: 'OS criada', user: 'Ana Dias', dt: '08/11 15:00' },
      ],
    },
    {
      id: 4,
      numero: 'OS-2024-00004',
      titulo: 'Encontro de Gestores Públicos',
      data: '2024-12-10',
      cliente: 'Prefeitura Municipal',
      local: 'Hotel Plaza',
      status: 'PRONTO_PARA_EXECUCAO',
      contrato: 'ATA-2024-001',
      logs: [
        { acao: 'OS criada', user: 'Ana Dias', dt: '07/11 09:30' },
        { acao: 'OCs geradas', user: 'Carlos M.', dt: '08/11 16:00' },
      ],
    },
    {
      id: 5,
      numero: 'OS-2024-00005',
      titulo: 'Cerimônia de Premiação 2024',
      data: '2024-11-28',
      cliente: 'Câmara Municipal',
      local: 'Teatro Municipal',
      status: 'APROVADO_CLIENTE',
      contrato: 'ATA-2024-003',
      logs: [
        { acao: 'OS criada', user: 'Ana Dias', dt: '01/11 08:00' },
        { acao: 'Aprovado pelo cliente', user: 'Cliente', dt: '22/11 10:00' },
      ],
    },
  ],

  ordens_compra: [
    { id: 1, os_id: 1, fornecedor: 'Buffet Sabor & Arte', categoria: 'ALIMENTACAO', descricao: 'Coffee break para 200 pessoas', valor: 4800, status: 'CONFIRMADA' },
    { id: 2, os_id: 1, fornecedor: 'SomPro AV',           categoria: 'AUDIOVISUAL',  descricao: 'Sonorização e projeção', valor: 12000, status: 'CONFIRMADA' },
    { id: 3, os_id: 1, fornecedor: 'MobEvent Locações',   categoria: 'MOBILIARIO',   descricao: 'Mesas e cadeiras para 200 pax', valor: 3200, status: 'CONFIRMADA' },
    { id: 4, os_id: 2, fornecedor: 'RH Total Eventos',    categoria: 'RH',           descricao: '4 recepcionistas + 2 segurança', valor: 2800, status: 'CONFIRMADA' },
    { id: 5, os_id: 4, fornecedor: 'Buffet Sabor & Arte', categoria: 'ALIMENTACAO',  descricao: 'Almoço executivo 80 pessoas', valor: 6400, status: 'PENDENTE' },
    { id: 6, os_id: 4, fornecedor: 'TransLog Eventos',    categoria: 'TRANSPORTE',   descricao: 'Transfer executivos', valor: 1800, status: 'PENDENTE' },
  ],

  fornecedores: [
    { id: 1, razao: 'Buffet Sabor & Arte',  cnpj: '12.345.678/0001-90', categoria: 'ALIMENTACAO', contato: 'Maria Souza',   email: 'contato@buffetsabor.com' },
    { id: 2, razao: 'SomPro AV',            cnpj: '23.456.789/0001-01', categoria: 'AUDIOVISUAL',  contato: 'João Lima',     email: 'joao@sompro.com.br' },
    { id: 3, razao: 'MobEvent Locações',    cnpj: '34.567.890/0001-12', categoria: 'MOBILIARIO',   contato: 'Sandra Costa',  email: 'sandra@mobevent.com' },
    { id: 4, razao: 'RH Total Eventos',     cnpj: '45.678.901/0001-23', categoria: 'RH',           contato: 'Pedro Alves',   email: 'pedro@rhtotal.com' },
    { id: 5, razao: 'TransLog Eventos',     cnpj: '56.789.012/0001-34', categoria: 'TRANSPORTE',   contato: 'Roberto Nunes', email: 'roberto@translog.com' },
    { id: 6, razao: 'Light & Sound Pro',    cnpj: '67.890.123/0001-45', categoria: 'AUDIOVISUAL',  contato: 'Fernanda Tech',  email: 'fernanda@lsp.com' },
  ],

  licitacoes: [
    {
      id: 1,
      ata: 'ATA-2024-001',
      orgao: 'Prefeitura Municipal de São Paulo',
      objeto: 'Serviços de organização de eventos e suporte logístico',
      valor: 'R$ 1.200.000,00',
      inicio: '01/01/2024',
      fim: '31/12/2024',
      status: 'ATIVO',
    },
    {
      id: 2,
      ata: 'ATA-2024-003',
      orgao: 'Governo do Estado de São Paulo',
      objeto: 'Produção de eventos institucionais e corporativos',
      valor: 'R$ 3.500.000,00',
      inicio: '01/03/2024',
      fim: '28/02/2025',
      status: 'ATIVO',
    },
  ],
};

// Contadores para IDs autoincrementais
let _nextOSId   = state.ordens.length + 1;
let _nextOCId   = state.ordens_compra.length + 1;
let _nextFornId = state.fornecedores.length + 1;

function nextOSId()   { return ++_nextOSId; }
function nextOCId()   { return ++_nextOCId; }
function nextFornId() { return ++_nextFornId; }
