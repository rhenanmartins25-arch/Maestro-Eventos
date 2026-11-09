# GestãoEventos — Protótipo Frontend

Sistema de gestão de produção de eventos corporativos contratados via licitação.

## Funcionalidades do Protótipo

- **Dashboard** com estatísticas em tempo real
- **Kanban** visual com os 7 estágios do fluxo operacional
- **Ordens de Serviço (OS)** — criação, detalhe e avanço de status
- **Ordens de Compra (OC)** — vinculadas às 5 categorias (Alimentação, AV, Mobiliário, RH, Transporte)
- **Fornecedores** — cadastro e listagem por categoria
- **Licitações** — visualização de contratos ativos
- **Log de Auditoria** — histórico de alterações em cada OS

## Fluxo de Status

```
EM_COTAÇÃO → PRONTO_PARA_EXECUÇÃO → EM_EXECUÇÃO
         → AGUARDANDO_APROVAÇÃO → APROVADO_CLIENTE
         → NF_EMITIDA → CONCLUÍDO
```

## Estrutura do Projeto

```
gestao-eventos/
├── index.html        # Estrutura HTML + modais
├── css/
│   └── style.css     # Design system completo
├── js/
│   ├── data.js       # Estado inicial (mock data + constantes)
│   └── app.js        # Lógica de renderização e interação
├── vercel.json       # Configuração de deploy
└── README.md
```

## Deploy no Vercel

### Via GitHub (recomendado)

1. Faça push deste repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Clique em **Deploy** — sem configuração adicional necessária

### Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## Próximos Passos (Backend)

Este protótipo usa dados mockados em memória (`js/data.js`).
Para integrar com o backend FastAPI, substituir as funções de `app.js` por chamadas à API:

```js
// Exemplo de integração futura
async function salvarOS() {
  const res = await fetch('/api/v1/ordens-servico', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const os = await res.json();
  // ...
}
```

### Stack do Backend (planejada)
- **FastAPI** + **SQLAlchemy** + **PostgreSQL**
- **JWT** para autenticação com roles (ADM_FIN, COMPRADOR, PRODUTOR, CLIENTE, DIRETOR)
- **Celery** + **Redis** para geração de PDF e envio de e-mails
- **ReportLab** para relatórios em PDF
