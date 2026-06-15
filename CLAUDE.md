# CLAUDE.md — IGNITE Individual Coaching

Ficheiro de contexto do projeto para o Claude (e para qualquer dev que entre no projeto).  
Lê isto antes de tocar em qualquer ficheiro.

---

## O que é este projeto

Aplicação web mobile-first para o **IGNITE Individual Coaching** — uma marca de personal training.  
Tem dois modos de utilização:

- **Modo Cliente** — landing page + formulário de onboarding em 6 passos. O cliente preenche os dados e submete a candidatura.
- **Modo Editor** — painel privado (protegido por PIN) onde o personal trainer consulta os clientes, vê os seus objetivos e dificuldades, e edita o seu perfil.

---

## Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React (JSX, hooks) |
| Estilo | CSS-in-JS inline + injeção de `<style>` no `<head>` |
| Fontes | Google Fonts — Bebas Neue, Barlow, Barlow Condensed |
| Persistência | `localStorage` (sem backend, sem base de dados) |
| Deploy alvo | Vercel / Netlify (SPA estática) |
| Formato de entrega | `.jsx` single-file, exportável como React artifact |

Sem dependências externas além do React base. Sem Tailwind, sem UI libraries.

---

## Identidade visual IGNITE

A marca tem uma estética **dark industrial com smoke verde**. Respeitar sempre:

| Token | Valor |
|---|---|
| Background principal | `#000000` |
| Background superfície | `#080808` / `#0a0a0a` |
| Verde primário | `#4a783a` |
| Verde claro (texto/glow) | `#6aaa55` |
| Verde escuro | `#2d4e22` |
| Texto principal | `#f2f2f0` |
| Texto muted | `#555` / `#888` |
| Border padrão | `rgba(255,255,255,0.07)` |
| Border verde | `rgba(74,120,58,0.35)` |

**Tipografia:**
- `Bebas Neue` — títulos, logo, números de destaque
- `Barlow` (weight 300–500) — corpo de texto, inputs, labels
- `Barlow Condensed` — labels de secção, tags, botões uppercase

**Regras de design invioláveis:**
- Zero bordas arredondadas — `border-radius: 0` em tudo
- Sem gradientes decorativos (apenas o glow radial de fundo, que simula o smoke do logo)
- O glow verde de fundo usa `radial-gradient` + `filter: blur()` + animação `pulse`
- Botões primários em `#4a783a` com hover para `#5a8a4a` e box-shadow verde
- Todas as animações: `fadeUp`, `fadeIn`, `scaleIn`, `smokeIn`, `slideUp` — definidas no `<style>` global

---

## Estrutura da aplicação

```
App (root)
├── Landing          — página inicial com logo, bio, stats e CTA
├── ClientForm       — formulário 6 passos (nome → instagram → tel → objetivos → local → dificuldade)
│   └── [done]       — ecrã de confirmação pós-submissão
├── PinGate          — numpad de PIN para aceder ao editor (padrão: 1234)
└── Editor           — painel do personal trainer
    ├── [tab: clients] — lista de clientes + vista de detalhe
    └── [tab: profile] — edição do perfil + alteração de PIN
```

**Navegação:** controlada por `view` state no root (`landing` | `form` | `pin` | `editor`).  
Menu flutuante (botão `⋯` canto inferior direito) permite mudar entre modos.

---

## Persistência — localStorage

Três chaves:

```js
"ignite_clients_v1"  // array de clientes submetidos
"ignite_trainer_v1"  // objeto com dados do perfil do trainer
"ignite_pin_v1"      // string com o PIN de 4 dígitos (padrão: "1234")
```

**Estrutura de um cliente:**
```json
{
  "id": 1720000000000,
  "submittedAt": "2025-01-15T10:30:00.000Z",
  "firstName": "João",
  "lastName": "Silva",
  "instagram": "@joaosilva",
  "phone": "+351 912 000 000",
  "goals": ["a", "c", "e"],
  "location": "ginásio",
  "difficulty": "Falta de motivação e consistência..."
}
```

**IDs dos objetivos:**
```
a — Tonificar e ganhar força
b — Melhorar a confiança
c — Perder peso / eliminar gordura
d — Melhorar saúde e bem-estar
e — Criar consistência no treino
f — Aumentar massa muscular
```

---

## Componentes partilhados (internos)

| Componente | Função |
|---|---|
| `IgniteLogo` | Renderiza o logo IGNITE com Bebas Neue + sublabel verde |
| `GreenLine` | Linha horizontal com degradê `transparent → verde → transparent` |
| `SectionLabel` | Label uppercase em Barlow Condensed, cor verde claro |
| `Tag` | Pill com borda verde para mostrar objetivos |
| `IGInput` | Input estilizado dark com focus border verde |
| `IGTextarea` | Textarea estilizada dark |
| `PrimaryBtn` | Botão verde primário com hover glow |
| `GhostBtn` | Botão fantasma com opção `danger` (vermelho escuro) |

---

## Formulário — passos e validação

| Passo | Campo | Validação |
|---|---|---|
| 1 | `firstName` + `lastName` | Ambos não vazios |
| 2 | `instagram` | Não vazio (@ adicionado automaticamente) |
| 3 | `phone` | Não vazio |
| 4 | `goals[]` | Pelo menos 1 selecionado |
| 5 | `location` | Um dos 4 valores: `ginásio` / `casa` / `ambos` / `exterior` |
| 6 | `difficulty` | Não vazio |

---

## Como fazer deploy

### Vercel (recomendado)
```bash
npm create vite@latest ignite-app -- --template react
# substituir src/App.jsx pelo conteúdo do ficheiro .jsx
npm install
vercel deploy
```

### Netlify
```bash
# mesmo processo, depois:
netlify deploy --prod --dir=dist
```

O ficheiro `.jsx` é um componente React auto-contido. Precisa apenas de um `index.html` com o root div e o bundle Vite/CRA.

---

## O que fazer a seguir (backlog sugerido)

- [ ] **Backend / Cloud** — migrar de localStorage para Supabase (tabela `clients`, RLS por trainer)
- [ ] **Autenticação real** — substituir PIN simples por login com email/password
- [ ] **Notificações** — email automático ao trainer quando novo cliente submete
- [ ] **Foto de perfil** — upload de avatar para a landing page
- [ ] **Exportar clientes** — botão para exportar CSV/Excel no painel editor
- [ ] **Analytics** — quantos clientes por objetivo, por local de treino, etc.
- [ ] **Multilingue** — suporte EN/PT
- [ ] **PWA** — `manifest.json` + service worker para instalar no ecrã inicial do telemóvel

---

## Convenções de código

- Componentes em PascalCase, funções utilitárias em camelCase
- Tokens de cor e design definidos como constantes no topo do ficheiro (`const GREEN = "#4a783a"`)
- Estilos inline com objetos JS — sem ficheiros CSS externos
- Animações CSS injetadas via `document.createElement("style")` no topo do módulo
- Sem comentários desnecessários no código de produção
- Nomes de variáveis em inglês, texto da UI em português (PT)

---

## Contacto do projeto

- **Instagram:** [@_ignitecoaching_](https://www.instagram.com/_ignitecoaching_/)
- **Marca:** IGNITE Individual Coaching