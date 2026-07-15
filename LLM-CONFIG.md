# AgriNexus Geo LLM настройки

Примерни променливи: [.env.example](./.env.example) (копирайте ръчно в `.env` или задайте в терминала).

Backend-ът вече не е вързан към един AI доставчик. Управлява се през environment променливи.

## Demo режим

Ако не зададете LLM настройки, Field Watch работи с локален fallback анализ.

```powershell
node server.js
```

## Mistral AI (препоръка за SIMA — чат + Field Watch + RAG)

След вход в портала: таб **„AI чат“** → `POST /api/chat`.

Официалният API е OpenAI-съвместим за **`/v1/chat/completions`** и **`/v1/embeddings`**.

**Vercel (sima-site):** Settings → Environment Variables:

| Променлива | Стойност |
|------------|----------|
| `LLM_PROVIDER` | `mistral` |
| `MISTRAL_API_KEY` | ключ от [console.mistral.ai](https://console.mistral.ai) |
| `LLM_MODEL` | `mistral-small-latest` (по желание) |

Премахнете или изтрийте `ZAI_API_KEY` / `LLM_PROVIDER=zai`, за да не се ползва Z.AI. След промяната — **Redeploy** на Production.

Локално:

```powershell
$env:LLM_PROVIDER="mistral"
$env:MISTRAL_API_KEY="your_key"
$env:LLM_MODEL="mistral-small-latest"
node server.js
```

Ако има само `MISTRAL_API_KEY` (без `LLM_PROVIDER`), сървърът избира автоматично **mistral**. При `LLM_PROVIDER=mistral` се ползва само Mistral ключът (не Z.AI, дори ако `ZAI_API_KEY` още е в `.env`).

За **RAG embeddings** същият ключ; модел **`mistral-embed`** (или `RAG_EMBEDDING_MODEL`).

## Z.AI (glm-5.1) — по избор

OpenAI-съвместим endpoint: `POST https://api.z.ai/api/paas/v4/chat/completions`. Изисква **отделен API баланс** (не GLM Coding Lite).

```powershell
$env:LLM_PROVIDER="zai"
$env:ZAI_API_KEY="your_z_ai_key"
$env:LLM_MODEL="glm-5.1"
node server.js
```

**RAG embeddings:** Z.AI не дава embeddings в този стек — за RAG добавете `MISTRAL_API_KEY` или keyword-only режим.

## OpenAI-compatible доставчик

Подходящо за OpenAI-compatible endpoints като OpenRouter, Groq, Together, Mistral-compatible gateway или собствен proxy.

```powershell
$env:LLM_PROVIDER="openai-compatible"
$env:LLM_BASE_URL="https://api.openai.com/v1"
$env:LLM_API_KEY="your_api_key"
$env:LLM_MODEL="gpt-5.4-mini"
node server.js
```

За OpenRouter пример:

```powershell
$env:LLM_PROVIDER="openai-compatible"
$env:LLM_BASE_URL="https://openrouter.ai/api/v1"
$env:LLM_API_KEY="your_openrouter_key"
$env:LLM_MODEL="anthropic/claude-3.5-sonnet"
node server.js
```

## Ollama локално

Подходящо ако искате локален LLM без външен API.

```powershell
$env:LLM_PROVIDER="ollama"
$env:LLM_BASE_URL="http://127.0.0.1:11434"
$env:LLM_MODEL="llama3.2"
node server.js
```

Забележка: локалният Ollama режим в този прототип анализира текстовото описание и метаданните. Vision анализът на изображения е най-добре да се включи през LLM доставчик, който поддържа image input, или чрез отделен vision модел.

## RAG (Retrieval-Augmented Generation)

Преди повикването към LLM за Field Watch сървърът **извлича откъси** от локалния индекс `ragChunks` в `data/db.json` и ги добавя в системната подкана.

### Индексиране

1. В портала → **База знания** включете **„Индексирай за RAG“** при добавяне на текст или URL.
2. Или изпратете `POST /api/rag/ingest` с JSON: `{ "title": "...", "text": "..." }` или `{ "title": "...", "url": "https://..." }` (изисква вход).

Текстът се разбива на фрагменти (~900 знака). Ако има API ключ за embeddings, към всеки фрагмент се записва вектор за семантично търсене.

### Embeddings API

Използва се **OpenAI-съвместим** endpoint `POST .../embeddings` (**OpenAI**, **Mistral** (`mistral-embed`), много gateway-и).

По подразбиране се ползват същите ключ и базов URL като за чат (`LLM_API_KEY` / `MISTRAL_API_KEY`, `LLM_BASE_URL`), освен ако зададете отделно:

- `EMBEDDING_API_KEY`
- `EMBEDDING_BASE_URL`
- `RAG_EMBEDDING_MODEL` (напр. `text-embedding-3-small` или `mistral-embed`)

### Без embeddings ключ

Индексът пак работи: извличането е по **ключови думи** от описанието на полето (по-слабо от семантично).

### Статус

`GET /api/rag/status` (с Bearer token): брой фрагменти, колко имат embeddings, дали семантичното извличане е активно.
