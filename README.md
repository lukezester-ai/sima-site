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

## Деплой на сървър

Приложението е един Node процес (`server.js`), статичните файлове се обслужват от него. На продукция най-често стои зад **nginx** (HTTPS) или облачен балансьор.

### Вариант A — Docker Compose

На сървъра (с инсталиран Docker):

```bash
git clone https://github.com/roxsonltd-droid/SIMA-site.git
cd SIMA-site
docker compose up -d --build
```

По подразбиране: **http://СЪРВЪР:3001**. Данните са в именувани volume-и (`data`, `uploads`). За LLM/RAG задайте променливи в `docker-compose.yml` или чрез `environment`/dotenv според вашата среда.

Празна база от семето (ако искате копие от `db.seed.json` преди първи старт в постоянен volume):

```bash
docker compose run --rm sima-site node scripts/copy-seed-db.mjs
```

*(Използвайте `--force` за презапис само ако знаете какво правите.)*

### Вариант B — само Node (препоръчително за VPS)

Нужен е **Node.js 18+** (`node -v`).

```bash
git clone https://github.com/roxsonltd-droid/SIMA-site.git
cd SIMA-site
npm ci --omit=dev
```

По желание празна база от семето:

```bash
npm run seed:db
```

Старт на преден план (тест):

```bash
export NODE_ENV=production
export PORT=3001
export PUBLIC_HTTPS=1
export PUBLIC_ORIGIN=https://вашият-домейн.example
node server.js
```

Слуша на **`http://0.0.0.0:3001`** (отвън достъпно като `http://IP:3001`, освен ако firewall блокира).

#### PM2 (рестарт при падане, логове)

```bash
npm install -g pm2
# Редактирайте PUBLIC_* в ecosystem.config.cjs при нужда
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup   # показва команда за systemd hook — изпълнете я веднъж
```

#### systemd (без PM2)

Примерен unit файл: **[deploy/sima-site.service.example](./deploy/sima-site.service.example)** — настройте `User`, `WorkingDirectory` и `Environment` според сървъра, после:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sima-site
```

### nginx + HTTPS

Пример за proxy към порт 3001: **[deploy/nginx-sima.example.conf](./deploy/nginx-sima.example.conf)**. Задали ли сте reverse proxy, задайте **`PUBLIC_HTTPS=1`** и **`PUBLIC_ORIGIN`** според публичния URL (виж [.env.example](./.env.example)).
