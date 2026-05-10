# SIMA (уеб проект)

Маркетинг лендинг + Field Watch демо + фермерски портал с локален Node сървър и JSON „база“.

## Изисквания

- **Node.js 18+** (за вграден `fetch`)

## Стартиране

```powershell
cd <папка-на-проекта>
npm install
npm start
```

Отворете **http://localhost:3001** (или порт от променливата `PORT`).

Първо стартиране: ако няма `data/db.json`, сървърът го създава автоматично. За празна база от шаблон:

```powershell
npm run seed:db
```

## Лого

Изходен вектор: `assets/sima-logo.svg`. PNG за сайта:

```powershell
npm run build:logo
```

## LLM за Field Watch

Вижте **[LLM-CONFIG.md](./LLM-CONFIG.md)** (вкл. **Mistral**, OpenAI-съвместими, Ollama). Примерни променливи: **[.env.example](./.env.example)** (задайте ги в средата си — Node не зарежда `.env` автоматично без допълнителен пакет).

## RAG

Field Watch подава към LLM и **извлечени откъси** от индекс `ragChunks`. Индексирайте от портала (отметка „Индексирай за RAG“) или през `POST /api/rag/ingest`. За семантично търсене са нужни embeddings — виж секцията RAG в **LLM-CONFIG.md**.

## API за здраве проверки

`GET /api/health` → `{ "ok": true, "service": "sima-site" }`

## Git

`data/db.json` е в **`.gitignore`** — не качвайте реални потребители/сесии. Ползвайте `data/db.seed.json` като шаблон.
