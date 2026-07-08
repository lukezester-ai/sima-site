# AgriNexus Geo LLM настройки

Примерни променливи: [.env.example](./.env.example) (копирайте ръчно в `.env` или задайте в терминала).

Backend-ът вече не е вързан към един AI доставчик. Управлява се през environment променливи.

## Demo режим

Ако не зададете LLM настройки, Field Watch работи с локален fallback анализ.

```powershell
node server.js
```

## Z.AI (glm-5.1) — Field Watch и портален AI чат

След вход в портала: таб **„AI чат“** → `POST /api/chat` (същият LLM ключ).

OpenAI-съвместим endpoint: `POST https://api.z.ai/api/paas/v4/chat/completions`.

В `.env` или `.env.local` в корена на проекта:

```powershell
$env:LLM_PROVIDER="zai"
$env:ZAI_API_KEY="your_z_ai_key"
$env:LLM_MODEL="glm-5.1"
node server.js
```

Или само `ZAI_API_KEY` (без `LLM_PROVIDER`) — сървърът избира автоматично доставчик **zai**.

По подразбиране **без** `thinking` (по-бърз JSON доклад). За по-бавен „размисъл“: `LLM_THINKING=1`.

**RAG embeddings:** Z.AI ключът не се ползва за вектори. За семантично търсене задайте отделно напр. `MISTRAL_API_KEY` или `OPENAI_API_KEY` + `EMBEDDING_BASE_URL`, или оставете keyword-only RAG.

## Mistral AI

Официалният API е OpenAI-съвместим за **`/v1/chat/completions`** и **`/v1/embeddings`**.

Достатъчно е да зададете **`MISTRAL_API_KEY`** — ако няма `LLM_PROVIDER`, сървърът автоматично ползва доставчик **`mistral`** с база **`https://api.mistral.ai/v1`** и модел по подразбиране **`mistral-small-latest`**.

```powershell
$env:LLM_PROVIDER="mistral"
$env:MISTRAL_API_KEY="your_key"
$env:LLM_MODEL="mistral-small-latest"
node server.js
```

За **RAG embeddings** същият ключ се ползва по подразбиране; моделът е **`mistral-embed`**, освен ако не зададете `RAG_EMBEDDING_MODEL`. Можете да отделите само embeddings с `EMBEDDING_API_KEY` / `EMBEDDING_BASE_URL`.

JSON режим за отговора: заявката използва `response_format: json_object` (поддържа се от актуалните Mistral chat модели — при грешка пробвайте друг модел или премахнете ограничението в кода).

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
