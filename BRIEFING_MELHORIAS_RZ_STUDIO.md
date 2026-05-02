# 🏆 RZ Trader Studio — Briefing Estratégico de Melhorias v2.0

> **Projeto:** RZ Trader Studio (Hub de Opções Binárias)  
> **Stack:** React 18 + Vite + TypeScript + Supabase + TailwindCSS + Shadcn/UI  
> **Data:** 02/05/2026  
> **Foco:** Retenção, Conversão, UX Mobile/Desktop, Admin Analytics

---

## 📊 Diagnóstico Atual do Projeto

### Arquitetura
- **Frontend:** Vite + React 18 + TypeScript + TailwindCSS + Shadcn/UI
- **Backend:** Supabase (Auth, Database, Edge Functions, RLS)
- **Páginas públicas:** Landing (`/`), Login (`/login`), Signup (`/signup`), Privacy, Terms
- **Dashboard (`/app`):** Home, Carteira, Agenda, Gravadas, Premium, Indique, Depoimentos, Perfil
- **Admin (`/app/admin`):** Gestão de Usuários, Lives, Convites

### Pontos Fortes ✅
- Design system premium (black/gold) bem implementado
- Landing page editorial com estética Apple-like
- RLS robusto no Supabase com `SECURITY DEFINER`
- Triggers automáticos para cálculo de resultado e saldo
- Sistema de níveis (Iniciante → Bronze → Prata → Ouro)
- Terminal AI simulado como diferencial visual
- Componente `glass-card` reutilizável

### Pontos Fracos ❌
- **Mobile:** Sidebar ocupa tela inteira, cards muito largos, tabelas ilegíveis
- **Dashboard Home:** Sem gráficos de evolução, sem métricas de engajamento
- **Admin:** Sem analytics, sem logs, sem visão de acessos
- **Retenção:** Sem notificações, sem gamificação profunda, sem streaks
- **Conversão:** Landing sem timer de urgência, sem social proof dinâmico
- **Sem registro de atividades** (login, sessões, navegação)
- **Sem filtros/busca** nas tabelas do admin
- **Sem paginação** em nenhuma listagem

---

## 🏠 1. MELHORIAS NA HOME (CONVERSÃO)

### 1.1 Social Proof Dinâmico
- Adicionar **contador animado em tempo real** de membros online
- **Ticker de resultados** rolando: "João acabou de registrar +R$ 380"
- **Badge de urgência** com vagas restantes (ex: "Apenas 12 vagas")

### 1.2 Seção de Prova Social
- **Carrossel de depoimentos reais** da tabela `depoimentos` na landing
- Integrar resultados agregados reais: total faturado, média de payout

### 1.3 Otimização de CTA
- **Sticky CTA bar** no mobile (bottom bar fixa com "Quero meu acesso")
- **Timer de escassez** com contagem regressiva para fechamento de turma
- **Exit-intent popup** para desktop com oferta especial

### 1.4 Trust Signals
- Seção de logos de corretoras parceiras
- Contador de dias de operação consecutivos
- Badge "Verificado" com número de lives realizadas

---

## 📱 2. DASHBOARD — UX MOBILE (PRIORIDADE ALTA)

### 2.1 Bottom Navigation Bar (Mobile)
Substituir hamburger menu por **bottom tab bar** fixa com 5 ícones:

```
[Home] [Carteira] [Lives] [Indique] [Perfil]
```

- Ícones compactos com label de 1 palavra
- Indicador de "ao vivo" pulsante no ícone Lives
- Badge de notificações no ícone Home

### 2.2 Cards Compactos Mobile
- **StatCards:** Reduzir de 4 colunas para grid `2x2` compacto
- **Valores:** Font-size menor (text-lg ao invés de text-2xl)
- **Padding:** Reduzir de `p-5` para `p-3` em mobile
- **Sessões:** Lista compacta com swipe-to-expand ao invés de tabela

### 2.3 Tabelas Responsivas
- Substituir `<table>` por **card list** em telas < 768px
- Cada sessão vira um card com informações empilhadas
- Swipe horizontal com indicador de scroll para tabelas admin

### 2.4 Quick Actions Mobile
- **FAB (Floating Action Button)** para "Nova Sessão" na Carteira
- **Pull-to-refresh** na Home e Carteira
- **Haptic feedback** visual nos toasts (animação de bounce)

---

## 🖥️ 3. DASHBOARD — UX DESKTOP

### 3.1 Gráfico de Evolução da Banca
- **Line chart** (recharts já instalado) com evolução do saldo ao longo do tempo
- Período selecionável: 7d, 30d, 90d, Tudo
- Linha de referência na banca inicial
- Hover tooltip com detalhes da sessão

### 3.2 Mini-Dashboard de Performance
Novo card na Home com métricas calculadas:

| Métrica | Cálculo |
|---|---|
| Win Rate | `sessões positivas / total × 100` |
| Média por sessão | `totalLucro / totalSessões` |
| Melhor sessão | `max(resultado)` |
| Sequência atual | `streak de wins/losses consecutivos` |
| Dias operando | `distinct dates de sessões` |

### 3.3 Sidebar Melhorada
- **Collapse/expand** com ícone de seta (modo mini: só ícones)
- **Indicador de live ao vivo** pulsante na sidebar
- **Quick-status** do expert na sidebar (online/offline)
- Contagem de notificações pendentes

### 3.4 Temas e Personalização
- Toggle dark/light mode (estrutura CSS já suporta)
- Opção de sidebar compacta vs expandida salva em localStorage

---

## 🎮 4. RETENÇÃO E ENGAJAMENTO

### 4.1 Sistema de Streaks
- **Login streak:** Dias consecutivos acessando a plataforma
- Visual de "chama" 🔥 ao lado do nome com contador
- Recompensas por streaks (7, 14, 30 dias)

### 4.2 Sistema de Conquistas (Achievements)

| Conquista | Condição |
|---|---|
| Primeira Sessão | Registrar 1 sessão |
| Consistente | 10 sessões positivas |
| Disciplinado | 5 dias sem operar após 3 perdas |
| Mão Quente | 5 wins consecutivos |
| Veterano | 30 dias como membro |
| Embaixador | 10 indicações |
| Banca Ouro | +50% sobre banca inicial |

- Cards de conquistas no Perfil com progress bar
- Toast especial ao desbloquear

### 4.3 Notificações In-App
- "Live começando em 15 minutos"
- "Expert está online agora"
- "Parabéns! Você subiu para nível Prata"
- "Sua banca cresceu 10% esta semana"
- Badge contador no header

### 4.4 Diário de Trading
Nova seção `/app/diario`:
- Registro diário com campo de texto livre + humor (😊😐😟)
- Tags: "seguiu o plano", "operou no tilt", "parou no stop"
- Correlação humor vs resultado

---

## 🔧 5. NOVAS FUNCIONALIDADES DA DASHBOARD

### 5.1 Relatórios Semanais/Mensais
- PDF ou modal com resumo: sessões, P&L, win rate, evolução
- Comparativo semana atual vs anterior
- Gráfico pizza de distribuição ganhos vs perdas

### 5.2 Calculadora de Gestão de Risco
- Input: banca atual, % risco por operação, payout
- Output: valor máximo por entrada, stop diário sugerido
- Alerta automático quando ultrapassar o stop

### 5.3 Feed de Atividades
Timeline na Home com eventos recentes:
- "Você registrou uma sessão +R$200"
- "Live Premium amanhã às 09:00"
- "Novo depoimento de @marcos"

### 5.4 Metas Pessoais
- Definir meta mensal de lucro
- Progress bar visual na Home
- Notificação ao atingir a meta

---

## 🛡️ 6. ÁREA ADMINISTRADOR — MELHORIAS

### 6.1 Dashboard de Analytics (Nova aba)
KPIs em cards no topo:

| KPI | Descrição |
|---|---|
| Total Usuários | Count de profiles |
| Ativos Hoje | Usuários com login nas últimas 24h |
| Premium / Free | Proporção com mini donut chart |
| Receita Estimada | Premium × valor plano |
| Churn Rate | Inativos / Total |

Gráficos:
- **Line:** Novos cadastros por dia (30 dias)
- **Bar:** Sessões registradas por dia
- **Donut:** Distribuição por plano e nível

### 6.2 Log de Acessos / Atividades
Nova tabela `activity_logs`:

```sql
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_activity_user ON public.activity_logs(user_id, created_at DESC);
```

### 6.3 Qualificação de Usuários (Lead Scoring)
Sistema de pontuação automático:

| Ação | Pontos |
|---|---|
| Login no dia | +2 |
| Sessão registrada | +5 |
| Sessão positiva | +3 |
| Depoimento enviado | +4 |
| Indicação feita | +6 |
| Live assistida | +3 |
| 3+ dias sem login | -5 |

- **Score total** visível na tabela de usuários do admin
- **Badges:** 🔴 Frio (0-20), 🟡 Morno (21-50), 🟢 Quente (51-80), 🔥 Super Qualificado (80+)
- **Filtro por temperatura** na lista de usuários
- **Ordenação** por score para priorizar contato

### 6.4 Filtros e Busca Avançada
- Campo de busca por nome/email em todas as tabs
- Filtros: por plano, status, data de cadastro, nível, score
- Paginação com 20 itens por página
- Export CSV da lista de usuários

### 6.5 Painel de Depoimentos (Admin)
- Nova aba no admin para moderar depoimentos
- Aprovar/rejeitar antes de exibir na landing
- Fixar depoimentos destacados

### 6.6 Comunicação com Usuários
- **Envio de mensagens** in-app para usuários específicos ou broadcast
- Templates de mensagem (boas-vindas, upgrade, aviso)
- Histórico de mensagens enviadas

---

## 📈 7. ANALYTICS E VISÃO DE ACESSOS

### 7.1 Métricas de Acesso por Usuário
Visível no perfil do usuário (admin view):
- Último login
- Total de logins no mês
- Páginas mais visitadas
- Tempo médio de sessão
- Dispositivo (mobile/desktop)

### 7.2 Ranking de Engajamento
Nova aba no admin "Ranking":
- Top 10 usuários mais ativos
- Top 10 por lucro acumulado
- Top 10 por indicações
- Usuários que nunca logaram após cadastro (churn risk)

### 7.3 Cohort Analysis (Simplificado)
- Tabela mostrando retenção por semana de cadastro
- % de usuários que voltaram na semana 1, 2, 3, 4
- Identificar quando usuários param de usar

### 7.4 Funil de Conversão
- Landing → Signup → Checkout → Pagamento → Primeiro Login → Primeira Sessão
- Percentual de conversão em cada etapa
- Identificar gargalos

---

## 🗄️ 8. NOVAS TABELAS SUPABASE NECESSÁRIAS

```sql
-- 1. Activity Logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Achievements
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points INT DEFAULT 0
);

-- 3. User Achievements
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 4. Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Trading Diary
CREATE TABLE public.diario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  humor TEXT CHECK (humor IN ('otimo','bom','neutro','ruim','pessimo')),
  notas TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, data)
);

-- 6. User Scores (materialized)
CREATE TABLE public.user_scores (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  last_login TIMESTAMPTZ,
  login_streak INT DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Admin Messages
CREATE TABLE public.admin_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_admin UUID REFERENCES auth.users(id),
  to_user UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 🎯 9. PRIORIZAÇÃO DE IMPLEMENTAÇÃO

### Fase 1 — Crítico (Semana 1-2)
1. Bottom navigation mobile
2. Cards responsivos mobile
3. Tabelas → card list mobile
4. Gráfico de evolução da banca (recharts)
5. Win rate e métricas na Home

### Fase 2 — Alto Impacto (Semana 3-4)
6. Activity logs + registro de acessos
7. Lead scoring no admin
8. Filtros/busca/paginação no admin
9. Notificações in-app
10. Sticky CTA mobile na landing

### Fase 3 — Engajamento (Semana 5-6)
11. Sistema de streaks
12. Conquistas/achievements
13. Diário de trading
14. Dashboard analytics admin
15. Social proof dinâmico na landing

### Fase 4 — Avançado (Semana 7-8)
16. Ranking de engajamento
17. Relatórios semanais
18. Calculadora de risco
19. Comunicação admin → usuário
20. Cohort analysis

---

## 🤖 10. PROMPT DE IMPLEMENTAÇÃO COMPLETO

> **Cole o prompt abaixo para implementar todas as melhorias no projeto existente sem quebrar nada:**

---

```
Você é um engenheiro frontend/fullstack sênior especializado em React + TypeScript + Supabase + TailwindCSS + Shadcn/UI. Você vai implementar melhorias incrementais no projeto "RZ Trader Studio" — um hub de opções binárias com dashboard para membros e painel admin.

## CONTEXTO DO PROJETO

- Stack: Vite + React 18 + TypeScript + TailwindCSS + Shadcn/UI + Supabase
- Auth: Supabase Auth com profiles + user_roles (RLS ativo em todas as tabelas)
- Tabelas existentes: profiles, user_roles, carteiras, sessoes, lives, convites, depoimentos, expert_status
- Trigger handle_new_user: cria profile+carteira+convites+role automaticamente
- Trigger handle_sessao: calcula resultado (ganhos-perdas) e atualiza saldo_atual na carteira
- Tipos em src/types/index.ts: Profile, AuthUser, Carteira, Sessao, Live, Convite, Depoimento, Nivel
- API em src/services/api.ts: carteiraApi, sessoesApi, livesApi, convitesApi, depoimentosApi, expertApi, adminApi
- AuthContext: user, login, signup, logout, isAdmin, isPremium
- DashboardLayout: sidebar lateral (desktop) e hamburger menu (mobile)
- Páginas: Home, Carteira, Agenda, Gravadas, Premium, Indique, Depoimentos, Perfil, Admin
- Design: tema black/gold com variáveis HSL, glass-card, dot-online/offline, terminal-cursor
- Recharts já instalado como dependência

## REGRAS OBRIGATÓRIAS

1. NÃO quebre nenhuma funcionalidade existente
2. NÃO altere estrutura de tabelas existentes — apenas adicione novas
3. NÃO remova componentes — melhore ou adicione
4. Mantenha o design system black/gold (variáveis CSS em index.css)
5. Use componentes Shadcn/UI já instalados
6. Novas tabelas com RLS + policies adequadas
7. Security Definer para lógicas cross-permission
8. TypeScript estrito — atualize src/types/index.ts
9. Novas APIs seguem padrão de src/services/api.ts
10. Recharts para gráficos

## BLOCO 1 — UX MOBILE

A) BottomNav.tsx (src/components/layout/):
   - Apenas em telas < 1024px (hook use-mobile)
   - 5 tabs: Home, Carteira, Lives, Indique, Perfil
   - Ícones lucide-react: Home, Wallet, Radio, Gift, User
   - 64px altura, bg-background/95 backdrop-blur, border-top
   - Tab ativa: cor primary; inativas: muted-foreground
   - Pulsante no ícone Lives quando há live ao_vivo
   - Padding-bottom 64px no main quando mobile
   - Esconder hamburger quando BottomNav visível

B) StatCards responsivos: grid-cols-2 com p-3 em mobile

C) ResponsiveTable: <table> desktop, cards empilhados mobile
   Aplicar em Carteira e Admin

D) FAB na Carteira: botão "+" flutuante para nova sessão (mobile only)

## BLOCO 2 — DASHBOARD MÉTRICAS

A) BancaChart.tsx (src/components/home/):
   - Line chart recharts: evolução saldo por sessão
   - Linha referência na banca_inicial (dashed)
   - Gradiente primary/20 abaixo da linha
   - Tabs: 7d, 30d, 90d, Tudo
   - Tooltip: data, saldo, resultado
   - Colocar em tabs alternando com AITerminal

B) PerformanceCard.tsx (src/components/home/):
   - Win Rate, Média/sessão, Melhor sessão, Streak atual
   - Grid 2x2 compacto, abaixo dos StatCards

## BLOCO 3 — ACTIVITY LOGS + LEAD SCORING

A) Migration: activity_logs + user_scores (schemas acima)
B) activityApi.ts: log(), getMyLogs(), adminGetAll()
C) Integrar: login, session_created, testimonial_sent, referral_copied
D) Admin: colunas Score (badge colorido), Último acesso, Streak
   Ordenação por score, filtro por temperatura

## BLOCO 4 — ADMIN ANALYTICS

A) Aba "Analytics": KPI cards + BarChart sessões/dia + LineChart cadastros/dia
B) Busca/filtros na aba Usuários: input busca, filtro plano/status, paginação 20/página

## BLOCO 5 — NOTIFICAÇÕES

A) Tabela notifications + RLS
B) NotificationBell.tsx no header: badge contador, dropdown últimas 10
C) Triggers: live ao_vivo → notificar; expert online → notificar; nível up → notificar

## BLOCO 6 — STREAKS E CONQUISTAS

A) Tabelas achievements + user_achievements
B) Seção "Conquistas" no Perfil com grid de cards
C) Login streak em user_scores, exibir 🔥 na Home

## BLOCO 7 — LANDING CONVERSÃO

A) Sticky CTA bar mobile: fixa no bottom após scroll 400px
B) Social proof: carrossel depoimentos reais, contador animado membros

## ARQUIVOS NOVOS

src/components/layout/BottomNav.tsx
src/components/layout/NotificationBell.tsx
src/components/home/BancaChart.tsx
src/components/home/PerformanceCard.tsx
src/components/ui/responsive-table.tsx
src/services/activityApi.ts
src/services/notificationsApi.ts
supabase/migrations/YYYYMMDD_melhorias_v2.sql

## OBSERVAÇÕES

- Testar todas rotas após cada bloco
- Verificar RLS com user free, premium e admin
- Testar viewport 375px e 390px
- Lazy load gráficos, React.memo em componentes pesados
- Implementar bloco por bloco, começando pelo BLOCO 1
```

---

> **Este documento é um guia vivo. Atualize conforme as implementações forem concluídas.**

*RZ Trader Studio © 2026 — Briefing gerado por análise completa do codebase.*
