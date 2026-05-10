const form = document.querySelector("#contact-form");
const advisorForm = document.querySelector("#advisor-form");
const advisorTitle = document.querySelector("#advisor-title");
const advisorText = document.querySelector("#advisor-text");
const advisorTag = document.querySelector("#advisor-tag");
const fieldWatchForm = document.querySelector("#field-watch-form");
const strategyTitle = document.querySelector("#strategy-title");
const strategyOutput = document.querySelector("#strategy-output");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history");
const reportPreview = document.querySelector("#report-preview");
const reportTitle = document.querySelector("#report-title");
const reportState = document.querySelector("#report-state");
const reportPriority = document.querySelector("#report-priority");
const reportActions = document.querySelector("#report-actions");
const reportMonitoring = document.querySelector("#report-monitoring");
const copyReportButton = document.querySelector("#copy-report");
const printReportButton = document.querySelector("#print-report");
const feedbackForm = document.querySelector("#feedback-form");
const feedbackStatus = document.querySelector("#feedback-status");
const portalTabs = document.querySelectorAll(".portal-tab");
const portalPanels = document.querySelectorAll(".portal-panel");
const portalDate = document.querySelector("#portal-date");
const portalFieldForm = document.querySelector("#portal-field-form");
const portalFieldsList = document.querySelector("#portal-fields-list");
const portalReportsList = document.querySelector("#portal-reports-list");
const portalTasksList = document.querySelector("#portal-tasks-list");
const teamQueue = document.querySelector("#team-queue");
const metricFields = document.querySelector("#metric-fields");
const metricReports = document.querySelector("#metric-reports");
const metricRisks = document.querySelector("#metric-risks");
const portalBrief = document.querySelector("#portal-brief");
const knowledgeForm = document.querySelector("#knowledge-form");
const knowledgeList = document.querySelector("#knowledge-list");
const weatherForm = document.querySelector("#weather-form");
const weatherResult = document.querySelector("#weather-result");
const boundaryMap = document.querySelector("#field-boundary-map");
const mapHelper = document.querySelector("#map-helper");
const undoMapPointButton = document.querySelector("#undo-map-point");
const clearMapPointsButton = document.querySelector("#clear-map-points");
const copyGeojsonButton = document.querySelector("#copy-geojson");
const fieldProfile = document.querySelector("#field-profile");
const fieldProfileTitle = document.querySelector("#field-profile-title");
const fieldProfileCrop = document.querySelector("#field-profile-crop");
const fieldProfileArea = document.querySelector("#field-profile-area");
const fieldProfileReports = document.querySelector("#field-profile-reports");
const fieldProfileTasks = document.querySelector("#field-profile-tasks");
const fieldProfileHistory = document.querySelector("#field-profile-history");
const authForm = document.querySelector("#auth-form");
const authStatus = document.querySelector("#auth-status");
const authHelper = document.querySelector("#auth-helper");
const logoutButton = document.querySelector("#logout-button");

/** Единствен публичен контакт (съвпада с privacy/footer/mailto fallback). */
const SIMA_CONTACT_EMAIL = "info@agrinexus.eu";

const historyKey = "sima-field-watch-history";
const fieldsKey = "sima-portal-fields";
const knowledgeKey = "sima-knowledge";
const tokenKey = "sima-api-token";
let currentReportText = "";
let currentReportId = "";
/** Върхове на границата в WGS84 [lng, lat], добавят се с клик по картата */
let boundaryLngLatVertices = [];
let boundaryMapInstance = null;
let boundaryMapReady = false;
let authAction = "login";
const appState = {
  fields: null,
  reports: null,
  knowledge: null,
  tasks: null,
  user: null,
};

function uiLang() {
  return window.SIMA_I18N?.getLang?.() || "bg";
}

function localeTag() {
  return uiLang() === "en" ? "en-US" : "bg-BG";
}

function J() {
  return window.SIMA_I18N.JS[uiLang()] || window.SIMA_I18N.JS.bg;
}

function updateAdvisor() {
  if (!advisorForm || !advisorTitle || !advisorText || !advisorTag) return;

  const data = new FormData(advisorForm);
  const pain = data.get("pain")?.toString() || "fields";
  const goal = data.get("goal")?.toString() || "clarity";
  const scale = data.get("scale")?.toString() || "small";
  const rec = J().recommendations[pain] || J().recommendations.fields;
  const notes = J().advisorNotes;

  let scaleNote = notes.scale_small;
  if (scale === "medium") scaleNote = notes.scale_medium;
  if (scale === "large") scaleNote = notes.scale_large;

  let goalNote = notes.goal_clarity;
  if (goal === "savings") goalNote = notes.goal_savings;
  if (goal === "control") goalNote = notes.goal_control;

  advisorTitle.textContent = rec.title;
  advisorTag.textContent = rec.tag;
  advisorText.textContent = `${rec.text} ${scaleNote} ${goalNote}`;
}

advisorForm?.addEventListener("change", updateAdvisor);
updateAdvisor();

function loadHistory() {
  if (appState.reports) return appState.reports;
  try {
    return JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(items) {
  if (appState.reports) {
    appState.reports = items.slice(0, 12);
    return;
  }
  localStorage.setItem(historyKey, JSON.stringify(items.slice(0, 12)));
}

function loadFields() {
  if (appState.fields) return appState.fields;
  try {
    return JSON.parse(localStorage.getItem(fieldsKey) || "[]");
  } catch {
    return [];
  }
}

function saveFields(items) {
  if (appState.fields) {
    appState.fields = items;
    return;
  }
  localStorage.setItem(fieldsKey, JSON.stringify(items));
}

function loadKnowledge() {
  if (appState.knowledge) return appState.knowledge;
  try {
    return JSON.parse(localStorage.getItem(knowledgeKey) || "[]");
  } catch {
    return [];
  }
}

function loadTasks() {
  if (appState.tasks) return appState.tasks;
  return loadHistory().flatMap((report) =>
    (report.tasks || report.actions?.map((action, index) => ({
      id: `${report.id || "local"}-${index}`,
      reportId: report.id,
      fieldName: report.fieldName,
      title: action,
      status: "open",
    })) || [])
  );
}

function saveTasks(items) {
  if (appState.tasks) {
    appState.tasks = items;
  }
}

function saveKnowledge(items) {
  if (appState.knowledge) {
    appState.knowledge = items;
    return;
  }
  localStorage.setItem(knowledgeKey, JSON.stringify(items));
}

function updateLocalReport(report) {
  if (appState.reports) {
    appState.reports = appState.reports.map((item) => (item.id === report.id ? report : item));
  } else {
    localStorage.setItem(
      historyKey,
      JSON.stringify(loadHistory().map((item) => (item.id === report.id ? report : item)))
    );
  }
}

function getToken() {
  return localStorage.getItem(tokenKey) || "";
}

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || J().api_error);
  return data;
}

function setAuthMessage(message) {
  if (authHelper) authHelper.textContent = message;
}

function updateAuthUi() {
  const loggedIn = Boolean(appState.user);
  const I = window.SIMA_I18N;
  if (authStatus) {
    authStatus.textContent = loggedIn ? J().auth_logged_in(appState.user.name) : I.t("auth_local");
  }
  if (authHelper) {
    authHelper.textContent = loggedIn ? I.t("auth_logged_helper") : I.t("auth_helper");
  }
  if (authForm) authForm.hidden = loggedIn;
  if (logoutButton) logoutButton.hidden = !loggedIn;
}

async function refreshBackendData() {
  if (!getToken()) {
    appState.fields = null;
    appState.reports = null;
    appState.knowledge = null;
    appState.tasks = null;
    appState.user = null;
    const ragOff = document.querySelector("#rag-status-line");
    if (ragOff) ragOff.textContent = "";
    updateAuthUi();
    renderHistory();
    renderPortal();
    return;
  }

  try {
    const [me, fieldsResult, reportsResult, tasksResult] = await Promise.all([
      apiFetch("/api/me"),
      apiFetch("/api/fields"),
      apiFetch("/api/reports"),
      apiFetch("/api/tasks"),
    ]);
    const knowledgeResult = await apiFetch("/api/knowledge");
    appState.user = me.user;
    appState.fields = fieldsResult.fields;
    appState.reports = reportsResult.reports;
    appState.tasks = tasksResult.tasks;
    appState.knowledge = knowledgeResult.knowledge;

    const ragLine = document.querySelector("#rag-status-line");
    if (ragLine) {
      try {
        const st = await apiFetch("/api/rag/status");
        ragLine.textContent = J().rag_line(st.chunksTotal, st.chunksEmbedded, st.retrievalEnabled);
      } catch {
        ragLine.textContent = "";
      }
    }
  } catch (error) {
    localStorage.removeItem(tokenKey);
    appState.fields = null;
    appState.reports = null;
    appState.knowledge = null;
    appState.tasks = null;
    appState.user = null;
    setAuthMessage(error.message);
  }

  updateAuthUi();
  renderHistory();
  renderPortal();

  const ragLine = document.querySelector("#rag-status-line");
  if (ragLine && !getToken()) ragLine.textContent = "";
}

function buildReportText(report) {
  const L = J();
  return [
    L.report_header,
    `${L.report_field} ${report.fieldName}`,
    `${L.report_area} ${report.area}`,
    `${L.report_crop} ${report.crop}`,
    `${L.report_stage} ${report.stage}`,
    `${L.report_date} ${report.date}`,
    ``,
    `${L.report_state} ${report.state}`,
    `${L.report_priority} ${report.priority}`,
    L.report_actions_h,
    ...report.actions.map((action) => `- ${action}`),
    `${L.report_monitor} ${report.monitoring}`,
    report.rag ? L.report_rag_line(report.rag.mode, report.rag.snippets) : "",
    report.notes ? `${L.report_notes} ${report.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function boundaryToGeoJson() {
  if (boundaryLngLatVertices.length < 3) return null;
  const coordinates = boundaryLngLatVertices.map(([lng, lat]) => [
    Number(lng.toFixed(6)),
    Number(lat.toFixed(6)),
  ]);
  coordinates.push(coordinates[0]);
  return {
    type: "Feature",
    properties: {
      source: "SIMA field boundary map",
      coordinateSystem: "EPSG:4326",
    },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };
}

function buildBoundaryFeatureCollection() {
  const verts = boundaryLngLatVertices;
  const features = [];

  if (verts.length >= 1) {
    features.push({
      type: "Feature",
      properties: { kind: "markers" },
      geometry: { type: "MultiPoint", coordinates: verts },
    });
  }
  if (verts.length >= 2) {
    features.push({
      type: "Feature",
      properties: { kind: "line" },
      geometry: { type: "LineString", coordinates: verts },
    });
    if (verts.length >= 3) {
      features.push({
        type: "Feature",
        properties: { kind: "close-dash" },
        geometry: { type: "LineString", coordinates: [verts[verts.length - 1], verts[0]] },
      });
      features.push({
        type: "Feature",
        properties: { kind: "fill" },
        geometry: {
          type: "Polygon",
          coordinates: [[...verts, verts[0]]],
        },
      });
    }
  }

  return { type: "FeatureCollection", features };
}

function updateBoundaryMapSource() {
  if (!boundaryMapInstance || !boundaryMapReady) return;
  const src = boundaryMapInstance.getSource("boundary-draw");
  if (!src || typeof src.setData !== "function") return;
  src.setData(buildBoundaryFeatureCollection());
}

function resizeBoundaryMap() {
  try {
    boundaryMapInstance?.resize();
  } catch {
    /* noop */
  }
}

function initBoundaryMapLibre() {
  if (!boundaryMap || boundaryMap.dataset.boundaryMapInit === "1") return;
  if (typeof maplibregl === "undefined") return;

  boundaryMap.dataset.boundaryMapInit = "1";

  const osmStyle = {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [{ id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }],
  };

  boundaryMapInstance = new maplibregl.Map({
    container: boundaryMap,
    style: osmStyle,
    center: [24.7489, 42.1354],
    zoom: 7,
    maxZoom: 18,
  });

  boundaryMapInstance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  boundaryMapInstance.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
  boundaryMapInstance.doubleClickZoom.disable();

  boundaryMapInstance.on("load", () => {
    boundaryMapInstance.addSource("boundary-draw", {
      type: "geojson",
      data: buildBoundaryFeatureCollection(),
    });

    boundaryMapInstance.addLayer({
      id: "boundary-draw-fill",
      type: "fill",
      source: "boundary-draw",
      filter: ["==", ["get", "kind"], "fill"],
      paint: {
        "fill-color": "#e4aa28",
        "fill-opacity": 0.28,
      },
    });
    boundaryMapInstance.addLayer({
      id: "boundary-draw-dash",
      type: "line",
      source: "boundary-draw",
      filter: ["==", ["get", "kind"], "close-dash"],
      paint: {
        "line-color": "#d99a18",
        "line-width": 3,
        "line-dasharray": [2, 2],
      },
    });
    boundaryMapInstance.addLayer({
      id: "boundary-draw-line",
      type: "line",
      source: "boundary-draw",
      filter: ["==", ["get", "kind"], "line"],
      paint: {
        "line-color": "#063d2a",
        "line-width": 3,
      },
    });
    boundaryMapInstance.addLayer({
      id: "boundary-draw-verts",
      type: "circle",
      source: "boundary-draw",
      filter: ["==", ["get", "kind"], "markers"],
      paint: {
        "circle-radius": 7,
        "circle-color": "#e4aa28",
        "circle-stroke-width": 3,
        "circle-stroke-color": "#063d2a",
      },
    });

    boundaryMapReady = true;
    updateBoundaryMapSource();
    renderBoundaryMap();
  });

  boundaryMapInstance.on("click", (e) => {
    if (e.originalEvent.detail !== 1) return;
    boundaryLngLatVertices.push([e.lngLat.lng, e.lngLat.lat]);
    renderBoundaryMap();
  });

  window.addEventListener("resize", resizeBoundaryMap);
}

function renderBoundaryMap() {
  updateBoundaryMapSource();
  if (!mapHelper) return;
  const geoJson = boundaryToGeoJson();
  if (geoJson) {
    mapHelper.textContent = J().map_done(boundaryLngLatVertices.length);
  } else {
    mapHelper.textContent = J().map_need(Math.max(0, 3 - boundaryLngLatVertices.length));
  }
}

function clearBoundaryMap() {
  boundaryLngLatVertices = [];
  renderBoundaryMap();
}

function showReport(report) {
  if (!reportPreview || !reportTitle || !reportState || !reportPriority || !reportActions || !reportMonitoring) return;

  reportPreview.hidden = false;
  currentReportId = report.id || "";
  reportTitle.textContent = `${report.fieldName} - ${report.date}`;
  reportState.textContent = report.state;
  reportPriority.textContent = report.priority;
  reportMonitoring.textContent = report.monitoring;
  reportActions.innerHTML = report.actions.map((action) => `<li>${action}</li>`).join("");
  currentReportText = buildReportText(report);
  if (feedbackForm) {
    feedbackForm.reset();
    feedbackForm.elements.helped.checked = true;
    if (report.feedback) {
      feedbackForm.elements.rating.value = String(report.feedback.rating || 5);
      feedbackForm.elements.helped.checked = Boolean(report.feedback.helped);
      feedbackForm.elements.outcome.value = report.feedback.outcome || "";
      feedbackForm.elements.correction.value = report.feedback.correction || "";
    }
  }
  if (feedbackStatus) {
    feedbackStatus.textContent = report.feedback ? J().feedback_exists : "";
  }
}

function renderHistory() {
  if (!historyList) return;

  const items = loadHistory();
  if (!items.length) {
    historyList.innerHTML = `<p class="empty-history">${escapeHtml(
      window.SIMA_I18N.t("fw_empty_hist")
    )}</p>`;
    return;
  }

  historyList.innerHTML = items
    .map(
      (item) => `
        <button class="history-item" type="button" data-report-id="${item.id}">
          <strong>${escapeHtml(item.fieldName)}</strong>
          <span>${escapeHtml(item.date)} | ${escapeHtml(item.crop)} | ${escapeHtml(item.priority)}</span>
        </button>
      `
    )
    .join("");
}

function renderPortal() {
  const L = J();
  const fields = loadFields();
  const reports = loadHistory();
  const knowledge = loadKnowledge();
  const tasks = loadTasks();
  const risks = reports.filter((report) =>
    /риск|стрес|болест|дефицит|risk|stress|disease|deficit|pest/i.test(report.priority)
  ).length;

  if (portalDate) {
    portalDate.textContent = new Date().toLocaleDateString(localeTag(), {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (metricFields) metricFields.textContent = fields.length;
  if (metricReports) metricReports.textContent = reports.length;
  if (metricRisks) metricRisks.textContent = risks;

  if (portalBrief) {
    if (!fields.length) {
      portalBrief.textContent = L.portal_brief_0;
    } else if (!reports.length) {
      portalBrief.textContent = L.portal_brief_1;
    } else {
      portalBrief.textContent = L.portal_brief_n(fields.length, reports.length);
    }
  }

  if (portalFieldsList) {
    portalFieldsList.innerHTML = fields.length
      ? fields
          .map(
            (field) => `
              <article class="portal-card" data-field-id="${escapeHtml(field.id)}">
                <span>${field.boundary ? L.field_with_map : L.field_plain}</span>
                <h4>${escapeHtml(field.name)}</h4>
                <p>${escapeHtml(field.area)} | ${escapeHtml(field.crop)}</p>
                <p>${
                  field.boundary
                    ? L.boundary_pts(field.boundary.geometry.coordinates[0].length - 1)
                    : L.boundary_none
                }</p>
                <button type="button" data-open-field-profile="${escapeHtml(field.id)}">${escapeHtml(
              L.profile_btn
            )}</button>
              </article>
            `
          )
          .join("")
      : `<p class="empty-portal">${escapeHtml(L.empty_fields)}</p>`;
  }

  if (portalReportsList) {
    const statusLabels = L.statusLabels;
    const expertFallback = statusLabels.expert_review;
    portalReportsList.innerHTML = reports.length
      ? reports
          .map(
            (report) => `
              <article class="portal-card" data-report-id="${escapeHtml(report.id)}">
                <span>${escapeHtml(
                  statusLabels[report.status] || report.status || expertFallback
                )} | ${escapeHtml(report.date)}</span>
                <h4>${escapeHtml(report.fieldName)}</h4>
                <p>${escapeHtml(report.priority)}</p>
                <p>${
                  report.feedback
                    ? escapeHtml(L.rating_abbr(String(report.feedback.rating)))
                    : escapeHtml(L.no_feedback_yet)
                }</p>
                <select class="status-select" data-report-status="${escapeHtml(report.id)}">
                  ${Object.entries(statusLabels)
                    .map(
                      ([value, label]) =>
                        `<option value="${value}" ${
                          value === (report.status || "expert_review") ? "selected" : ""
                        }>${escapeHtml(label)}</option>`
                    )
                    .join("")}
                </select>
              </article>
            `
          )
          .join("")
      : `<p class="empty-portal">${escapeHtml(L.empty_reports)}</p>`;
  }

  if (portalTasksList) {
    portalTasksList.innerHTML = tasks.length
      ? tasks
          .map(
            (task) => `
              <article class="portal-card">
                <span>${task.status === "done" ? L.task_done : L.task_open} | ${escapeHtml(
              task.fieldName || L.task_field
            )}</span>
                <h4>${escapeHtml(task.title)}</h4>
                <button class="task-toggle" type="button" data-task-id="${escapeHtml(task.id)}" data-next-status="${
              task.status === "done" ? "open" : "done"
            }">
                  ${task.status === "done" ? L.task_reopen : L.task_mark_done}
                </button>
              </article>
            `
          )
          .join("")
      : `<p class="empty-portal">${escapeHtml(L.empty_tasks)}</p>`;
  }

  if (teamQueue) {
    teamQueue.innerHTML = reports.length
      ? reports
          .map(
            (report) => `
              <article class="queue-card">
                <span>${escapeHtml(L.queue_wait)}</span>
                <h4>${escapeHtml(report.fieldName)}</h4>
                <p>${escapeHtml(L.queue_note(report.priority))}</p>
              </article>
            `
          )
          .join("")
      : `<p class="empty-portal">${escapeHtml(L.empty_team)}</p>`;
  }

  if (knowledgeList) {
    knowledgeList.innerHTML = knowledge.length
      ? knowledge
          .map(
            (item) => `
              <article class="portal-card">
                <span>${escapeHtml(item.source || "knowledge")}</span>
                <h4>${escapeHtml(item.title || L.knowledge_default)}</h4>
                <p>${escapeHtml((item.text || "").slice(0, 220))}${item.text?.length > 220 ? "..." : ""}</p>
              </article>
            `
          )
          .join("")
      : `<p class="empty-portal">${escapeHtml(L.empty_knowledge)}</p>`;
  }
}

function showFieldProfile(fieldId) {
  const field = loadFields().find((item) => item.id === fieldId);
  if (!field || !fieldProfile) return;

  const reports = loadHistory().filter((report) => report.fieldName === field.name);
  const tasks = loadTasks().filter((task) => task.fieldName === field.name);
  fieldProfile.hidden = false;
  fieldProfileTitle.textContent = field.name;
  fieldProfileCrop.textContent = field.crop;
  fieldProfileArea.textContent = field.area;
  fieldProfileReports.textContent = String(reports.length);
  fieldProfileTasks.textContent = String(tasks.filter((task) => task.status !== "done").length);
  const L = J();
  const sl = L.statusLabels;
  const expertFallback = sl.expert_review;
  fieldProfileHistory.innerHTML = reports.length
    ? reports
        .map(
          (report) => `
            <article class="portal-card">
              <span>${escapeHtml(sl[report.status] || report.status || expertFallback)}</span>
              <h4>${escapeHtml(report.date)}</h4>
              <p>${escapeHtml(report.priority)}</p>
            </article>
          `
        )
        .join("")
    : `<p class="empty-portal">${escapeHtml(L.empty_field_reports)}</p>`;
}

function renderStrategy(event) {
  event.preventDefault();
  if (!fieldWatchForm || !strategyTitle || !strategyOutput) return;

  const data = new FormData(fieldWatchForm);
  if (getToken()) {
    renderBackendStrategy(data);
    return;
  }

  const L = J();
  const fieldName = data.get("fieldName")?.toString().trim() || L.unnamed_field;
  const area = data.get("area")?.toString().trim() || L.area_unknown;
  const cropKey = data.get("crop")?.toString();
  const crop = L.cropLabels[cropKey] || L.crop_generic;
  const concern = data.get("concern")?.toString() || "unknown";
  const stageKey = data.get("stage")?.toString();
  const stage = L.stageLabels[stageKey] || L.stage_fallback;
  const notes = data.get("notes")?.toString().trim();
  const files = fieldWatchForm.querySelector('input[type="file"]')?.files?.length || 0;
  const concerns = L.concernStrategies;
  const strategy = concerns[concern] || concerns.unknown;
  const date = new Date().toLocaleDateString(localeTag());

  const report = {
    id: `${Date.now()}`,
    date,
    fieldName,
    area,
    crop,
    stage,
    files,
    notes,
    state: L.local_report_state(fieldName, area, stage, files),
    priority: strategy.priority,
    actions: [...strategy.checks, L.strategy_extra_1, L.strategy_extra_2],
    monitoring: strategy.monitoring,
    status: "expert_review",
  };
  report.tasks = report.actions.map((action, index) => ({
    id: `${report.id}-task-${index}`,
    reportId: report.id,
    fieldName: report.fieldName,
    title: action,
    status: "open",
  }));

  strategyTitle.textContent = strategy.title;
  const safeFieldName = escapeHtml(report.fieldName);
  const safeCrop = escapeHtml(report.crop);
  const safeStage = escapeHtml(report.stage);
  const safeNotes = notes ? escapeHtml(notes) : "";
  strategyOutput.innerHTML = `
    <p><strong>${escapeHtml(L.strategy_field)}</strong> ${safeFieldName}. <strong>${escapeHtml(
    L.strategy_crop
  )}</strong> ${safeCrop}. <strong>${escapeHtml(L.strategy_stage)}</strong> ${safeStage}.</p>
    <p>${escapeHtml(report.priority)}</p>
    <ul>
      ${report.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
    ${
      notes
        ? `<p><strong>${escapeHtml(L.farmer_note)}</strong> ${safeNotes}</p>`
        : `<p><strong>${escapeHtml(L.tip_note)}</strong> ${escapeHtml(L.tip_text)}</p>`
    }
  `;

  const history = loadHistory();
  saveHistory([report, ...history]);
  renderHistory();
  showReport(report);
  renderPortal();
}

fieldWatchForm?.addEventListener("submit", renderStrategy);

async function renderBackendStrategy(data) {
  const L = J();
  const cropValue = data.get("crop")?.toString() || "";
  const stageValue = data.get("stage")?.toString() || "";
  data.set("crop", L.cropLabels[cropValue] || cropValue || L.crop_default_capital);
  data.set("stage", L.stageLabels[stageValue] || stageValue || L.stage_fallback);

  strategyTitle.textContent = L.processing;
  strategyOutput.innerHTML = `<p>${escapeHtml(L.processing_p)}</p>`;

  try {
    const { report } = await apiFetch("/api/field-watch/analyze", {
      method: "POST",
      body: data,
    });
    appState.reports = [report, ...(appState.reports || [])];
    appState.tasks = [...(report.tasks || []), ...(appState.tasks || [])];
    const isLlmMode = report.aiMode?.startsWith("llm:");
    strategyTitle.textContent = isLlmMode ? L.llm_title : L.demo_title;
    strategyOutput.innerHTML = `
      <p><strong>${escapeHtml(L.strategy_field)}</strong> ${escapeHtml(report.fieldName)}. <strong>${escapeHtml(
      L.strategy_crop
    )}</strong> ${escapeHtml(report.crop)}.</p>
      <p>${escapeHtml(report.priority)}</p>
      <ul>${report.actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      <p><strong>${escapeHtml(L.mode_label)}</strong> ${
      isLlmMode ? escapeHtml(report.aiMode) : escapeHtml(L.demo_mode_label)
    }</p>
      <p><strong>${escapeHtml(L.rag_label_short)}</strong> ${escapeHtml(report.rag?.mode || "—")} · ${escapeHtml(
      String(report.rag?.snippets ?? 0)
    )} ${escapeHtml(L.rag_mode_label)}</p>
    `;
    showReport(report);
    renderHistory();
    renderPortal();
    await refreshBackendData();
  } catch (error) {
    strategyTitle.textContent = L.analysis_fail;
    strategyOutput.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

historyList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-report-id]");
  if (!button) return;

  const report = loadHistory().find((item) => item.id === button.dataset.reportId);
  if (report) showReport(report);
});

clearHistoryButton?.addEventListener("click", () => {
  if (getToken()) {
    setAuthMessage(J().backend_clear_hist);
    return;
  }
  saveHistory([]);
  currentReportText = "";
  if (reportPreview) reportPreview.hidden = true;
  renderHistory();
  renderPortal();
});

copyReportButton?.addEventListener("click", async () => {
  if (!currentReportText) return;
  const L = J();
  try {
    await navigator.clipboard.writeText(currentReportText);
    copyReportButton.textContent = L.copy_done;
  } catch {
    copyReportButton.textContent = L.copy_fallback;
  }
  setTimeout(() => {
    copyReportButton.textContent = J().copy_default;
  }, 1400);
});

printReportButton?.addEventListener("click", () => {
  if (!currentReportId) return;
  window.print();
});

feedbackForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentReportId) return;

  const data = new FormData(feedbackForm);
  const feedback = {
    id: `${Date.now()}`,
    reportId: currentReportId,
    rating: Number(data.get("rating") || 5),
    helped: data.get("helped") === "on",
    outcome: data.get("outcome")?.toString().trim() || "",
    correction: data.get("correction")?.toString().trim() || "",
    createdAt: new Date().toISOString(),
  };

  try {
    if (getToken()) {
      const result = await apiFetch(`/api/reports/${currentReportId}/feedback`, {
        method: "POST",
        body: JSON.stringify(feedback),
      });
      const updatedReport = result.report;
      appState.reports = (appState.reports || []).map((item) =>
        item.id === updatedReport.id ? updatedReport : item
      );
      appState.knowledge = null;
      showReport(updatedReport);
      await refreshBackendData();
    } else {
      const report = loadHistory().find((item) => item.id === currentReportId);
      if (!report) throw new Error(J().report_not_found);
      const updatedReport = { ...report, feedback };
      const Lj = J();
      updateLocalReport(updatedReport);
      saveKnowledge([
        {
          id: `${Date.now()}-feedback`,
          title: Lj.feedback_kb_title(updatedReport.fieldName),
          source: `feedback:${feedback.id}`,
          text: Lj.feedback_kb_text(
            feedback.rating,
            feedback.helped,
            feedback.outcome,
            feedback.correction
          ),
          createdAt: new Date().toISOString(),
        },
        ...loadKnowledge(),
      ]);
      showReport(updatedReport);
    }
    renderHistory();
    renderPortal();
    if (feedbackStatus) feedbackStatus.textContent = J().feedback_saved;
  } catch (error) {
    if (feedbackStatus) feedbackStatus.textContent = error.message;
  }
});

renderHistory();
renderPortal();

portalTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.portalTab;

    portalTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    portalPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.portalPanel === target);
    });
    if (target === "fields") {
      requestAnimationFrame(() => resizeBoundaryMap());
    }
  });
});

portalFieldForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(portalFieldForm);
  const Lpf = J();
  const name = data.get("name")?.toString().trim() || Lpf.unnamed_field;
  const area = data.get("area")?.toString().trim() || Lpf.area_unknown;
  const crop = data.get("crop")?.toString() || Lpf.crop_default_capital;
  const boundary = boundaryToGeoJson();

  try {
    if (getToken()) {
      const { field } = await apiFetch("/api/fields", {
        method: "POST",
        body: JSON.stringify({ name, area, crop, boundary }),
      });
      appState.fields = [field, ...(appState.fields || [])];
    } else {
      saveFields([{ id: `${Date.now()}`, name, area, crop, boundary }, ...loadFields()]);
    }
    portalFieldForm.reset();
    clearBoundaryMap();
    renderPortal();
  } catch (error) {
    setAuthMessage(error.message);
  }
});

portalFieldsList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-field-profile]");
  if (!button) return;
  showFieldProfile(button.dataset.openFieldProfile);
});

portalReportsList?.addEventListener("change", async (event) => {
  const select = event.target.closest("[data-report-status]");
  if (!select) return;

  const reportId = select.dataset.reportStatus;
  const status = select.value;
  try {
    if (getToken()) {
      const { report } = await apiFetch(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      appState.reports = (appState.reports || []).map((item) => (item.id === report.id ? report : item));
    } else {
      saveHistory(loadHistory().map((item) => (item.id === reportId ? { ...item, status } : item)));
    }
    renderHistory();
    renderPortal();
  } catch (error) {
    setAuthMessage(error.message);
  }
});

portalTasksList?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-task-id]");
  if (!button) return;

  const taskId = button.dataset.taskId;
  const status = button.dataset.nextStatus;
  try {
    if (getToken()) {
      const { task } = await apiFetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      appState.tasks = (appState.tasks || []).map((item) => (item.id === task.id ? task : item));
    } else {
      saveTasks(loadTasks().map((item) => (item.id === taskId ? { ...item, status } : item)));
    }
    renderPortal();
  } catch (error) {
    setAuthMessage(error.message);
  }
});

function renderWeather(weather) {
  if (!weatherResult) return;
  const L = J();
  const eyebrow =
    weather.source === "open-meteo" ? "Open-Meteo" : escapeHtml(L.weather_demo_label);
  weatherResult.innerHTML = `
    <div class="weather-summary">
      <p class="eyebrow">${eyebrow}</p>
      <h4>${escapeHtml(weather.location)}</h4>
      <p>${escapeHtml(weather.summary)}</p>
      <ul>
        ${(weather.recommendations || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
    <div class="weather-days">
      ${(weather.days || [])
        .map(
          (day) => `
            <article class="weather-day">
              <strong>${escapeHtml(day.date)}</strong>
              <span>${escapeHtml(L.weather_temp)} ${escapeHtml(day.tempMin)}-${escapeHtml(day.tempMax)}°C</span>
              <span>${escapeHtml(L.weather_rain)} ${escapeHtml(day.rain)} mm</span>
              <span>${escapeHtml(L.weather_wind)} ${escapeHtml(day.wind)} km/h</span>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

weatherForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!weatherResult) return;
  const location =
    new FormData(weatherForm).get("location")?.toString().trim() || J().weather_default_location;
  const L = J();
  weatherResult.innerHTML = `<p class="empty-portal">${escapeHtml(L.weather_loading)}</p>`;
  try {
    if (getToken()) {
      const { weather } = await apiFetch(`/api/weather?location=${encodeURIComponent(location)}`);
      renderWeather(weather);
    } else {
      renderWeather({
        source: "demo",
        location,
        summary: L.weather_demo_summary,
        days: [
          { date: L.weather_day_today, tempMin: 12, tempMax: 24, rain: 0.4, wind: 14 },
          { date: L.weather_day_tmr, tempMin: 13, tempMax: 26, rain: 0.1, wind: 18 },
          { date: L.weather_day_2, tempMin: 15, tempMax: 28, rain: 2.2, wind: 21 },
        ],
        recommendations: L.weather_rec,
      });
    }
  } catch (error) {
    weatherResult.innerHTML = `<p class="empty-portal">${escapeHtml(error.message)}</p>`;
  }
});

undoMapPointButton?.addEventListener("click", () => {
  boundaryLngLatVertices.pop();
  renderBoundaryMap();
});

clearMapPointsButton?.addEventListener("click", clearBoundaryMap);

copyGeojsonButton?.addEventListener("click", async () => {
  const geoJson = boundaryToGeoJson();
  const L = J();
  if (!geoJson) {
    if (mapHelper) mapHelper.textContent = L.geojson_need;
    return;
  }

  const text = JSON.stringify(geoJson, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    if (mapHelper) mapHelper.textContent = L.geojson_copied;
  } catch {
    if (mapHelper) mapHelper.textContent = text;
  }
});

initBoundaryMapLibre();
renderBoundaryMap();

authForm?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-auth-action]");
  if (button) authAction = button.dataset.authAction;
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(authForm);

  try {
    const result = await apiFetch(`/api/auth/${authAction}`, {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name")?.toString().trim(),
        email: data.get("email")?.toString().trim(),
        password: data.get("password")?.toString(),
      }),
    });
    localStorage.setItem(tokenKey, result.token);
    authForm.reset();
    await refreshBackendData();
  } catch (error) {
    setAuthMessage(error.message);
  }
});

knowledgeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(knowledgeForm);
  const title = data.get("title")?.toString().trim() || J().knowledge_default;
  const url = data.get("url")?.toString().trim();
  const text = data.get("text")?.toString().trim();
  const ragIndex = data.get("indexForRag") === "on";

  try {
    if (getToken()) {
      const result = url
        ? await apiFetch("/api/knowledge/fetch", {
            method: "POST",
            body: JSON.stringify({ title, url, ragIndex }),
          })
        : await apiFetch("/api/knowledge", {
            method: "POST",
            body: JSON.stringify({ title, text, ragIndex }),
          });
      appState.knowledge = [result.item, ...(appState.knowledge || [])];
      if (result.ragChunksAdded > 0) {
        setAuthMessage(J().rag_added(result.ragChunksAdded));
      }
    } else {
      if (!text) throw new Error(J().local_need_text);
      saveKnowledge([
        { id: `${Date.now()}`, title, source: url || "local", text, createdAt: new Date().toISOString() },
        ...loadKnowledge(),
      ]);
    }
    knowledgeForm.reset();
    renderPortal();
  } catch (error) {
    setAuthMessage(error.message);
  }
});

logoutButton?.addEventListener("click", async () => {
  const token = getToken();
  if (token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      });
    } catch {
      /* мрежова грешка — локално излизаме въпреки това */
    }
  }
  localStorage.removeItem(tokenKey);
  await refreshBackendData();
});

function initNavMore() {
  document.querySelectorAll(".nav-more-panel a").forEach((link) => {
    link.addEventListener("click", () => {
      link.closest("details.nav-more")?.removeAttribute("open");
    });
  });
  document.addEventListener("click", (event) => {
    const t = event.target;
    if (!(t instanceof Element)) return;
    document.querySelectorAll("details.nav-more[open]").forEach((detailsEl) => {
      if (!detailsEl.contains(t)) detailsEl.removeAttribute("open");
    });
  });
}

initNavMore();

function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  if (localStorage.getItem("sima-cookie-consent") === "1") {
    banner.hidden = true;
    return;
  }
  banner.hidden = false;
  banner.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    localStorage.setItem("sima-cookie-consent", "1");
    banner.hidden = true;
  });
}

initCookieBanner();

window.addEventListener("sima-lang-change", () => {
  updateAdvisor();
  updateAuthUi();
  renderHistory();
  renderPortal();
  renderBoundaryMap();
  const rep =
    currentReportId &&
    (loadHistory().find((r) => r.id === currentReportId) ||
      (appState.reports || []).find((r) => r.id === currentReportId));
  if (rep && reportPreview && !reportPreview.hidden) {
    currentReportText = buildReportText(rep);
    if (feedbackStatus) feedbackStatus.textContent = rep.feedback ? J().feedback_exists : "";
  }
  const cb = copyReportButton;
  if (cb) {
    const done = J().copy_done;
    const fb = J().copy_fallback;
    if (cb.textContent !== done && cb.textContent !== fb) cb.textContent = J().copy_default;
  }
});

refreshBackendData();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const statusEl = document.querySelector("#contact-status");
  const data = new FormData(form);
  const name = data.get("name")?.toString().trim() || "";
  const email = data.get("email")?.toString().trim() || "";
  const message = data.get("message")?.toString().trim() || "";

  const L = J();
  const subject = encodeURIComponent(L.contact_mail_subject(name));
  const body = encodeURIComponent(L.contact_mail_body(name, email, message));

  if (statusEl) statusEl.textContent = "";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        typeof payload.error === "string" ? payload.error : L.contact_fail;
      if (statusEl) statusEl.textContent = msg;
      return;
    }
    if (statusEl) {
      statusEl.textContent = L.contact_ok;
    }
    form.reset();
  } catch {
    window.location.href = `mailto:${SIMA_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }
});
