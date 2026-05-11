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

Изходен вектор: `public/assets/sima-logo.svg`. PNG за сайта:

```powershell
npm run build:logo
```

## LLM за Field Watch

Вижте **[LLM-CONFIG.md](./LLM-CONFIG.md)** (вкл. **Mistral**, OpenAI-съвместими, Ollama). Примерни променливи: **[.env.example](./.env.example)**.

При локално стартиране сървърът зарежда автоматично `.env` и `.env.local` от корена на проекта. На Vercel използвайте Environment Variables в Dashboard.

## RAG

Field Watch подава към LLM и **извлечени откъси** от индекс `ragChunks`. Индексирайте от портала (отметка „Индексирай за RAG“) или през `POST /api/rag/ingest`. За семантично търсене са нужни embeddings — виж секцията RAG в **LLM-CONFIG.md**.

## Карта в портала

Картата в раздел „Полета“ → „Очертаване на граница“ ползва **MapLibre GL JS** (open source) и по подразбиране OSM tile сървър — **без ключ**, само за разработка. За production OSM е неподходящ заради [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/) — задайте свой провайдър през env (виж [.env.example](./.env.example)):

| Провайдър | Free план | Пример URL |
|---|---|---|
| MapTiler | 100k заявки/месец | `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=KEY` |
| Mapbox | 50k MAU | `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=TOKEN` |
| Stadia Maps | non-commercial безплатно | `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=KEY` |

API ключът отива в браузъра (стандартно за client-side карти) — заключете го по domain в dashboard-а на доставчика.

Ако зададете `MAP_SATELLITE_TILE_URL`, в toolbar-а на картата автоматично се появява бутон **„Сателит / Улици“**.

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

### Вариант C — Vercel

Статичните файлове са в **`public/`**. API маршрутите са под **`/api/*`** чрез **`api/[...slug].js`** (закачва се към логиката в **`server.js`**).

**Важно:** на Vercel няма постоянен локален диск като на VPS. **`data/` и `uploads/`** се насочват към **`/tmp`** — данните са **непостоянни** (изчезват при нов деплой / различни инстанции). За реален портал с регистрации и файлове ползвайте VPS или външна база/Blob.

В проекта в [**Vercel Dashboard**](https://vercel.com/new) импортирайте GitHub repo **`roxsonltd-droid/SIMA-site`**. В **Environment Variables** задайте поне **`PUBLIC_ORIGIN`** (публичен `https://…` без накраен `/`) и при нужда **`PUBLIC_HTTPS=1`**, както и ключовете за LLM/RAG от [.env.example](./.env.example).

Лимити за изпълнение на функции на безплатния план са къси — тежки LLM заявки може да изискват **Pro** или backend на VPS.

Локално **`npm start`** продължава да обслужва статиката от **`public/`** и базата от **`data/`**.
