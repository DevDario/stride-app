# STRIDE — Product Requirements Document
**Runner's Community App — Angola**
Version 0.1 | Confidential — Internal Use Only

---

## 01 — Visão Geral do Produto

STRIDE é um aplicativo mobile para corredores urbanos focado em três pilares:
**inteligência coletiva de área**, **desafio baseado em território** e **identidade flexível do utilizador**.

O produto não compete diretamente com Strava ou Nike Run Club no registo de atividade — compete no **contexto local** que essas plataformas ignoram.

O mercado-alvo inicial é Luanda, Angola, onde o ambiente urbano para corrida apresenta características únicas: variação significativa de segurança por zona e horário, ausência de dados locais de qualidade para corredores, e uma cultura de desafio social que pode ser capitalizada num loop de retenção forte.

| | O Problema | A Solução |
|---|---|---|
| **Contexto** | Corredores em Luanda não têm dados locais confiáveis sobre segurança, movimento de pessoas ou qualidade das rotas. Apps globais não cobrem esse contexto. | STRIDE transforma a experiência coletiva de quem já correu numa área em dados acionáveis para quem planeia correr. Complementado por desafios territoriais que criam retenção orgânica. |

---

## 02 — Objetivos do Produto

### Objetivos de Negócio (6–12 meses pós-lançamento)
- Atingir 500 utilizadores ativos mensais em Luanda no primeiro trimestre.
- Gerar pelo menos 200 avaliações de área nos primeiros 60 dias (validação do loop principal).
- Manter taxa de retenção Day-7 acima de 25% — benchmark mínimo aceitável para apps de fitness.
- Estabelecer base para monetização (premium, parcerias locais com eventos de corrida).

### Objetivos do Utilizador
- Descobrir rotas adequadas ao seu perfil antes de sair de casa.
- Ter contexto de segurança e ambiente baseado em feedback real de outros corredores.
- Participar em desafios locais com contexto geográfico que conhece.
- Controlar a sua privacidade sem perder a experiência social.

---

## 03 — Perfis de Utilizador (User Personas)

| Persona | Descrição | Necessidade Principal |
|---|---|---|
| **O Corredor Regular** (25–38 anos, 3–4x/semana) | Tem rotinas definidas mas quer explorar novas rotas com segurança. Conhece os apps globais mas sente falta de contexto local. | Saber se uma área nova é segura no horário que planeia correr. |
| **O Competitivo** (20–32 anos, motivado por performance) | Usa Strava, quer bater recordes, mas falta-lhe rivais locais com contexto geográfico real. | Desafios com pessoas reais em rotas que conhece. |
| **O Casual / Iniciante** (18–45 anos, ocasional) | Quer começar a correr mas não sabe por onde. Precisa de orientação baseada em segurança e conforto. | Encontrar áreas recomendadas por outros corredores. |

---

## 04 — Funcionalidades do Produto

### 4.1 — Mapa Principal

Ecrã central da aplicação. Agrega todas as camadas de informação num único mapa interativo.

| Feature | Descrição | Prioridade |
|---|---|---|
| Mapa base | Visualização do mapa da cidade com suporte a camadas sobrepostas (overlays). Overlays desativados por omissão. | MVP — Core |
| Overlay: Avaliações de Área | Zonas coloridas com rating agregado (segurança, movimento, ambiente). Heatmap por zona. | MVP — Core |
| Overlay: Rotas do Utilizador | Historial de corridas do próprio utilizador visível no mapa. Clique abre modal estilo Strava. | MVP — Core |
| Overlay: Desafios Ativos | Pins de desafios públicos criados por utilizadores. Clique abre bottom-sheet com detalhes e leaderboard. | MVP — Core |
| Overlay: Recordes Públicos | Pins de recordes publicados. Clique mostra detentor, top leaderboard e estatísticas. | MVP — Core |

### 4.2 — Sistema de Avaliação de Área

O diferencial mais único do produto. Permite que corredores avaliem zonas urbanas com critérios específicos para corrida.

| Feature | Descrição | Prioridade |
|---|---|---|
| Avaliação pós-corrida | Após terminar uma corrida, o utilizador é convidado (não obrigado) a avaliar a área. Critérios: Segurança, Movimento de pessoas, Ambiente/Vibe, Clima típico. | MVP — Core |
| Rating contextualizado por horário | A avaliação inclui o horário. O sistema agrega ratings separadamente por faixa horária (manhã / tarde / noite). Isto é o que diferencia do Google Maps. | MVP — Core |
| Visualização de ratings | Nota geral, breakdown por critério, número de avaliações, faixa horária mais avaliada. | MVP — Core |
| Avaliação anónima por omissão | Avaliações não identificam o utilizador por nome por omissão. O utilizador pode optar por torná-la pública. | MVP — Core |

### 4.3 — Sistema de Desafios

#### 4.3.1 — Desafios Públicos (Territoriais)

| Feature | Descrição | Prioridade |
|---|---|---|
| Criar Desafio | Qualquer utilizador pode criar um desafio marcando um ponto de início no mapa, definindo uma meta e uma data de encerramento. | MVP — Core |
| Participar em Desafio | Utilizador clica no pin, vê detalhes e inicia. O trajeto é registado e comparado à meta. | MVP — Core |
| Leaderboard | Top 3–5 participantes visível no modal. Destaque para o atual líder / 'title holder'. | MVP — Core |
| Publicar Recorde no Mapa | Após terminar uma corrida, o utilizador pode publicar o resultado como desafio aberto. Acessível também no histórico. | MVP — Core |
| Página de Desafios | Ecrã dedicado listando desafios ativos por proximidade, data de encerramento e popularidade. | MVP — Core |

#### 4.3.2 — Desafios Pessoais

> ⚠️ **Nota de produto:** Esta feature existe no Strava e em praticamente todos os apps de fitness. Não é diferencial. Deve ser construída apenas se não comprometer o prazo do MVP. Se tiver que escolher entre esta e qualquer feature do 4.1 ou 4.2, corta esta.

| Feature | Descrição | Prioridade |
|---|---|---|
| Beat Your Own Time | O utilizador seleciona uma corrida passada e tenta superá-la. Comparação em tempo real. | V2 — Pós-MVP |

### 4.4 — Registo de Corrida e Sensores

| Feature | Descrição | Prioridade |
|---|---|---|
| GPS Tracking | Rota em tempo real via GPS nativo. Necessário para calcular distância, pace e registar o trajeto no mapa. | MVP — Core |
| Pedómetro / Acelerómetro | Contagem de passos via sensor para maior precisão em zonas com sinal GPS fraco. | MVP — Core |
| Health APIs | Integração com Apple HealthKit (iOS) e Google Health Connect (Android). | V2 — Pós-MVP |
| Frequência Cardíaca | Suporte via wearables. Não prioritário no MVP. | V3 — Futuro |

### 4.5 — Identidade e Privacidade

| Feature | Descrição | Prioridade |
|---|---|---|
| Identidade flexível | Aquando do registo, o utilizador escolhe entre nome real + foto ou um alias (@handle) com avatar gerado. Pode alterar nas definições a qualquer momento. | MVP — Core |
| Publicação com identidade | Quando publica um recorde ou participa num desafio público, o sistema usa a identidade escolhida. | MVP — Core |
| Avaliações de área | Por omissão, avaliações são anónimas. O utilizador pode optar por as tornar públicas. | MVP — Core |

---

## 05 — Fora do Scope (MVP)

Definir o que o produto **não faz** é tão importante quanto definir o que faz. Estas exclusões são deliberadas.

| Exclusão | Racional |
|---|---|
| **Registo de atividade genérico** | O STRIDE não tenta ser um Strava. O tracking é instrumental — serve para gerar dados para o mapa e desafios. |
| **Planos de treino** | Feature de apps de coaching. Fora do scope indefinidamente. |
| **Social feed genérico** | Sem timeline de atividades de amigos. O social é geográfico e baseado em desafios. |
| **Wearable-first** | O app funciona apenas com smartphone. Wearables são V2 no mínimo. |
| **Monetização no MVP** | Sem paywall, sem premium, sem publicidade. Foco em validação de uso e retenção. |
| **Cobertura fora de Luanda** | Lançamento exclusivo em Luanda. Expansão só após validação do modelo. |

---

## 06 — Fluxos Principais do Utilizador

### Flow 1 — Descobrir Área e Correr
1. Utilizador abre o app → Mapa principal carrega
2. Ativa overlay de "Avaliações de Área"
3. Toca numa zona → pop-up com rating por critério e horário
4. Decide correr → inicia corrida (GPS ativa)
5. Termina corrida → modal de resultado estilo Strava
6. Convidado a avaliar a área → submete avaliação (opcional)
7. Convidado a publicar recorde como desafio → aceita ou rejeita

### Flow 2 — Aceitar e Completar um Desafio
1. Utilizador abre o app → vê pin de desafio no mapa
2. Toca no pin → bottom-sheet com detalhes: meta, leaderboard, criador
3. Prime "Aceitar Desafio" → navegação para ponto de início
4. Inicia corrida → tracking em tempo real com comparação à meta
5. Termina → resultado comparado à meta e ao líder atual
6. Se bater o recorde: notificação ao criador e ao líder anterior
7. Resultado publicado no leaderboard do desafio

### Flow 3 — Criar e Publicar um Desafio
1. Após terminar corrida → modal de resultado
2. Prime "Publicar como Desafio" → formulário: título, meta, data de encerramento
3. Define identidade pública (nome real ou alias)
4. Confirma → pin criado no mapa
5. Ou: Histórico de corridas → seleciona corrida passada → "Publicar Desafio"

---

## 07 — Riscos e Mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| **Cold Start Problem** | O app depende de avaliações de área para ser útil. Com zero utilizadores, o mapa está vazio. **Este é o maior risco de produto.** | Seed manual: percorrer rotas e criar avaliações iniciais antes do lançamento. Recrutar beta testers corredores. |
| **Dados de GPS em Luanda** | Cobertura GPS inconsistente em certas zonas afeta a precisão do tracking e dos pins. | Testes de campo extensivos antes do lançamento. Fallback para acelerómetro em zonas de baixo sinal. |
| **Privacidade e Segurança** | Publicar localização de corridas pode expor padrões de movimento — risco real no contexto angolano. | Identidade flexível como feature core. Opção de não publicar rotas. Avaliações anónimas por omissão. Revisão legal antes do lançamento. |
| **Retenção sem massa crítica** | Se o número de utilizadores não atingir massa crítica por zona, os desafios ficam sem participantes e o loop gamificado quebra. | Foco geográfico restrito inicialmente (ex: só Talatona e Miramar). Concentrar utilizadores numa área pequena antes de expandir. |
| **Qualidade das avaliações** | Avaliações falsas ou mal-intencionadas degradam a utilidade do produto rapidamente. | Sistema de reporte. Mínimo de corridas para poder avaliar. Ponderação por frequência do utilizador na área. |

---

## 08 — Considerações Técnicas (Alto Nível)

> ⚠️ Esta secção não é uma decisão final de arquitetura — é um ponto de partida. As decisões reais devem ser tomadas com base em benchmarks e na capacidade da equipa.

| Camada | Opção Recomendada | Racional |
|---|---|---|
| **Mobile** | React Native (Expo) | Cross-platform, ecosistema maduro. |
| **Mapas** | Mapbox SDK | Suporte a camadas customizadas (overlays, heatmaps). Google Maps é alternativa mas mais limitado. |
| **Backend** | Node.js + PostgreSQL + PostGIS | PostGIS é essencial para queries geoespaciais (ratings por zona, proximidade de desafios). |
| **Auth** | Supabase Auth | Reduz tempo de desenvolvimento. Preferível se o backend já usar PostgreSQL. |
| **GPS / Sensores** | expo-location + expo-sensors | APIs nativas via Expo. Health APIs em biblioteca separada em V2. |
| **Real-time** | Supabase Realtime | Para atualização de leaderboards em tempo real durante desafios. |

---

## 09 — Roadmap de Desenvolvimento

> ⚠️ Timelines são estimativas indicativas. O que importa é a **ordem de prioridade**, não as datas.

### MVP — Fase 1 (Validação do Core)
- Mapa principal com overlays básicos
- Tracking de corrida (GPS + acelerómetro)
- Sistema de avaliação de área (pós-corrida)
- Desafios públicos: criar, participar, leaderboard
- Publicar recorde no mapa
- Sistema de identidade flexível (nome real vs alias)
- Modal de resultado pós-corrida (estilo Strava)
- Autenticação e perfil básico

### V2 — Fase 2 (Retenção e Crescimento)
- Integração com Apple HealthKit / Google Health Connect
- Desafios pessoais (Beat Your Own Time)
- Notificações push (recorde batido, desafio próximo a encerrar)
- Página de desafios com filtros avançados
- Sistema de reporte de avaliações
- Melhorias de UX baseadas em feedback da Fase 1

### V3 — Fase 3 (Expansão)
- Suporte a wearables (frequência cardíaca)
- Expansão geográfica para outras cidades angolanas
- Modelo de monetização (definir com base em dados de uso)
- API pública para parceiros (eventos de corrida, marcas)

---

## 10 — Métricas de Sucesso

| Métrica | Descrição | Target MVP |
|---|---|---|
| **DAU / MAU Ratio** | % de utilizadores mensais que usam o app diariamente. Indica hábito. | > 15% |
| **Avaliações / Corrida** | Média de avaliações submetidas por corrida concluída. Valida o loop principal. | > 30% das corridas |
| **Day-7 Retention** | % de utilizadores que voltam 7 dias após o registo. | > 25% |
| **Desafios Completados** | Número de desafios com pelo menos 3 participantes. Valida o loop gamificado. | > 10 no primeiro mês |
| **Cobertura de Área** | Número de zonas distintas com pelo menos 5 avaliações. | > 15 zonas em 60 dias |

---

*Este documento é um ponto de partida, não um contrato. Decisões de produto devem ser revisitadas após os primeiros dados reais de utilização. Nenhuma feature deve ser construída sem validar primeiro que o problema que resolve é real e prioritário para o utilizador-alvo.*

*STRIDE PRD v0.1*