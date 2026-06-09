const canvas = document.getElementById("airspace");
const ctx = canvas.getContext("2d");

const els = {
  radiusInput: document.getElementById("radiusInput"),
  radiusValue: document.getElementById("radiusValue"),
  densityInput: document.getElementById("densityInput"),
  densityValue: document.getElementById("densityValue"),
  trackCount: document.getElementById("trackCount"),
  alertCount: document.getElementById("alertCount"),
  watchCount: document.getElementById("watchCount"),
  platformEyebrow: document.getElementById("platformEyebrow"),
  platformModeLabel: document.getElementById("platformModeLabel"),
  platformModeDescription: document.getElementById("platformModeDescription"),
  trackList: document.getElementById("trackList"),
  trackDetails: document.getElementById("trackDetails"),
  selectedBadge: document.getElementById("selectedBadge"),
  recommendation: document.getElementById("recommendation"),
  eventLog: document.getElementById("eventLog"),
  clock: document.getElementById("clock"),
  resetBtn: document.getElementById("resetBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  riskFilter: document.getElementById("riskFilter"),
  scenarioPreset: document.getElementById("scenarioPreset"),
  closestTrack: document.getElementById("closestTrack"),
  zoneLoad: document.getElementById("zoneLoad"),
  nextEta: document.getElementById("nextEta"),
  breachCount: document.getElementById("breachCount"),
  checklistStatus: document.getElementById("checklistStatus"),
  traineeName: document.getElementById("traineeName"),
  sessionId: document.getElementById("sessionId"),
  trainingGrade: document.getElementById("trainingGrade"),
  avgResponse: document.getElementById("avgResponse"),
  injectCount: document.getElementById("injectCount"),
  objectiveList: document.getElementById("objectiveList"),
  reviewTimeline: document.getElementById("reviewTimeline"),
  reviewTime: document.getElementById("reviewTime"),
  reviewEvent: document.getElementById("reviewEvent"),
  reviewFocus: document.getElementById("reviewFocus"),
  reviewStatus: document.getElementById("reviewStatus"),
  reviewMarkers: document.getElementById("reviewMarkers"),
  trainingLevel: document.getElementById("trainingLevel"),
  certStatus: document.getElementById("certStatus"),
  proficiencyScore: document.getElementById("proficiencyScore"),
  moduleCount: document.getElementById("moduleCount"),
  certLevel: document.getElementById("certLevel"),
  skillMatrix: document.getElementById("skillMatrix"),
  leaderConfidence: document.getElementById("leaderConfidence"),
  leaderPriority: document.getElementById("leaderPriority"),
  leaderMode: document.getElementById("leaderMode"),
  leaderAction: document.getElementById("leaderAction"),
  leaderBrief: document.getElementById("leaderBrief"),
  leaderWatchlist: document.getElementById("leaderWatchlist"),
  weatherPreset: document.getElementById("weatherPreset"),
  windInput: document.getElementById("windInput"),
  windValue: document.getElementById("windValue"),
  visibilityInput: document.getElementById("visibilityInput"),
  visibilityValue: document.getElementById("visibilityValue"),
  turbulenceInput: document.getElementById("turbulenceInput"),
  turbulenceValue: document.getElementById("turbulenceValue"),
  weatherImpact: document.getElementById("weatherImpact"),
  weatherOperatorEffect: document.getElementById("weatherOperatorEffect"),
  weatherSimulationEffect: document.getElementById("weatherSimulationEffect"),
  weatherRouteAdvisor: document.getElementById("weatherRouteAdvisor"),
  missionProfile: document.getElementById("missionProfile"),
  roePosture: document.getElementById("roePosture"),
  commandReadiness: document.getElementById("commandReadiness"),
  commanderPriority: document.getElementById("commanderPriority"),
  missionRisk: document.getElementById("missionRisk"),
  roeMatrix: document.getElementById("roeMatrix"),
  sectorGrid: document.getElementById("sectorGrid"),
  sensorPosture: document.getElementById("sensorPosture"),
  fusionConfidence: document.getElementById("fusionConfidence"),
  sensorAgreement: document.getElementById("sensorAgreement"),
  fusedPriority: document.getElementById("fusedPriority"),
  fusionQuality: document.getElementById("fusionQuality"),
  sensorFeeds: document.getElementById("sensorFeeds"),
  fusionTrackList: document.getElementById("fusionTrackList"),
  iffPolicy: document.getElementById("iffPolicy"),
  iffStatus: document.getElementById("iffStatus"),
  friendlyMatchCount: document.getElementById("friendlyMatchCount"),
  unknownTrackCount: document.getElementById("unknownTrackCount"),
  falsePositiveReduction: document.getElementById("falsePositiveReduction"),
  registryList: document.getElementById("registryList"),
  iffTrackList: document.getElementById("iffTrackList"),
  dutyAuthority: document.getElementById("dutyAuthority"),
  notifyThreshold: document.getElementById("notifyThreshold"),
  closureRule: document.getElementById("closureRule"),
  roeDecisionStatus: document.getElementById("roeDecisionStatus"),
  authorityCheck: document.getElementById("authorityCheck"),
  roeDecisionCards: document.getElementById("roeDecisionCards"),
  commanderStatus: document.getElementById("commanderStatus"),
  dashboardReadiness: document.getElementById("dashboardReadiness"),
  dashboardWeather: document.getElementById("dashboardWeather"),
  operatorStatus: document.getElementById("operatorStatus"),
  incidentQueueCount: document.getElementById("incidentQueueCount"),
  commanderSectorMap: document.getElementById("commanderSectorMap"),
  commanderPriorities: document.getElementById("commanderPriorities"),
  incidentQueue: document.getElementById("incidentQueue"),
  trainingScenario: document.getElementById("trainingScenario"),
  scenarioStatus: document.getElementById("scenarioStatus"),
  scenarioTempo: document.getElementById("scenarioTempo"),
  scenarioFocus: document.getElementById("scenarioFocus"),
  scenarioRisk: document.getElementById("scenarioRisk"),
  scenarioCards: document.getElementById("scenarioCards"),
  scenarioObjectives: document.getElementById("scenarioObjectives"),
  airportDefenseStatus: document.getElementById("airportDefenseStatus"),
  runwayReadiness: document.getElementById("runwayReadiness"),
  approachCorridor: document.getElementById("approachCorridor"),
  atcCoordination: document.getElementById("atcCoordination"),
  responderPosture: document.getElementById("responderPosture"),
  responseCell: document.getElementById("responseCell"),
  airportWorkflow: document.getElementById("airportWorkflow"),
  redTeamPattern: document.getElementById("redTeamPattern"),
  redTeamIntensity: document.getElementById("redTeamIntensity"),
  redTeamIntensityValue: document.getElementById("redTeamIntensityValue"),
  redTeamStatus: document.getElementById("redTeamStatus"),
  decoyTrackCount: document.getElementById("decoyTrackCount"),
  redTeamPressure: document.getElementById("redTeamPressure"),
  redTeamPatternCards: document.getElementById("redTeamPatternCards"),
  redTeamCueList: document.getElementById("redTeamCueList"),
  commsPreset: document.getElementById("commsPreset"),
  latencyInput: document.getElementById("latencyInput"),
  latencyValue: document.getElementById("latencyValue"),
  packetLossInput: document.getElementById("packetLossInput"),
  packetLossValue: document.getElementById("packetLossValue"),
  gpsUncertaintyInput: document.getElementById("gpsUncertaintyInput"),
  gpsUncertaintyValue: document.getElementById("gpsUncertaintyValue"),
  fatigueInput: document.getElementById("fatigueInput"),
  fatigueValue: document.getElementById("fatigueValue"),
  commsStatus: document.getElementById("commsStatus"),
  commsOperatorEffect: document.getElementById("commsOperatorEffect"),
  commsSensorEffect: document.getElementById("commsSensorEffect"),
  commsCommandEffect: document.getElementById("commsCommandEffect"),
  degradedFeedList: document.getElementById("degradedFeedList"),
  evidenceOfficer: document.getElementById("evidenceOfficer"),
  auditStatus: document.getElementById("auditStatus"),
  evidenceCount: document.getElementById("evidenceCount"),
  auditScore: document.getElementById("auditScore"),
  approvalCount: document.getElementById("approvalCount"),
  evidenceTimeline: document.getElementById("evidenceTimeline"),
  forecastHorizon: document.getElementById("forecastHorizon"),
  leader2Status: document.getElementById("leader2Status"),
  riskForecast: document.getElementById("riskForecast"),
  staffingRecommendation: document.getElementById("staffingRecommendation"),
  trainingCritique: document.getElementById("trainingCritique"),
  leader2Cards: document.getElementById("leader2Cards"),
  fieldMode: document.getElementById("fieldMode"),
  offlineStatus: document.getElementById("offlineStatus"),
  localStorageStatus: document.getElementById("localStorageStatus"),
  lastOfflineSave: document.getElementById("lastOfflineSave"),
  fieldPackageState: document.getElementById("fieldPackageState"),
  offlineChecklist: document.getElementById("offlineChecklist"),
  operatorNote: document.getElementById("operatorNote"),
  incidentReport: document.getElementById("incidentReport"),
  notifyBtn: document.getElementById("notifyBtn"),
  ackBtn: document.getElementById("ackBtn"),
  logBtn: document.getElementById("logBtn"),
  reportBtn: document.getElementById("reportBtn"),
  clearBtn: document.getElementById("clearBtn"),
  injectBtn: document.getElementById("injectBtn"),
  summaryBtn: document.getElementById("summaryBtn"),
  markerBtn: document.getElementById("markerBtn"),
  aarBtn: document.getElementById("aarBtn"),
  certificateBtn: document.getElementById("certificateBtn"),
  academyExportBtn: document.getElementById("academyExportBtn"),
  leaderBriefBtn: document.getElementById("leaderBriefBtn"),
  leaderSnapshotBtn: document.getElementById("leaderSnapshotBtn"),
  weatherBriefBtn: document.getElementById("weatherBriefBtn"),
  weatherDrillBtn: document.getElementById("weatherDrillBtn"),
  routeCorrectionBtn: document.getElementById("routeCorrectionBtn"),
  missionBriefBtn: document.getElementById("missionBriefBtn"),
  commanderSnapshotBtn: document.getElementById("commanderSnapshotBtn"),
  fusionBriefBtn: document.getElementById("fusionBriefBtn"),
  sensorFaultBtn: document.getElementById("sensorFaultBtn"),
  markFriendlyBtn: document.getElementById("markFriendlyBtn"),
  iffBriefBtn: document.getElementById("iffBriefBtn"),
  notifyCommandBtn: document.getElementById("notifyCommandBtn"),
  closeIncidentBtn: document.getElementById("closeIncidentBtn"),
  roeBriefBtn: document.getElementById("roeBriefBtn"),
  commanderBriefBtn: document.getElementById("commanderBriefBtn"),
  queueSnapshotBtn: document.getElementById("queueSnapshotBtn"),
  loadScenarioBtn: document.getElementById("loadScenarioBtn"),
  scenarioBriefBtn: document.getElementById("scenarioBriefBtn"),
  airportDefenseBriefBtn: document.getElementById("airportDefenseBriefBtn"),
  redTeamInjectBtn: document.getElementById("redTeamInjectBtn"),
  redTeamBriefBtn: document.getElementById("redTeamBriefBtn"),
  commsDrillBtn: document.getElementById("commsDrillBtn"),
  commsBriefBtn: document.getElementById("commsBriefBtn"),
  recordEvidenceBtn: document.getElementById("recordEvidenceBtn"),
  evidencePackageBtn: document.getElementById("evidencePackageBtn"),
  evidenceJsonBtn: document.getElementById("evidenceJsonBtn"),
  leader2BriefBtn: document.getElementById("leader2BriefBtn"),
  trainingCritiqueBtn: document.getElementById("trainingCritiqueBtn"),
  saveOfflineBtn: document.getElementById("saveOfflineBtn"),
  loadOfflineBtn: document.getElementById("loadOfflineBtn"),
  fieldPackageBtn: document.getElementById("fieldPackageBtn"),
  clearLogBtn: document.getElementById("clearLogBtn"),
  copyReportBtn: document.getElementById("copyReportBtn"),
  exportBtn: document.getElementById("exportBtn"),
};

const state = {
  tracks: [],
  selectedId: null,
  events: [],
  notes: {},
  breaches: {},
  firstAlertAt: {},
  responses: [],
  injects: 0,
  reviewMarkers: [],
  reviewIndex: 0,
  weatherDrillActive: false,
  sensorFault: null,
  friendlyRegistry: [],
  commandNotifications: {},
  closedIncidents: {},
  platformMode: "civil",
  activeTrainingScenario: "base",
  redTeamEvents: [],
  commsDrills: [],
  evidenceRecords: [],
  lastOfflineSave: null,
  sessionId: `TRN-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  speed: 0.7,
  startedAt: Date.now(),
  paused: false,
};

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function platformModeConfig() {
  const configs = {
    civil: {
      label: "Civil Protection",
      eyebrow: "Civil protection defense platform",
      description: "Airport and public-safety protection for civilian areas, critical infrastructure, and emergency coordination.",
      briefPrefix: "Civil Protection",
      responseUnits: [
        {
          unit: "Airport Operations Center",
          role: "Incident coordination, runway readiness, and operational picture",
          statusFor: ({ airportRisk }) => (airportRisk >= 55 ? "Lead" : "Monitoring"),
        },
        {
          unit: "ATC / Tower",
          role: "Air-traffic safety coordination and runway status",
          statusFor: ({ atcCoordination }) => atcCoordination,
        },
        {
          unit: "Airport Security",
          role: "Perimeter response, terminal safety, and evidence support",
          statusFor: ({ alertCount, watchCount }) => (alertCount || watchCount ? "Dispatched" : "Standby"),
        },
        {
          unit: "Police / Gendarmerie",
          role: "Civil authority, cordon support, and public safety coordination",
          statusFor: ({ breachTotal, airportRisk }) => (breachTotal || airportRisk >= 80 ? "Notify" : "Standby"),
        },
        {
          unit: "Emergency Services",
          role: "Medical/fire readiness and passenger safety support",
          statusFor: ({ airportRisk }) => (airportRisk >= 80 ? "Stage" : "Standby"),
        },
      ],
      boundary:
        "Civil mode coordinates detection, classification, airport operations, public safety notification, evidence, and authorized civil response. It does not provide weapon, interference, takeover, or destructive instructions.",
    },
    military: {
      label: "Military Defense",
      eyebrow: "Military defensive platform",
      description: "Military defensive coordination for protected airspace, base defense, convoy support, and critical-site protection.",
      briefPrefix: "Military Defense",
      responseUnits: [
        {
          unit: "Mission Commander",
          role: "Incident command, sector priorities, and escalation authority",
          statusFor: ({ airportRisk }) => (airportRisk >= 55 ? "Lead" : "Monitoring"),
        },
        {
          unit: "ATC / Airspace Liaison",
          role: "Airspace coordination and runway/approach status",
          statusFor: ({ atcCoordination }) => atcCoordination,
        },
        {
          unit: "Military C-UAS Team",
          role: "Authorized defensive response and specialist assessment",
          statusFor: ({ airportRisk }) => (airportRisk >= 55 ? "On tasking" : "Ready reserve"),
        },
        {
          unit: "Security Forces",
          role: "Perimeter control, protected-site security, and evidence support",
          statusFor: ({ alertCount, watchCount }) => (alertCount || watchCount ? "Dispatched" : "Standby"),
        },
        {
          unit: "Civil Authority Liaison",
          role: "Public-safety coordination when civilian areas are affected",
          statusFor: ({ breachTotal, airportRisk }) => (breachTotal || airportRisk >= 80 ? "Notify" : "Standby"),
        },
        {
          unit: "Emergency Services",
          role: "Medical/fire readiness and evacuation support",
          statusFor: ({ airportRisk }) => (airportRisk >= 80 ? "Stage" : "Standby"),
        },
      ],
      boundary:
        "Military mode coordinates detection, classification, protected-airspace readiness, ROE review, evidence, and authorized defensive response. It does not provide weapon, interference, takeover, or destructive instructions.",
    },
  };
  return configs[state.platformMode] || configs.civil;
}

function createTrack(index) {
  const angle = rand(0, Math.PI * 2);
  const distance = rand(210, 390);
  const inbound = Math.random() > 0.35;
  const heading = inbound ? angle + Math.PI + rand(-0.45, 0.45) : angle + rand(-0.9, 0.9);

  return {
    id: `DR-${String(index + 1).padStart(3, "0")}`,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    heading,
    speed: rand(10, 28),
    altitude: rand(35, 140),
    reviewed: false,
    acknowledged: false,
    trail: [],
    wasInsideZone: false,
  };
}

function scenarioCatalog() {
  return {
    base: {
      label: "Base defense",
      tempo: "Steady",
      focus: "Perimeter watch",
      risk: "Medium",
      radius: 180,
      density: 6,
      weather: "clear",
      mission: "base",
      roe: "notify",
      objectives: ["Maintain sector coverage", "Notify command on alerts", "Close friendly matches cleanly"],
    },
    convoy: {
      label: "Convoy overwatch",
      tempo: "Mobile",
      focus: "Route sectors",
      risk: "High",
      radius: 130,
      density: 8,
      weather: "wind",
      mission: "convoy",
      roe: "notify",
      objectives: ["Prioritize moving-sector queue", "Track operator load", "Generate commander brief"],
    },
    warehouse: {
      label: "Warehouse perimeter",
      tempo: "Slow",
      focus: "Asset protection",
      risk: "Medium",
      radius: 150,
      density: 5,
      weather: "fog",
      mission: "infrastructure",
      roe: "observe",
      objectives: ["Reduce false positives", "Use IFF registry", "Document closeout decisions"],
    },
    airport: {
      label: "Airport airside",
      tempo: "Busy",
      focus: "Airside coordination",
      risk: "High",
      radius: 210,
      density: 9,
      weather: "rain",
      mission: "base",
      roe: "handoff",
      objectives: ["Preserve audit trail", "Use notification thresholds", "Maintain weather-aware review"],
    },
    border: {
      label: "Border sector",
      tempo: "Extended",
      focus: "Long sector watch",
      risk: "Elevated",
      radius: 190,
      density: 7,
      weather: "clear",
      mission: "border",
      roe: "notify",
      objectives: ["Watch sector load", "Classify unknown tracks", "Capture queue snapshot"],
    },
    critical: {
      label: "Critical infrastructure",
      tempo: "Controlled",
      focus: "High-value site",
      risk: "High",
      radius: 170,
      density: 8,
      weather: "storm",
      mission: "infrastructure",
      roe: "handoff",
      objectives: ["Use commander dashboard", "Verify authority before closure", "Generate mission brief"],
    },
  };
}

function activeScenario() {
  return scenarioCatalog()[state.activeTrainingScenario] || scenarioCatalog().base;
}

function redTeamCatalog() {
  return {
    swarm: {
      label: "Swarm behavior",
      pressure: "High",
      cues: ["Multiple simultaneous tracks", "Prioritize queue discipline", "Use sector map before selecting actions"],
    },
    decoys: {
      label: "Decoys and ambiguity",
      pressure: "Medium",
      cues: ["Some tracks are decoys", "Use sensor fusion before escalation", "Avoid closing unknowns too quickly"],
    },
    low: {
      label: "Low-altitude approach",
      pressure: "Elevated",
      cues: ["Low altitude reduces confidence", "Check ETA trend", "Record weather and visibility assumptions"],
    },
    weather: {
      label: "Weather masking",
      pressure: "High",
      cues: ["Weather impact degrades review", "Generate weather brief", "Use commander dashboard for queue load"],
    },
  };
}

function activeRedTeamPattern() {
  return redTeamCatalog()[els.redTeamPattern.value] || redTeamCatalog().swarm;
}

function resetScenario() {
  const count = Number(els.densityInput.value);
  state.tracks = Array.from({ length: count }, (_, index) => createTrack(index));
  state.selectedId = state.tracks[0]?.id ?? null;
  state.events = [];
  state.notes = {};
  state.breaches = {};
  state.firstAlertAt = {};
  state.responses = [];
  state.injects = 0;
  state.reviewMarkers = [];
  state.reviewIndex = 0;
  state.commandNotifications = {};
  state.closedIncidents = {};
  state.redTeamEvents = [];
  state.commsDrills = [];
  state.evidenceRecords = [];
  state.sessionId = `TRN-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  state.friendlyRegistry = state.tracks.slice(0, Math.min(2, state.tracks.length)).map((track, index) => ({
    id: `FR-${String(index + 1).padStart(3, "0")}`,
    trackId: track.id,
    name: index === 0 ? "Blue survey drone" : "Authorized perimeter patrol",
    corridor: sectorFor(track),
    verified: true,
  }));
  state.startedAt = Date.now();
  addEvent("Scenario reset in training mode");
  render();
}

function loadTrainingScenario(key = els.trainingScenario.value) {
  const catalog = scenarioCatalog();
  const scenario = catalog[key] || catalog.base;
  state.activeTrainingScenario = key;
  els.trainingScenario.value = key;
  els.radiusInput.value = scenario.radius;
  els.densityInput.value = scenario.density;
  els.weatherPreset.value = scenario.weather;
  els.weatherPreset.dispatchEvent(new Event("change"));
  els.missionProfile.value = scenario.mission;
  els.roePosture.value = scenario.roe;
  resetScenario();
  addEvent(`Training scenario loaded: ${scenario.label}`);
}

function injectRedTeamPattern() {
  const patternKey = els.redTeamPattern.value;
  const pattern = activeRedTeamPattern();
  const intensity = Number(els.redTeamIntensity.value);
  const count = patternKey === "swarm" ? intensity + 3 : intensity + 1;
  const baseAngle = rand(0, Math.PI * 2);
  const created = [];

  for (let index = 0; index < count; index += 1) {
    const angle = baseAngle + rand(-0.35, 0.35) + (patternKey === "swarm" ? index * 0.08 : index * 0.18);
    const range = patternKey === "low" ? rand(180, 280) : rand(230, 360);
    const track = {
      id: `DR-${String(state.tracks.length + 1).padStart(3, "0")}`,
      x: Math.cos(angle) * range,
      y: Math.sin(angle) * range,
      heading: angle + Math.PI + rand(-0.18, 0.18),
      speed: patternKey === "swarm" ? rand(18, 32) : rand(10, 26),
      altitude: patternKey === "low" ? rand(18, 45) : rand(45, 130),
      reviewed: false,
      acknowledged: false,
      trail: [],
      wasInsideZone: false,
      redTeam: {
        pattern: patternKey,
        decoy: patternKey === "decoys" && index % 2 === 1,
        lowAltitude: patternKey === "low",
        weatherMasked: patternKey === "weather",
      },
    };
    state.tracks.push(track);
    created.push(track.id);
  }

  if (patternKey === "weather") {
    els.weatherPreset.value = "storm";
    els.weatherPreset.dispatchEvent(new Event("change"));
  }

  state.selectedId = created[0] || state.selectedId;
  state.redTeamEvents.push({
    time: new Date().toISOString(),
    pattern: patternKey,
    intensity,
    created,
  });
  addEvent(`Red-team pattern injected: ${pattern.label} (${created.length} tracks)`);
  render();
}

function metersToCanvas(x, y) {
  const scale = Math.min(canvas.width, canvas.height) / 880;
  return {
    x: canvas.width / 2 + x * scale,
    y: canvas.height / 2 + y * scale,
  };
}

function distance(track) {
  return Math.hypot(track.x, track.y);
}

function iffMatchFor(track) {
  const entry = state.friendlyRegistry.find((item) => item.trackId === track.id);
  if (!entry) return { status: "unknown", label: "Unknown", entry: null, confidence: 0 };

  const sameSector = entry.corridor === sectorFor(track);
  const policy = els.iffPolicy?.value || "balanced";
  const policyPenalty = policy === "strict" && !sameSector ? 22 : policy === "exercise" ? -8 : 0;
  const confidence = Math.max(45, Math.min(99, Math.round((entry.verified ? 86 : 66) + (sameSector ? 8 : -18) - policyPenalty)));
  const status = confidence >= 70 ? "friendly" : "review";
  return { status, label: status === "friendly" ? "Friendly" : "Review", entry, confidence };
}

function riskFor(track) {
  const zone = Number(els.radiusInput.value);
  const d = distance(track);
  const closing = -(track.x * Math.cos(track.heading) + track.y * Math.sin(track.heading)) / Math.max(d, 1);
  const iff = iffMatchFor(track);
  const friendlyReduction = iff.status === "friendly" ? 42 : iff.status === "review" ? 18 : 0;
  const redTeamAdjustment = track.redTeam?.decoy ? -18 : track.redTeam?.lowAltitude ? 12 : track.redTeam?.weatherMasked ? 8 : 0;
  const score = Math.round(Math.max(0, (zone + 120 - d) / 2.4) + Math.max(0, closing * 35) - friendlyReduction + redTeamAdjustment);

  if (track.reviewed) return { label: "reviewed", level: "clear", score: Math.min(Math.max(score, 0), 35) };
  if (iff.status === "friendly") return { label: "friendly", level: "clear", score: Math.min(Math.max(score, 0), 30) };
  if (d < zone || score > 82) return { label: "alert", level: "alert", score: Math.min(score, 99) };
  if (d < zone + 120 || score > 48) return { label: "watch", level: "watch", score: Math.min(score, 81) };
  return { label: iff.status === "review" ? "iff review" : "clear", level: "clear", score: Math.min(Math.max(score, 0), 47) };
}

function nearestTrack() {
  return state.tracks.reduce((nearest, track) => {
    if (!nearest || distance(track) < distance(nearest)) return track;
    return nearest;
  }, null);
}

function etaToZone(track) {
  const zone = Number(els.radiusInput.value);
  const d = distance(track);
  if (d <= zone) return 0;

  const closing = -(track.x * Math.cos(track.heading) + track.y * Math.sin(track.heading)) / Math.max(d, 1);
  if (closing <= 0.05) return Infinity;
  return Math.round((d - zone) / Math.max(track.speed * closing * state.speed, 1));
}

function weatherState() {
  const wind = Number(els.windInput.value);
  const visibility = Number(els.visibilityInput.value);
  const turbulence = Number(els.turbulenceInput.value);
  const visibilityPenalty = Math.max(0, (5000 - visibility) / 4800);
  const windPenalty = wind / 40;
  const turbulencePenalty = turbulence / 10;
  const impact = Math.round((windPenalty * 0.35 + visibilityPenalty * 0.4 + turbulencePenalty * 0.25) * 100);
  return { preset: els.weatherPreset.value, wind, visibility, turbulence, impact };
}

function weatherLabel(weather) {
  if (weather.impact >= 75) return "Severe";
  if (weather.impact >= 45) return "Degraded";
  if (weather.impact >= 20) return "Caution";
  return "Nominal";
}

function weatherRouteAdvisory(track = selectedTrack()) {
  const weather = weatherState();
  if (!track) return { status: "No track selected", canCorrect: false, action: "Select a friendly track first." };

  const iff = iffMatchFor(track);
  if (iff.status !== "friendly") {
    return {
      status: "Advisory only",
      canCorrect: false,
      action: "Route correction is blocked until the track is verified as friendly.",
    };
  }

  if (weather.impact < 35) {
    return { status: "No correction needed", canCorrect: false, action: "Weather is acceptable for the current simulated route." };
  }

  const range = distance(track);
  const zone = Number(els.radiusInput.value);
  const action =
    weather.impact >= 70
      ? "Divert to safe corridor and reduce speed."
      : range < zone + 90
      ? "Exit protected-zone edge and hold."
      : "Adjust heading away from degraded weather sector.";

  return { status: "Correction recommended", canCorrect: true, action };
}

function applyWeatherRouteCorrection() {
  const track = selectedTrack();
  const advisory = weatherRouteAdvisory(track);
  if (!track || !advisory.canCorrect) {
    addEvent(`Weather route correction blocked: ${advisory.action}`);
    return;
  }

  const awayFromCenter = Math.atan2(track.y, track.x);
  const crosswindOffset = weatherState().wind > 20 ? 0.35 : 0.18;
  track.heading = awayFromCenter + crosswindOffset;
  track.speed = Math.max(8, track.speed * 0.82);
  track.reviewed = false;
  state.notes[track.id] = `${state.notes[track.id] || ""}\nWeather route correction simulated: ${advisory.action}`.trim();
  addEvent(`Weather route correction simulated for ${track.id}`);
}

function commsState() {
  const latency = Number(els.latencyInput.value);
  const packetLoss = Number(els.packetLossInput.value);
  const gps = Number(els.gpsUncertaintyInput.value);
  const fatigue = Number(els.fatigueInput.value);
  const impact = Math.round(Math.min(100, latency / 35 + packetLoss * 0.9 + gps * 0.35 + fatigue * 4));
  return { preset: els.commsPreset.value, latency, packetLoss, gps, fatigue, impact };
}

function commsLabel(comms) {
  if (comms.impact >= 75) return "Critical";
  if (comms.impact >= 50) return "Degraded";
  if (comms.impact >= 25) return "Caution";
  return "Nominal";
}

function sectorFor(track) {
  if (track.y < -80) return "North";
  if (track.x > 80) return "East";
  if (track.y > 80) return "South";
  if (track.x < -80) return "West";
  return "Core";
}

function commandAnalysis() {
  const leader = leaderAnalysis();
  const weather = weatherState();
  const academy = academyMetrics();
  const counts = riskCounts();
  const breachTotal = Object.values(state.breaches).reduce((total, count) => total + count, 0);
  const posture = els.roePosture.value;
  const profile = els.missionProfile.value;
  const profileWeight = profile === "convoy" ? 8 : profile === "border" ? 6 : profile === "infrastructure" ? 5 : 4;
  const riskScore = Math.min(100, counts.alert * 24 + counts.watch * 9 + weather.impact * 0.35 + breachTotal * 12 + profileWeight);
  const readiness = Math.max(0, Math.round(academy.proficiency - weather.impact * 0.25 - counts.alert * 8 + state.reviewMarkers.length * 2));
  const riskLabel = riskScore >= 70 ? "High" : riskScore >= 40 ? "Elevated" : riskScore >= 20 ? "Caution" : "Nominal";

  const sectors = ["North", "East", "South", "West", "Core"].map((name) => {
    const tracks = state.tracks.filter((track) => sectorFor(track) === name);
    const alerts = tracks.filter((track) => riskFor(track).level === "alert").length;
    const watch = tracks.filter((track) => riskFor(track).level === "watch").length;
    const load = Math.min(100, alerts * 35 + watch * 15 + tracks.length * 6 + (weather.impact > 60 ? 10 : 0));
    return {
      name,
      tracks: tracks.length,
      alerts,
      watch,
      status: load >= 65 ? "hot" : load >= 35 ? "watch" : "ready",
      load,
    };
  });

  const roe = [
    {
      label: "Observe and classify",
      status: "Authorized",
      active: true,
    },
    {
      label: "Notify command channel",
      status: posture === "observe" ? "Hold" : "Authorized",
      active: posture !== "observe" && (counts.alert > 0 || riskScore >= 40),
    },
    {
      label: "Authorized handoff workflow",
      status: posture === "handoff" ? "Authorized" : "Commander approval",
      active: posture === "handoff" && counts.alert > 0,
    },
    {
      label: "Archive evidence package",
      status: "Required",
      active: state.events.length > 4 || breachTotal > 0,
    },
  ];

  return { leader, weather, academy, counts, breachTotal, profile, posture, riskScore, riskLabel, readiness, sectors, roe };
}

function sensorFusionAnalysis() {
  const weather = weatherState();
  const comms = commsState();
  const posture = els.sensorPosture.value;
  const baseFeeds = [
    { id: "radar", label: "Radar", quality: 92 - weather.impact * 0.18 - comms.packetLoss * 0.25, weight: posture === "radar" ? 1.25 : 1 },
    { id: "eo", label: "EO/IR", quality: 88 - Math.max(0, 5000 - weather.visibility) / 70 - comms.latency / 90, weight: posture === "visual" ? 1.25 : 1 },
    { id: "acoustic", label: "Acoustic", quality: 84 - weather.wind * 0.9 - weather.turbulence * 1.4 - comms.fatigue * 0.8, weight: posture === "passive" ? 1.2 : 1 },
    { id: "rf", label: "RF observer", quality: 78 - weather.impact * 0.08 - comms.packetLoss * 0.35, weight: posture === "passive" ? 1.15 : 1 },
  ];

  const feeds = baseFeeds.map((feed) => {
    const blackoutPenalty = comms.preset === "blackout" && (feed.id === "eo" || feed.id === "rf") ? 28 : 0;
    const faultPenalty = state.sensorFault === feed.id ? 35 : 0;
    const quality = Math.max(12, Math.min(99, Math.round(feed.quality - faultPenalty - blackoutPenalty)));
    return {
      ...feed,
      quality,
      status: quality >= 75 ? "green" : quality >= 50 ? "amber" : "red",
    };
  });

  const weightedQuality =
    feeds.reduce((total, feed) => total + feed.quality * feed.weight, 0) /
    feeds.reduce((total, feed) => total + feed.weight, 0);
  const agreement = Math.max(0, Math.round(100 - (Math.max(...feeds.map((feed) => feed.quality)) - Math.min(...feeds.map((feed) => feed.quality)))));
  const confidence = Math.round(weightedQuality * 0.68 + agreement * 0.32);

  const fusedTracks = state.tracks
    .map((track) => {
      const risk = riskFor(track);
      const eta = etaToZone(track);
      const range = distance(track) + comms.gps * 0.45;
      const sensorBonus =
        feeds[0].quality * (range > 260 ? 0.11 : 0.06) +
        feeds[1].quality * (weather.visibility > range ? 0.09 : 0.03) +
        feeds[2].quality * (range < 240 ? 0.08 : 0.04) +
        feeds[3].quality * 0.05;
      const score = Math.round(risk.score + sensorBonus + (eta === 0 ? 18 : Number.isFinite(eta) ? 10 : 0));
      return { track, risk, eta, range, score };
    })
    .sort((a, b) => b.score - a.score);

  const qualityLabel = confidence >= 78 ? "Nominal" : confidence >= 55 ? "Degraded" : "Limited";
  return { feeds, agreement, confidence, qualityLabel, fusedTracks, priority: fusedTracks[0] || null };
}

function iffAnalysis() {
  const classifications = state.tracks.map((track) => {
    const iff = iffMatchFor(track);
    const risk = riskFor(track);
    return { track, iff, risk, sector: sectorFor(track) };
  });
  const friendly = classifications.filter((item) => item.iff.status === "friendly");
  const review = classifications.filter((item) => item.iff.status === "review");
  const unknown = classifications.filter((item) => item.iff.status === "unknown");
  const falsePositiveReduction = state.tracks.length
    ? Math.round(((friendly.length * 0.85 + review.length * 0.35) / state.tracks.length) * 100)
    : 0;
  const registryStatus =
    unknown.length === 0 ? "Complete" : friendly.length > 0 ? "Partial" : state.friendlyRegistry.length ? "Review" : "Empty";
  return { classifications, friendly, review, unknown, falsePositiveReduction, registryStatus };
}

function roeAuthorityRank(authority = els.dutyAuthority.value) {
  return { operator: 1, supervisor: 2, commander: 3 }[authority] || 1;
}

function roeAnalysis() {
  const command = commandAnalysis();
  const iff = iffAnalysis();
  const selected = selectedTrack();
  const selectedRisk = selected ? riskFor(selected) : null;
  const selectedIff = selected ? iffMatchFor(selected) : null;
  const breachTotal = selected ? state.breaches[selected.id] || 0 : 0;
  const notePresent = selected ? Boolean((state.notes[selected.id] || "").trim()) : false;
  const authority = els.dutyAuthority.value;
  const rank = roeAuthorityRank(authority);
  const needsSupervisor = selectedRisk?.level === "alert" || breachTotal > 0 || selectedIff?.status === "unknown";
  const needsCommander = breachTotal > 0 || command.riskScore >= 70;
  const requiredRank = needsCommander ? 3 : needsSupervisor ? 2 : 1;
  const authorityOk = rank >= requiredRank;

  const threshold = els.notifyThreshold.value;
  const notifyRequired =
    selected &&
    ((threshold === "alert" && selectedRisk.level === "alert") ||
      (threshold === "breach" && breachTotal > 0) ||
      (threshold === "unidentified" && selectedRisk.level === "alert" && selectedIff.status === "unknown"));

  const closureRule = els.closureRule.value;
  const departed = selected ? distance(selected) > Number(els.radiusInput.value) + 160 : false;
  const closureEligible =
    selected &&
    ((closureRule === "reviewed" && selected.reviewed && notePresent) ||
      (closureRule === "friendly" && selectedIff.status === "friendly") ||
      (closureRule === "departed" && departed && selectedRisk.level !== "alert"));

  const notified = selected ? Boolean(state.commandNotifications[selected.id]) : false;
  const closed = selected ? Boolean(state.closedIncidents[selected.id]) : false;
  const decision = !selected
    ? "Select track"
    : closed
    ? "Closed"
    : !authorityOk
    ? "Escalate authority"
    : notifyRequired && !notified
    ? "Notify command"
    : closureEligible
    ? "May close"
    : selectedRisk.level === "alert"
    ? "Continue review"
    : "Monitor";

  return {
    command,
    iff,
    selected,
    selectedRisk,
    selectedIff,
    breachTotal,
    notePresent,
    authority,
    authorityOk,
    requiredRank,
    notifyRequired,
    notified,
    closureEligible,
    closed,
    decision,
  };
}

function commanderDashboardAnalysis() {
  const command = commandAnalysis();
  const leader = leaderAnalysis();
  const weather = weatherState();
  const roe = roeAnalysis();
  const fusion = sensorFusionAnalysis();
  const comms = commsState();
  const checklistItems = Array.from(document.querySelectorAll("[data-check]"));
  const checklistDone = checklistItems.filter((item) => item.checked).length;
  const operatorLoad = state.events.length + command.counts.alert * 5 + command.counts.watch * 2 + weather.impact * 0.08 + comms.impact * 0.12;
  const operatorStatus =
    operatorLoad >= 45 ? "Overloaded" : checklistDone < checklistItems.length && command.counts.alert > 0 ? "Needs checklist" : "Ready";

  const queue = state.tracks
    .map((track) => {
      const risk = riskFor(track);
      const iff = iffMatchFor(track);
      const eta = etaToZone(track);
      const closed = Boolean(state.closedIncidents[track.id]);
      const notified = Boolean(state.commandNotifications[track.id]);
      const priority =
        risk.score +
        (risk.level === "alert" ? 35 : risk.level === "watch" ? 15 : 0) +
        (iff.status === "unknown" ? 12 : iff.status === "friendly" ? -20 : 4) +
        (notified ? -6 : 0) +
        (closed ? -50 : 0);
      return { track, risk, iff, eta, closed, notified, priority: Math.round(priority), sector: sectorFor(track) };
    })
    .filter((item) => !item.closed && (item.risk.level !== "clear" || item.iff.status !== "friendly"))
    .sort((a, b) => b.priority - a.priority);

  const status =
    command.riskScore >= 70 || operatorStatus === "Overloaded"
      ? "Command attention"
      : queue.length > 0
      ? "Active queue"
      : "Stable";

  const priorities = [
    leader.priority ? `AI Leader: ${leader.priority.track.id}` : "AI Leader: no active priority",
    `ROE: ${roe.decision}`,
    `Fusion: ${fusion.qualityLabel} ${fusion.confidence}`,
    `Weather: ${weatherLabel(weather)} ${weather.impact}`,
  ];

  return { command, leader, weather, comms, roe, fusion, operatorStatus, queue, status, priorities, checklistDone, checklistTotal: checklistItems.length };
}

function airportDefenseAnalysis() {
  const mode = platformModeConfig();
  const dashboard = commanderDashboardAnalysis();
  const scenario = activeScenario();
  const selected = selectedTrack();
  const selectedRisk = selected ? riskFor(selected) : null;
  const alertCount = dashboard.command.counts.alert;
  const watchCount = dashboard.command.counts.watch;
  const breachTotal = Object.values(state.breaches).reduce((total, count) => total + count, 0);
  const airportMode = state.activeTrainingScenario === "airport" || els.scenarioPreset.value === "airport";
  const highestPriority = dashboard.queue[0];
  const airportRisk = Math.min(
    100,
    dashboard.command.riskScore + (airportMode ? 12 : 0) + alertCount * 8 + breachTotal * 10 + (dashboard.weather.impact > 45 ? 8 : 0)
  );
  const status =
    airportRisk >= 80
      ? "Airport defense critical"
      : airportRisk >= 55
      ? "Airport defense active"
      : airportMode || watchCount
      ? "Airport watch"
      : "Airport stable";

  const runwayReadiness =
    alertCount > 1 || breachTotal > 0
      ? "Degraded"
      : alertCount === 1 || dashboard.weather.impact >= 60
      ? "Caution"
      : "Ready";
  const approachCorridor =
    highestPriority && highestPriority.sector !== "Core"
      ? `${highestPriority.sector} watch`
      : alertCount > 0
      ? "Core watch"
      : "Clear";
  const atcCoordination = alertCount > 0 || breachTotal > 0 || airportRisk >= 55 ? "Required" : "Standby";
  const responderPosture =
    airportRisk >= 80
      ? "Incident cell active"
      : airportRisk >= 55
      ? "Authorized teams alerted"
      : "Monitoring";

  const responseContext = { airportRisk, alertCount, watchCount, breachTotal, atcCoordination };
  const responseCell = mode.responseUnits.map((unit) => ({
    unit: unit.unit,
    role: unit.role,
    status: unit.statusFor(responseContext),
  }));

  const workflow = [
    {
      step: "Detect and classify",
      detail: highestPriority ? `${highestPriority.track.id} priority ${highestPriority.priority}` : "No priority track",
      tone: highestPriority ? "watch" : "ready",
    },
    {
      step: "Protect runway operations",
      detail: `Runway ${runwayReadiness.toLowerCase()}, corridor ${approachCorridor.toLowerCase()}`,
      tone: runwayReadiness === "Degraded" ? "hot" : runwayReadiness === "Caution" ? "watch" : "ready",
    },
    {
      step: "Coordinate authorized responders",
      detail: responderPosture,
      tone: airportRisk >= 55 ? "watch" : "ready",
    },
    {
      step: "Record and hand off",
      detail: dashboard.roe.decision,
      tone: dashboard.roe.notifyRequired && !dashboard.roe.notified ? "hot" : "ready",
    },
  ];

  const nextAction =
    atcCoordination === "Required" && dashboard.roe.notifyRequired && !dashboard.roe.notified
      ? "Notify ATC and command, keep runway status under review."
      : airportRisk >= 80
      ? "Activate airport incident cell and preserve evidence chain."
      : highestPriority
      ? `Assign ${mode.label.toLowerCase()} response cell to ${highestPriority.track.id} and continue classification.`
      : "Maintain airport watch and keep authorized teams on standby.";

  return {
    mode,
    airportMode,
    airportRisk,
    status,
    runwayReadiness,
    approachCorridor,
    atcCoordination,
    responderPosture,
    responseCell,
    workflow,
    nextAction,
    selected,
    selectedRisk,
  };
}

function auditAnalysis() {
  const notifications = Object.keys(state.commandNotifications).length;
  const closures = Object.keys(state.closedIncidents).length;
  const notes = Object.values(state.notes).filter((note) => note.trim()).length;
  const acknowledgements = state.responses.length;
  const approvals = notifications + closures;
  const score = Math.min(100, Math.round(state.evidenceRecords.length * 14 + notes * 10 + acknowledgements * 12 + approvals * 16));
  const status = score >= 80 ? "Audit ready" : score >= 50 ? "Partial chain" : "Needs evidence";
  return { notifications, closures, notes, acknowledgements, approvals, score, status };
}

function recordEvidencePoint(reason = "Manual evidence point") {
  const track = selectedTrack();
  const risk = track ? riskFor(track) : null;
  const record = {
    id: `EV-${String(state.evidenceRecords.length + 1).padStart(3, "0")}`,
    time: new Date().toISOString(),
    officer: els.evidenceOfficer.value || "Duty officer",
    trackId: track?.id || "none",
    risk: risk?.label || "n/a",
    note: track ? state.notes[track.id] || "" : "",
    decision: roeAnalysis().decision,
    reason,
  };
  state.evidenceRecords.push(record);
  addEvent(`Evidence recorded: ${record.id}`);
}

function leaderV2Analysis() {
  const leader = leaderAnalysis();
  const dashboard = commanderDashboardAnalysis();
  const audit = auditAnalysis();
  const horizon = els.forecastHorizon.value;
  const multiplier = horizon === "long" ? 1.45 : horizon === "medium" ? 1.2 : 1;
  const riskValue = Math.min(
    100,
    Math.round(dashboard.command.riskScore * multiplier + dashboard.weather.impact * 0.12 + dashboard.comms.impact * 0.16)
  );
  const riskLabel = riskValue >= 75 ? "High" : riskValue >= 45 ? "Elevated" : riskValue >= 25 ? "Caution" : "Stable";
  const staffing =
    dashboard.queue.length >= 5 || dashboard.operatorStatus === "Overloaded"
      ? "Add second operator"
      : dashboard.queue.length >= 2
      ? "Supervisor watch"
      : "Single operator ok";
  const critique =
    audit.score < 50
      ? "Evidence chain needs stronger records"
      : dashboard.checklistDone < dashboard.checklistTotal
      ? "Checklist discipline incomplete"
      : leader.fusion.confidence < 60
      ? "Sensor corroboration needed"
      : "Training flow is coherent";
  return { leader, dashboard, audit, horizon, riskValue, riskLabel, staffing, critique };
}

function offlineSnapshot() {
  return {
    savedAt: new Date().toISOString(),
    sessionId: state.sessionId,
    tracks: state.tracks,
    selectedId: state.selectedId,
    events: state.events,
    notes: state.notes,
    breaches: state.breaches,
    responses: state.responses,
    reviewMarkers: state.reviewMarkers,
    friendlyRegistry: state.friendlyRegistry,
    commandNotifications: state.commandNotifications,
    closedIncidents: state.closedIncidents,
    evidenceRecords: state.evidenceRecords,
    platformMode: state.platformMode,
    activeTrainingScenario: state.activeTrainingScenario,
  };
}

function restoreOfflineSnapshot(snapshot) {
  state.tracks = snapshot.tracks || state.tracks;
  state.selectedId = snapshot.selectedId || state.selectedId;
  state.events = snapshot.events || [];
  state.notes = snapshot.notes || {};
  state.breaches = snapshot.breaches || {};
  state.responses = snapshot.responses || [];
  state.reviewMarkers = snapshot.reviewMarkers || [];
  state.friendlyRegistry = snapshot.friendlyRegistry || [];
  state.commandNotifications = snapshot.commandNotifications || {};
  state.closedIncidents = snapshot.closedIncidents || {};
  state.evidenceRecords = snapshot.evidenceRecords || [];
  state.platformMode = snapshot.platformMode || state.platformMode;
  state.activeTrainingScenario = snapshot.activeTrainingScenario || state.activeTrainingScenario;
  state.lastOfflineSave = snapshot.savedAt || null;
}

function redTeamAnalysis() {
  const pattern = activeRedTeamPattern();
  const intensity = Number(els.redTeamIntensity.value);
  const redTracks = state.tracks.filter((track) => track.redTeam);
  const decoys = redTracks.filter((track) => track.redTeam.decoy);
  const lowAltitude = redTracks.filter((track) => track.redTeam.lowAltitude);
  const weatherMasked = redTracks.filter((track) => track.redTeam.weatherMasked);
  const pressureScore = Math.min(100, redTracks.length * 8 + intensity * 12 + decoys.length * 5 + lowAltitude.length * 6 + weatherMasked.length * 8);
  const pressure = pressureScore >= 70 ? "High" : pressureScore >= 40 ? "Elevated" : "Low";
  return { pattern, intensity, redTracks, decoys, lowAltitude, weatherMasked, pressure, pressureScore };
}

function nextEtaTrack() {
  return state.tracks.reduce((best, track) => {
    const eta = etaToZone(track);
    if (!Number.isFinite(eta)) return best;
    if (!best || eta < best.eta) return { track, eta };
    return best;
  }, null);
}

function riskCounts() {
  return state.tracks.reduce(
    (counts, track) => {
      counts[riskFor(track).level] += 1;
      return counts;
    },
    { alert: 0, watch: 0, clear: 0 }
  );
}

function safeRecommendation(risk) {
  if (risk.level === "alert") {
    return trackAcknowledgedText("Recommended workflow: notify the operator, verify the track visually, preserve evidence, and coordinate with authorized airspace contacts.");
  }
  if (risk.level === "watch") {
    return "Recommended workflow: keep monitoring, compare movement against the protected zone, and prepare an incident note if risk increases.";
  }
  return "Recommended workflow: continue passive monitoring and mark reviewed when the track is explained or leaves the area.";
}

function trackAcknowledgedText(text) {
  const track = selectedTrack();
  return track?.acknowledged ? `${text} Alert acknowledged.` : text;
}

function updateTracks(deltaSeconds) {
  if (state.paused) return;
  const weather = weatherState();
  const windDirection = Math.PI * 0.18;
  const windDrift = weather.wind * 0.08;

  for (const track of state.tracks) {
    track.trail.push({ x: track.x, y: track.y });
    if (track.trail.length > 80) track.trail.shift();

    const turbulenceJitter = rand(-0.015, 0.015) * weather.turbulence;
    track.heading += turbulenceJitter * deltaSeconds * state.speed;
    track.x +=
      Math.cos(track.heading) * track.speed * deltaSeconds * state.speed +
      Math.cos(windDirection) * windDrift * deltaSeconds;
    track.y +=
      Math.sin(track.heading) * track.speed * deltaSeconds * state.speed +
      Math.sin(windDirection) * windDrift * deltaSeconds;

    const insideZone = distance(track) <= Number(els.radiusInput.value);
    if (insideZone && !track.wasInsideZone) {
      state.breaches[track.id] = (state.breaches[track.id] || 0) + 1;
      addEvent(`Protected-zone breach simulated for ${track.id}`);
    }
    track.wasInsideZone = insideZone;

    if (distance(track) > 440) {
      track.heading += Math.PI + rand(-0.5, 0.5);
    }
  }
}

function updateAlertTimers() {
  for (const track of state.tracks) {
    const risk = riskFor(track);
    if (risk.level === "alert" && !state.firstAlertAt[track.id]) {
      state.firstAlertAt[track.id] = Date.now();
      addEvent(`Training timer started for ${track.id}`);
    }
  }
}

function drawGrid() {
  const weather = weatherState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0d1113";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#243038";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const zone = Number(els.radiusInput.value);
  const center = metersToCanvas(0, 0);
  const scale = Math.min(canvas.width, canvas.height) / 880;

  ctx.strokeStyle = "#52c7e8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, zone * scale, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#52c7e81c";
  ctx.fill();

  ctx.fillStyle = "#edf4f6";
  ctx.beginPath();
  ctx.arc(center.x, center.y, 5, 0, Math.PI * 2);
  ctx.fill();

  if (weather.impact > 10) {
    ctx.fillStyle = `rgba(159, 176, 184, ${Math.min(weather.impact / 240, 0.34)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (weather.visibility < 5000) {
    const visibilityRadius = Math.max(25, Math.min(weather.visibility, 5000) * scale);
    ctx.strokeStyle = "rgba(245, 191, 79, 0.65)";
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, visibilityRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function drawTracks() {
  for (const track of state.tracks) {
    const point = metersToCanvas(track.x, track.y);
    const risk = riskFor(track);
    const selected = track.id === state.selectedId;
    const color = risk.level === "alert" ? "#ff6b6b" : risk.level === "watch" ? "#f5bf4f" : "#58d68d";

    if (track.trail.length > 1) {
      ctx.strokeStyle = `${color}80`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      track.trail.forEach((trailPoint, index) => {
        const p = metersToCanvas(trailPoint.x, trailPoint.y);
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(track.heading);
    ctx.fillStyle = color;
    ctx.strokeStyle = selected ? "#ffffff" : "#0d1113";
    ctx.lineWidth = selected ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(-9, -7);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-9, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#d8e5e9";
    ctx.font = "12px Arial";
    ctx.fillText(track.id, point.x + 12, point.y - 12);
  }
}

function draw() {
  drawGrid();
  drawTracks();
}

function renderDetails() {
  const track = state.tracks.find((item) => item.id === state.selectedId);
  if (!track) {
    els.selectedBadge.textContent = "None";
    els.trackDetails.innerHTML = "<dt>Status</dt><dd>No track selected</dd>";
    els.recommendation.textContent = "Select a track to review the recommended defensive workflow.";
    els.operatorNote.value = "";
    return;
  }

  const risk = riskFor(track);
  els.selectedBadge.textContent = track.id;
  els.trackDetails.innerHTML = `
    <dt>Risk</dt><dd class="risk ${risk.level}">${risk.label.toUpperCase()} ${risk.score}</dd>
    <dt>Range</dt><dd>${Math.round(distance(track))} m</dd>
    <dt>Altitude</dt><dd>${Math.round(track.altitude)} m</dd>
    <dt>Speed</dt><dd>${Math.round(track.speed)} m/s</dd>
    <dt>ETA</dt><dd>${formatEta(etaToZone(track))}</dd>
    <dt>Ack</dt><dd>${track.acknowledged ? "Yes" : "No"}</dd>
    <dt>Breaches</dt><dd>${state.breaches[track.id] || 0}</dd>
    <dt>Action</dt><dd>${risk.level === "alert" ? "Notify" : "Monitor"}</dd>
  `;
  els.recommendation.textContent = safeRecommendation(risk);
  els.operatorNote.value = state.notes[track.id] || "";
}

function renderList() {
  els.trackList.innerHTML = "";
  const filter = els.riskFilter.value;
  const nearest = nearestTrack();
  const visibleTracks = state.tracks.filter((track) => {
    const level = riskFor(track).level;
    return filter === "all" || level === filter;
  });

  if (!visibleTracks.length) {
    els.trackList.innerHTML = '<div class="empty-state">No tracks match this filter.</div>';
    return;
  }

  for (const track of visibleTracks) {
    const risk = riskFor(track);
    const card = document.createElement("button");
    card.className = `track-card ${track.id === state.selectedId ? "selected" : ""} ${
      nearest && track.id === nearest.id ? "nearest" : ""
    } ${track.acknowledged ? "acknowledged" : ""}`;
    card.type = "button";
    card.innerHTML = `
      <strong>${track.id}<span class="risk ${risk.level}">${risk.label}</span></strong>
      <span class="track-meta"><span>${Math.round(distance(track))} m / ${Math.round(track.altitude)} m alt</span><span>ETA ${formatEta(etaToZone(track))}</span></span>
    `;
    card.addEventListener("click", () => {
      state.selectedId = track.id;
      render();
    });
    els.trackList.appendChild(card);
  }
}

function renderLog() {
  els.eventLog.innerHTML = "";
  for (const event of state.events.slice(-8).reverse()) {
    const li = document.createElement("li");
    li.textContent = `${event.time} ${event.message}`;
    els.eventLog.appendChild(li);
  }
}

function reviewFocusFor(message) {
  if (message.includes("breach")) return "Discuss detection timing, notification path, and evidence capture.";
  if (message.includes("acknowledged")) return "Confirm the acknowledgement was paired with visual review and notes.";
  if (message.includes("Checklist")) return "Check whether each checklist item reflects an actual operator action.";
  if (message.includes("report") || message.includes("summary")) return "Review whether the report is clear enough for handoff.";
  if (message.includes("drill")) return "Observe how quickly the trainee identifies and prioritizes the inject.";
  return "Review context, decision quality, and whether the log supports the operator's conclusion.";
}

function selectedReviewEvent() {
  if (!state.events.length) return null;
  const index = Math.min(Math.max(state.reviewIndex, 0), state.events.length - 1);
  return { index, event: state.events[index] };
}

function formatEta(seconds) {
  if (seconds === 0) return "inside";
  if (!Number.isFinite(seconds)) return "--";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function renderChecklist() {
  const checks = Array.from(document.querySelectorAll("[data-check]"));
  const done = checks.filter((item) => item.checked).length;
  els.checklistStatus.textContent = `${done}/${checks.length} complete`;
}

function trainingMetrics() {
  const checks = Array.from(document.querySelectorAll("[data-check]"));
  const checklistDone = checks.filter((item) => item.checked).length;
  const alertTracks = state.tracks.filter((track) => riskFor(track).level === "alert");
  const acknowledgedAlerts = alertTracks.filter((track) => track.acknowledged).length;
  const notesSaved = Object.values(state.notes).filter((note) => note.trim().length > 0).length;
  const reportsGenerated = state.events.some(
    (event) => event.message.includes("Incident report generated") || event.message.includes("Training summary generated")
  );
  const avgResponse =
    state.responses.length > 0
      ? Math.round(state.responses.reduce((total, response) => total + response.seconds, 0) / state.responses.length)
      : null;

  const objectives = [
    {
      label: "Acknowledge every active alert",
      done: alertTracks.length === 0 || acknowledgedAlerts === alertTracks.length,
    },
    {
      label: "Complete operator checklist",
      done: checklistDone === checks.length,
    },
    {
      label: "Record at least one operator note",
      done: notesSaved > 0,
    },
    {
      label: "Generate a report or training summary",
      done: reportsGenerated,
    },
    {
      label: "Keep average response under 60 seconds",
      done: avgResponse !== null && avgResponse <= 60,
    },
  ];

  const score = Math.round((objectives.filter((objective) => objective.done).length / objectives.length) * 100);
  return { objectives, score, avgResponse };
}

function academyMetrics() {
  const metrics = trainingMetrics();
  const modules = Array.from(document.querySelectorAll("[data-module]"));
  const completedModules = modules.filter((module) => module.checked).length;
  const moduleScore = modules.length ? Math.round((completedModules / modules.length) * 100) : 0;
  const markerScore = Math.min(state.reviewMarkers.length * 20, 100);
  const responseScore =
    metrics.avgResponse === null ? 0 : Math.max(0, Math.min(100, Math.round(100 - Math.max(metrics.avgResponse - 30, 0))));
  const proficiency = Math.round(metrics.score * 0.45 + moduleScore * 0.3 + markerScore * 0.15 + responseScore * 0.1);
  const level = els.trainingLevel.value;
  const required = level === "supervisor" ? 85 : level === "operator" ? 75 : 65;
  const certified = proficiency >= required && completedModules === modules.length;

  const skills = [
    { label: "Detection discipline", value: metrics.score },
    { label: "Documentation", value: moduleScore },
    { label: "Review coaching", value: markerScore },
    { label: "Response timing", value: responseScore },
  ];

  return { completedModules, modulesTotal: modules.length, proficiency, required, certified, skills };
}

function certificationLabel(metrics) {
  if (metrics.certified) return "Certified";
  if (metrics.proficiency >= metrics.required - 10) return "Near ready";
  return "Pending";
}

function leaderAnalysis() {
  const tracks = state.tracks
    .map((track) => {
      const risk = riskFor(track);
      const eta = etaToZone(track);
      const note = state.notes[track.id] || "";
      const score =
        risk.score +
        (risk.level === "alert" ? 35 : risk.level === "watch" ? 15 : 0) +
        (eta === 0 ? 25 : Number.isFinite(eta) ? Math.max(0, 20 - Math.min(eta, 120) / 6) : 0) +
        (track.acknowledged ? -18 : 0) +
        (track.reviewed ? -30 : 0) +
        (note.trim() ? -5 : 8);
      return { track, risk, eta, score: Math.round(score) };
    })
    .sort((a, b) => b.score - a.score);

  const priority = tracks[0] || null;
  const metrics = trainingMetrics();
  const academy = academyMetrics();
  const weather = weatherState();
  const comms = commsState();
  const fusion = sensorFusionAnalysis();
  const activeAlerts = tracks.filter((item) => item.risk.level === "alert" && !item.track.reviewed);
  const unacknowledged = activeAlerts.filter((item) => !item.track.acknowledged);
  const openObjectives = metrics.objectives.filter((objective) => !objective.done);
  const confidence = Math.min(
    99,
    Math.max(
      35,
      Math.round(
        55 +
          state.events.length * 2 +
          state.reviewMarkers.length * 4 +
          academy.proficiency * 0.25 -
          weather.impact * 0.22 -
          comms.impact * 0.18
      )
    )
  );

  let mode = "Observe";
  let action = "Keep monitoring and maintain a clean log.";
  if (unacknowledged.length) {
    mode = "Coach";
    action = `Acknowledge ${unacknowledged[0].track.id}, verify context, and record the operator note.`;
  } else if (comms.impact >= 70) {
    mode = "Comms";
    action = "Slow the training tempo, verify delayed feeds, and capture a comms brief.";
  } else if (fusion.confidence < 55) {
    mode = "Fusion";
    action = "Treat track picture as sensor-limited; compare feeds and capture a fusion brief.";
  } else if (weather.impact >= 65) {
    mode = "Weather";
    action = "Reduce training tempo, verify visual assumptions, and mark weather-limited observations.";
  } else if (activeAlerts.length) {
    mode = "Coordinate";
    action = "Confirm checklist coverage and prepare authorized notification or closeout.";
  } else if (openObjectives.length) {
    mode = "Train";
    action = `Close training objective: ${openObjectives[0].label}.`;
  } else if (academy.certified) {
    mode = "Certify";
    action = "Generate certificate and archive the academy record.";
  }

  return { tracks, priority, confidence, mode, action, metrics, academy, weather, comms, fusion, openObjectives };
}

function leaderBriefText() {
  const analysis = leaderAnalysis();
  const priority = analysis.priority;
  const watch = analysis.tracks.slice(0, 4);
  return [
    "AI Leader Training Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Mode: ${analysis.mode}`,
    `Confidence: ${analysis.confidence}`,
    `Weather: ${weatherLabel(analysis.weather)} (${analysis.weather.impact})`,
    "",
    `Priority: ${
      priority
        ? `${priority.track.id} (${priority.risk.label.toUpperCase()} ${priority.risk.score}, ETA ${formatEta(priority.eta)})`
        : "No active tracks"
    }`,
    `Next defensive action: ${analysis.action}`,
    "",
    "Watchlist:",
    ...(watch.length
      ? watch.map((item) => `- ${item.track.id}: ${item.risk.label}, range ${Math.round(distance(item.track))} m, ETA ${formatEta(item.eta)}`)
      : ["- No tracks available."]),
    "",
    "Training gaps:",
    ...(analysis.openObjectives.length ? analysis.openObjectives.map((objective) => `- ${objective.label}`) : ["- No open objectives."]),
    "",
    "Training boundary:",
    "AI Leader provides coaching, prioritization, and record review for simulated defensive command training only.",
  ].join("\n");
}

function renderTraining() {
  const metrics = trainingMetrics();
  els.sessionId.textContent = state.sessionId;
  els.trainingGrade.textContent = `Score ${metrics.score}`;
  els.trainingGrade.className = metrics.score >= 80 ? "score good" : metrics.score >= 50 ? "score fair" : "score needs-work";
  els.avgResponse.textContent = metrics.avgResponse === null ? "--" : `${metrics.avgResponse}s`;
  els.injectCount.textContent = String(state.injects);
  els.objectiveList.innerHTML = "";

  for (const objective of metrics.objectives) {
    const item = document.createElement("div");
    item.className = `objective ${objective.done ? "done" : ""}`;
    item.innerHTML = `<span>${objective.done ? "PASS" : "OPEN"}</span><strong>${objective.label}</strong>`;
    els.objectiveList.appendChild(item);
  }
}

function renderReview() {
  const max = Math.max(state.events.length - 1, 0);
  state.reviewIndex = Math.min(state.reviewIndex, max);
  els.reviewTimeline.max = String(max);
  els.reviewTimeline.value = String(state.reviewIndex);
  els.reviewStatus.textContent = `${state.reviewMarkers.length} markers`;

  const selected = selectedReviewEvent();
  if (!selected) {
    els.reviewTime.textContent = "No events";
    els.reviewEvent.textContent = "No event selected";
    els.reviewFocus.textContent = "Build a clean training record.";
  } else {
    els.reviewTime.textContent = selected.event.elapsed;
    els.reviewEvent.textContent = selected.event.message;
    els.reviewFocus.textContent = reviewFocusFor(selected.event.message);
  }

  els.reviewMarkers.innerHTML = "";
  if (!state.reviewMarkers.length) {
    els.reviewMarkers.innerHTML = '<div class="empty-state">No review markers captured yet.</div>';
    return;
  }

  for (const marker of state.reviewMarkers.slice(-6).reverse()) {
    const item = document.createElement("div");
    item.className = "review-marker";
    item.innerHTML = `<span>${marker.elapsed}</span><strong>${marker.message}</strong><small>${marker.focus}</small>`;
    els.reviewMarkers.appendChild(item);
  }
}

function renderAcademy() {
  const metrics = academyMetrics();
  els.proficiencyScore.textContent = `${metrics.proficiency}`;
  els.moduleCount.textContent = `${metrics.completedModules}/${metrics.modulesTotal}`;
  els.certLevel.textContent = certificationLabel(metrics);
  els.certStatus.textContent = metrics.certified ? "Ready for certificate" : `Needs ${metrics.required}+`;
  els.certStatus.className = metrics.certified ? "score good" : metrics.proficiency >= metrics.required - 10 ? "score fair" : "score needs-work";
  els.skillMatrix.innerHTML = "";

  for (const skill of metrics.skills) {
    const item = document.createElement("div");
    item.className = "skill-row";
    item.innerHTML = `
      <span>${skill.label}</span>
      <strong>${skill.value}</strong>
      <i style="--skill-width: ${skill.value}%"></i>
    `;
    els.skillMatrix.appendChild(item);
  }
}

function renderLeader() {
  const analysis = leaderAnalysis();
  const priority = analysis.priority;
  els.leaderConfidence.textContent = `Confidence ${analysis.confidence}`;
  els.leaderConfidence.className =
    analysis.confidence >= 80 ? "score good" : analysis.confidence >= 60 ? "score fair" : "score needs-work";
  els.leaderPriority.textContent = priority
    ? `${priority.track.id} / ${priority.risk.label.toUpperCase()} ${priority.risk.score}`
    : "None";
  els.leaderMode.textContent = analysis.mode;
  els.leaderAction.textContent = analysis.action;
  els.leaderBrief.textContent = priority
    ? `AI Leader recommends prioritizing ${priority.track.id}. Keep actions limited to observation, acknowledgement, evidence logging, and authorized handoff.`
    : "AI Leader is waiting for scenario data.";

  els.leaderWatchlist.innerHTML = "";
  for (const item of analysis.tracks.slice(0, 5)) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `leader-watch ${item.risk.level}`;
    row.innerHTML = `<strong>${item.track.id}</strong><span>${item.risk.label} ${item.risk.score}</span><small>ETA ${formatEta(
      item.eta
    )} / ${Math.round(distance(item.track))} m</small>`;
    row.addEventListener("click", () => {
      state.selectedId = item.track.id;
      addEvent(`AI Leader selected ${item.track.id} for review`);
      render();
    });
    els.leaderWatchlist.appendChild(row);
  }
}

function renderWeather() {
  const weather = weatherState();
  const route = weatherRouteAdvisory();
  els.windValue.textContent = `${weather.wind} kt`;
  els.visibilityValue.textContent = `${weather.visibility} m`;
  els.turbulenceValue.textContent = `${weather.turbulence}/10`;
  els.weatherImpact.textContent = `${weatherLabel(weather)} ${weather.impact}`;
  els.weatherImpact.className =
    weather.impact >= 65 ? "score needs-work" : weather.impact >= 35 ? "score fair" : "score good";

  if (weather.visibility < 900) {
    els.weatherOperatorEffect.textContent = "Visual confirmation is degraded; require stronger notes and review markers.";
  } else if (weather.wind > 25 || weather.turbulence > 6) {
    els.weatherOperatorEffect.textContent = "Track movement may look unstable; review ETA and trend before closeout.";
  } else {
    els.weatherOperatorEffect.textContent = "Normal scan quality.";
  }

  if (weather.impact >= 65) {
    els.weatherSimulationEffect.textContent = "Track drift and visibility overlay are severe for training.";
  } else if (weather.impact >= 35) {
    els.weatherSimulationEffect.textContent = "Moderate drift, turbulence, or reduced visibility is active.";
  } else {
    els.weatherSimulationEffect.textContent = "Stable tracks.";
  }

  els.weatherRouteAdvisor.textContent = route.action;
}

function renderCommand() {
  const command = commandAnalysis();
  els.commandReadiness.textContent = `Readiness ${command.readiness}`;
  els.commandReadiness.className =
    command.readiness >= 75 ? "score good" : command.readiness >= 50 ? "score fair" : "score needs-work";
  els.commanderPriority.textContent = command.leader.priority
    ? `${command.leader.priority.track.id} / ${command.leader.mode}`
    : "None";
  els.missionRisk.textContent = `${command.riskLabel} ${Math.round(command.riskScore)}`;
  els.missionRisk.className =
    command.riskScore >= 70 ? "score needs-work" : command.riskScore >= 40 ? "score fair" : "score good";

  els.roeMatrix.innerHTML = "";
  for (const item of command.roe) {
    const row = document.createElement("div");
    row.className = `roe-row ${item.active ? "active" : ""}`;
    row.innerHTML = `<span>${item.status}</span><strong>${item.label}</strong>`;
    els.roeMatrix.appendChild(row);
  }

  els.sectorGrid.innerHTML = "";
  for (const sector of command.sectors) {
    const card = document.createElement("div");
    card.className = `sector-card ${sector.status}`;
    card.innerHTML = `
      <strong>${sector.name}</strong>
      <span>${sector.tracks} tracks</span>
      <small>${sector.alerts} alert / ${sector.watch} watch</small>
    `;
    els.sectorGrid.appendChild(card);
  }
}

function renderFusion() {
  const fusion = sensorFusionAnalysis();
  els.fusionConfidence.textContent = `Fusion ${fusion.confidence}`;
  els.fusionConfidence.className =
    fusion.confidence >= 78 ? "score good" : fusion.confidence >= 55 ? "score fair" : "score needs-work";
  els.sensorAgreement.textContent = `${fusion.agreement}`;
  els.fusedPriority.textContent = fusion.priority
    ? `${fusion.priority.track.id} / ${fusion.priority.risk.label.toUpperCase()}`
    : "None";
  els.fusionQuality.textContent = fusion.qualityLabel;

  els.sensorFeeds.innerHTML = "";
  for (const feed of fusion.feeds) {
    const card = document.createElement("div");
    card.className = `sensor-feed ${feed.status}`;
    card.innerHTML = `<strong>${feed.label}</strong><span>${feed.quality}</span><i style="--sensor-quality: ${feed.quality}%"></i>`;
    els.sensorFeeds.appendChild(card);
  }

  els.fusionTrackList.innerHTML = "";
  for (const item of fusion.fusedTracks.slice(0, 5)) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `fusion-track ${item.risk.level}`;
    row.innerHTML = `<strong>${item.track.id}</strong><span>Fused ${item.score}</span><small>${item.risk.label} / ETA ${formatEta(
      item.eta
    )}</small>`;
    row.addEventListener("click", () => {
      state.selectedId = item.track.id;
      addEvent(`Fusion selected ${item.track.id} for review`);
      render();
    });
    els.fusionTrackList.appendChild(row);
  }
}

function renderIff() {
  const iff = iffAnalysis();
  els.iffStatus.textContent = `Registry ${iff.registryStatus}`;
  els.iffStatus.className =
    iff.registryStatus === "Complete" ? "score good" : iff.registryStatus === "Partial" ? "score fair" : "score needs-work";
  els.friendlyMatchCount.textContent = String(iff.friendly.length);
  els.unknownTrackCount.textContent = String(iff.unknown.length);
  els.falsePositiveReduction.textContent = `${iff.falsePositiveReduction}%`;

  els.registryList.innerHTML = "";
  if (!state.friendlyRegistry.length) {
    els.registryList.innerHTML = '<div class="empty-state">No friendly registry entries.</div>';
  } else {
    for (const entry of state.friendlyRegistry) {
      const item = document.createElement("div");
      item.className = "registry-card";
      item.innerHTML = `<strong>${entry.id}</strong><span>${entry.name}</span><small>${entry.trackId} / ${entry.corridor}</small>`;
      els.registryList.appendChild(item);
    }
  }

  els.iffTrackList.innerHTML = "";
  for (const item of iff.classifications) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `iff-track ${item.iff.status}`;
    row.innerHTML = `<strong>${item.track.id}</strong><span>${item.iff.label} ${item.iff.confidence || ""}</span><small>${
      item.sector
    } / ${item.risk.label}</small>`;
    row.addEventListener("click", () => {
      state.selectedId = item.track.id;
      addEvent(`IFF selected ${item.track.id} for registry review`);
      render();
    });
    els.iffTrackList.appendChild(row);
  }
}

function renderRoe() {
  const roe = roeAnalysis();
  els.roeDecisionStatus.textContent = roe.decision;
  els.roeDecisionStatus.className =
    roe.decision === "May close" || roe.decision === "Closed"
      ? "score good"
      : roe.decision === "Notify command" || roe.decision === "Escalate authority"
      ? "score needs-work"
      : "score fair";
  els.authorityCheck.textContent = roe.authorityOk ? "Authorized" : "Insufficient";
  els.authorityCheck.className = roe.authorityOk ? "score good" : "score needs-work";

  const cards = [
    {
      label: "Authority",
      value: roe.authorityOk ? "Clear" : `Requires ${roe.requiredRank === 3 ? "commander" : "supervisor"}`,
      tone: roe.authorityOk ? "ready" : "hot",
    },
    {
      label: "Command notification",
      value: roe.notifyRequired ? (roe.notified ? "Recorded" : "Required") : "Not required",
      tone: roe.notifyRequired && !roe.notified ? "hot" : "ready",
    },
    {
      label: "Closure",
      value: roe.closed ? "Closed" : roe.closureEligible ? "Eligible" : "Not yet",
      tone: roe.closed || roe.closureEligible ? "ready" : "watch",
    },
    {
      label: "Selected track",
      value: roe.selected ? `${roe.selected.id} / ${roe.selectedRisk.label}` : "None",
      tone: roe.selectedRisk?.level === "alert" ? "hot" : "ready",
    },
  ];

  els.roeDecisionCards.innerHTML = "";
  for (const card of cards) {
    const item = document.createElement("div");
    item.className = `roe-decision-card ${card.tone}`;
    item.innerHTML = `<span>${card.label}</span><strong>${card.value}</strong>`;
    els.roeDecisionCards.appendChild(item);
  }
}

function renderCommanderDashboard() {
  const dashboard = commanderDashboardAnalysis();
  els.commanderStatus.textContent = dashboard.status;
  els.commanderStatus.className =
    dashboard.status === "Stable" ? "score good" : dashboard.status === "Active queue" ? "score fair" : "score needs-work";
  els.dashboardReadiness.textContent = `${dashboard.command.readiness}`;
  els.dashboardWeather.textContent = `${weatherLabel(dashboard.weather)} ${dashboard.weather.impact}`;
  els.operatorStatus.textContent = dashboard.operatorStatus;
  els.operatorStatus.className =
    dashboard.operatorStatus === "Ready" ? "score good" : dashboard.operatorStatus === "Needs checklist" ? "score fair" : "score needs-work";
  els.incidentQueueCount.textContent = String(dashboard.queue.length);

  els.commanderSectorMap.innerHTML = "";
  for (const sector of dashboard.command.sectors) {
    const card = document.createElement("div");
    card.className = `commander-sector ${sector.status}`;
    card.innerHTML = `<strong>${sector.name}</strong><span>${sector.tracks} tracks</span><small>Load ${sector.load}</small>`;
    els.commanderSectorMap.appendChild(card);
  }

  els.commanderPriorities.innerHTML = "";
  for (const priority of dashboard.priorities) {
    const item = document.createElement("div");
    item.className = "commander-priority";
    item.textContent = priority;
    els.commanderPriorities.appendChild(item);
  }

  els.incidentQueue.innerHTML = "";
  if (!dashboard.queue.length) {
    els.incidentQueue.innerHTML = '<div class="empty-state">Incident queue is clear.</div>';
    return;
  }

  for (const item of dashboard.queue.slice(0, 8)) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `queue-item ${item.risk.level}`;
    row.innerHTML = `<strong>${item.track.id}</strong><span>${item.sector} / ${item.risk.label}</span><small>${
      item.notified ? "notified" : "pending"
    } / ETA ${formatEta(item.eta)}</small>`;
    row.addEventListener("click", () => {
      state.selectedId = item.track.id;
      addEvent(`Commander selected ${item.track.id} from incident queue`);
      render();
    });
    els.incidentQueue.appendChild(row);
  }
}

function renderScenarioLibrary() {
  const catalog = scenarioCatalog();
  const scenario = activeScenario();
  els.scenarioStatus.textContent = scenario.label;
  els.scenarioTempo.textContent = scenario.tempo;
  els.scenarioFocus.textContent = scenario.focus;
  els.scenarioRisk.textContent = scenario.risk;
  els.scenarioRisk.className = scenario.risk === "High" ? "score needs-work" : scenario.risk === "Elevated" ? "score fair" : "score good";

  els.scenarioCards.innerHTML = "";
  for (const [key, item] of Object.entries(catalog)) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `scenario-card ${key === state.activeTrainingScenario ? "active" : ""}`;
    card.innerHTML = `<strong>${item.label}</strong><span>${item.tempo} / ${item.risk}</span><small>${item.focus}</small>`;
    card.addEventListener("click", () => {
      els.trainingScenario.value = key;
      state.activeTrainingScenario = key;
      addEvent(`Scenario selected: ${item.label}`);
      render();
    });
    els.scenarioCards.appendChild(card);
  }

  els.scenarioObjectives.innerHTML = "";
  for (const objective of scenario.objectives) {
    const item = document.createElement("div");
    item.className = "scenario-objective";
    item.textContent = objective;
    els.scenarioObjectives.appendChild(item);
  }
}

function renderPlatformMode() {
  const mode = platformModeConfig();
  els.platformEyebrow.textContent = mode.eyebrow;
  els.platformModeLabel.textContent = mode.label;
  els.platformModeDescription.textContent = mode.description;
  document.querySelectorAll("[data-platform-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.platformMode === state.platformMode);
  });
}

function renderAirportDefense() {
  const airport = airportDefenseAnalysis();
  els.airportDefenseStatus.textContent = `${airport.mode.label}: ${airport.status}`;
  els.airportDefenseStatus.className =
    airport.airportRisk >= 80 ? "score needs-work" : airport.airportRisk >= 55 ? "score fair" : "score good";
  els.runwayReadiness.textContent = airport.runwayReadiness;
  els.runwayReadiness.className =
    airport.runwayReadiness === "Degraded" ? "score needs-work" : airport.runwayReadiness === "Caution" ? "score fair" : "score good";
  els.approachCorridor.textContent = airport.approachCorridor;
  els.atcCoordination.textContent = airport.atcCoordination;
  els.atcCoordination.className = airport.atcCoordination === "Required" ? "score fair" : "score good";
  els.responderPosture.textContent = airport.responderPosture;

  els.responseCell.innerHTML = "";
  for (const unit of airport.responseCell) {
    const item = document.createElement("div");
    item.className = `response-unit ${unit.status === "Lead" || unit.status === "Required" || unit.status === "On tasking" ? "active" : ""}`;
    item.innerHTML = `<strong>${unit.unit}</strong><span>${unit.role}</span><small>${unit.status}</small>`;
    els.responseCell.appendChild(item);
  }

  els.airportWorkflow.innerHTML = "";
  for (const step of airport.workflow) {
    const item = document.createElement("div");
    item.className = `airport-step ${step.tone}`;
    item.innerHTML = `<strong>${step.step}</strong><span>${step.detail}</span>`;
    els.airportWorkflow.appendChild(item);
  }
}

function renderRedTeam() {
  const catalog = redTeamCatalog();
  const analysis = redTeamAnalysis();
  els.redTeamStatus.textContent = analysis.pattern.label;
  els.redTeamIntensityValue.textContent = `${analysis.intensity}/5`;
  els.decoyTrackCount.textContent = String(analysis.decoys.length);
  els.redTeamPressure.textContent = analysis.pressure;
  els.redTeamPressure.className =
    analysis.pressure === "High" ? "score needs-work" : analysis.pressure === "Elevated" ? "score fair" : "score good";

  els.redTeamPatternCards.innerHTML = "";
  for (const [key, item] of Object.entries(catalog)) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `redteam-pattern-card ${key === els.redTeamPattern.value ? "active" : ""}`;
    card.innerHTML = `<strong>${item.label}</strong><span>${item.pressure}</span><small>${item.cues[0]}</small>`;
    card.addEventListener("click", () => {
      els.redTeamPattern.value = key;
      addEvent(`Red-team pattern selected: ${item.label}`);
      render();
    });
    els.redTeamPatternCards.appendChild(card);
  }

  els.redTeamCueList.innerHTML = "";
  for (const cue of analysis.pattern.cues) {
    const item = document.createElement("div");
    item.className = "redteam-cue";
    item.textContent = cue;
    els.redTeamCueList.appendChild(item);
  }
}

function renderComms() {
  const comms = commsState();
  els.latencyValue.textContent = `${comms.latency} ms`;
  els.packetLossValue.textContent = `${comms.packetLoss}%`;
  els.gpsUncertaintyValue.textContent = `${comms.gps} m`;
  els.fatigueValue.textContent = `${comms.fatigue}/10`;
  els.commsStatus.textContent = `${commsLabel(comms)} ${comms.impact}`;
  els.commsStatus.className =
    comms.impact >= 70 ? "score needs-work" : comms.impact >= 35 ? "score fair" : "score good";

  els.commsOperatorEffect.textContent =
    comms.fatigue >= 7 ? "Operator fatigue requires slower pace and checklist discipline." : "Normal workload.";
  els.commsSensorEffect.textContent =
    comms.packetLoss >= 35 || comms.preset === "blackout" ? "Sensor feeds are degraded; compare fusion confidence." : "Feeds stable.";
  els.commsCommandEffect.textContent =
    comms.latency >= 1200 ? "Queue timing may lag; record notification times carefully." : "Queue timing normal.";

  const feeds = [
    { label: "Command link", value: Math.max(0, 100 - comms.latency / 25 - comms.packetLoss), status: comms.latency > 1200 ? "red" : "green" },
    { label: "Sensor feed", value: Math.max(0, 100 - comms.packetLoss * 1.2), status: comms.packetLoss > 35 ? "red" : "green" },
    { label: "Position quality", value: Math.max(0, 100 - comms.gps), status: comms.gps > 45 ? "amber" : "green" },
    { label: "Operator endurance", value: Math.max(0, 100 - comms.fatigue * 9), status: comms.fatigue > 6 ? "amber" : "green" },
  ];

  els.degradedFeedList.innerHTML = "";
  for (const feed of feeds) {
    const card = document.createElement("div");
    card.className = `degraded-feed ${feed.status}`;
    card.innerHTML = `<strong>${feed.label}</strong><span>${Math.round(feed.value)}</span><i style="--feed-quality: ${Math.round(feed.value)}%"></i>`;
    els.degradedFeedList.appendChild(card);
  }
}

function renderAudit() {
  const audit = auditAnalysis();
  els.auditStatus.textContent = audit.status;
  els.auditStatus.className = audit.score >= 80 ? "score good" : audit.score >= 50 ? "score fair" : "score needs-work";
  els.evidenceCount.textContent = String(state.evidenceRecords.length);
  els.auditScore.textContent = `${audit.score}`;
  els.approvalCount.textContent = String(audit.approvals);
  els.evidenceTimeline.innerHTML = "";
  if (!state.evidenceRecords.length) {
    els.evidenceTimeline.innerHTML = '<div class="empty-state">No evidence records yet.</div>';
    return;
  }
  for (const record of state.evidenceRecords.slice(-8).reverse()) {
    const item = document.createElement("div");
    item.className = "evidence-record";
    item.innerHTML = `<strong>${record.id}</strong><span>${record.trackId} / ${record.risk}</span><small>${record.officer} / ${record.decision}</small>`;
    els.evidenceTimeline.appendChild(item);
  }
}

function renderLeaderV2() {
  const v2 = leaderV2Analysis();
  els.leader2Status.textContent = `${v2.riskLabel} forecast`;
  els.leader2Status.className = v2.riskValue >= 75 ? "score needs-work" : v2.riskValue >= 45 ? "score fair" : "score good";
  els.riskForecast.textContent = `${v2.riskLabel} ${v2.riskValue}`;
  els.staffingRecommendation.textContent = v2.staffing;
  els.trainingCritique.textContent = v2.critique;
  els.leader2Cards.innerHTML = "";
  [
    `Commander: ${v2.dashboard.status}`,
    `Queue: ${v2.dashboard.queue.length}`,
    `Audit: ${v2.audit.status}`,
    `Leader mode: ${v2.leader.mode}`,
  ].forEach((text) => {
    const card = document.createElement("div");
    card.className = "leader2-card";
    card.textContent = text;
    els.leader2Cards.appendChild(card);
  });
}

function renderOffline() {
  let storageOk = false;
  try {
    localStorage.setItem("cuas-storage-test", "1");
    localStorage.removeItem("cuas-storage-test");
    storageOk = true;
  } catch {
    storageOk = false;
  }
  els.offlineStatus.textContent = storageOk ? "Offline ready" : "Storage blocked";
  els.offlineStatus.className = storageOk ? "score good" : "score needs-work";
  els.localStorageStatus.textContent = storageOk ? "Available" : "Blocked";
  els.lastOfflineSave.textContent = state.lastOfflineSave ? new Date(state.lastOfflineSave).toLocaleTimeString("bg-BG") : "Never";
  els.fieldPackageState.textContent = state.events.length ? "Ready" : "Empty";
  els.offlineChecklist.innerHTML = "";
  [
    "No network dependency",
    "Local snapshot available",
    "Reports export as local files",
    "Commander dashboard works offline",
  ].forEach((label, index) => {
    const done = index === 0 || index === 2 || index === 3 || Boolean(state.lastOfflineSave);
    const item = document.createElement("div");
    item.className = `offline-item ${done ? "done" : ""}`;
    item.textContent = `${done ? "PASS" : "OPEN"} ${label}`;
    els.offlineChecklist.appendChild(item);
  });
}

function generateReport() {
  const track = selectedTrack();
  if (!track) return "No track selected.";

  const risk = riskFor(track);
  const checks = Array.from(document.querySelectorAll("[data-check]")).map((item) => ({
    label: item.parentElement.textContent.trim(),
    done: item.checked,
  }));

  return [
    "C-UAS Defense Platform Incident Report",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Trainee: ${els.traineeName.value || "Unassigned"}`,
    "",
    `Track: ${track.id}`,
    `Risk: ${risk.label.toUpperCase()} ${risk.score}`,
    `Range: ${Math.round(distance(track))} m`,
    `Altitude: ${Math.round(track.altitude)} m`,
    `Speed: ${Math.round(track.speed)} m/s`,
    `ETA: ${formatEta(etaToZone(track))}`,
    `Acknowledged: ${track.acknowledged ? "Yes" : "No"}`,
    `Simulated zone breaches: ${state.breaches[track.id] || 0}`,
    "",
    "Operator note:",
    state.notes[track.id] || "No note recorded.",
    "",
    "Checklist:",
    ...checks.map((check) => `${check.done ? "[x]" : "[ ]"} ${check.label}`),
    "",
    "Recent log:",
    ...state.events.slice(-6).map((event) => `- ${event.time} ${event.message}`),
  ].join("\n");
}

function generateTrainingSummary() {
  const metrics = trainingMetrics();
  return [
    "C-UAS Defense Platform Training Summary",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Trainee: ${els.traineeName.value || "Unassigned"}`,
    `Score: ${metrics.score}`,
    `Average response: ${metrics.avgResponse === null ? "--" : `${metrics.avgResponse}s`}`,
    `Training injects: ${state.injects}`,
    "",
    "Objectives:",
    ...metrics.objectives.map((objective) => `${objective.done ? "[x]" : "[ ]"} ${objective.label}`),
    "",
    "Response records:",
    ...(state.responses.length
      ? state.responses.map((response) => `- ${response.trackId}: ${response.seconds}s`)
      : ["- No alert acknowledgements recorded."]),
    "",
    "Recent log:",
    ...state.events.slice(-10).map((event) => `- ${event.time} ${event.message}`),
  ].join("\n");
}

function generateAfterActionReview() {
  const metrics = trainingMetrics();
  const breachTotal = Object.values(state.breaches).reduce((total, count) => total + count, 0);
  const openObjectives = metrics.objectives.filter((objective) => !objective.done);

  return [
    "C-UAS Defense Platform After-Action Review",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Trainee: ${els.traineeName.value || "Unassigned"}`,
    `Training score: ${metrics.score}`,
    `Average response: ${metrics.avgResponse === null ? "--" : `${metrics.avgResponse}s`}`,
    `Simulated breaches: ${breachTotal}`,
    `Review markers: ${state.reviewMarkers.length}`,
    "",
    "Marked moments:",
    ...(state.reviewMarkers.length
      ? state.reviewMarkers.map((marker) => `- ${marker.elapsed} ${marker.message} | Focus: ${marker.focus}`)
      : ["- No instructor markers captured."]),
    "",
    "Open training items:",
    ...(openObjectives.length ? openObjectives.map((objective) => `- ${objective.label}`) : ["- None."]),
    "",
    "Instructor notes:",
    "- Confirm the trainee used passive monitoring, clear logging, and authorized notification paths only.",
    "- Review whether the final record supports an evidence-based handoff or closeout decision.",
    "",
    "Recent event timeline:",
    ...state.events.slice(-12).map((event) => `- ${event.elapsed} ${event.message}`),
  ].join("\n");
}

function generateCertificate() {
  const metrics = academyMetrics();
  return [
    "C-UAS Defense Platform Training Certificate",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Trainee: ${els.traineeName.value || "Unassigned"}`,
    `Training level: ${els.trainingLevel.selectedOptions[0].textContent}`,
    `Certification status: ${certificationLabel(metrics)}`,
    `Proficiency score: ${metrics.proficiency}`,
    `Required score: ${metrics.required}`,
    `Completed modules: ${metrics.completedModules}/${metrics.modulesTotal}`,
    "",
    "Training scope:",
    "This certificate covers simulated command monitoring, risk review, logging, authorized notification workflow, and after-action review only.",
    "",
    "Skill matrix:",
    ...metrics.skills.map((skill) => `- ${skill.label}: ${skill.value}`),
  ].join("\n");
}

function generateAcademyRecord() {
  const metrics = academyMetrics();
  const modules = Array.from(document.querySelectorAll("[data-module]")).map((module) => ({
    id: module.dataset.module,
    label: module.parentElement.textContent.trim(),
    complete: module.checked,
  }));

  return [
    "C-UAS Defense Platform Academy Record",
    `Exported: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Trainee: ${els.traineeName.value || "Unassigned"}`,
    `Level: ${els.trainingLevel.value}`,
    `Proficiency: ${metrics.proficiency}`,
    `Certification: ${certificationLabel(metrics)}`,
    "",
    "Modules:",
    ...modules.map((module) => `${module.complete ? "[x]" : "[ ]"} ${module.label}`),
    "",
    "Objectives:",
    ...trainingMetrics().objectives.map((objective) => `${objective.done ? "[x]" : "[ ]"} ${objective.label}`),
    "",
    "AAR markers:",
    ...(state.reviewMarkers.length
      ? state.reviewMarkers.map((marker) => `- ${marker.elapsed} ${marker.message}`)
      : ["- None captured."]),
  ].join("\n");
}

function generateLeaderSnapshot() {
  const analysis = leaderAnalysis();
  return [
    "C-UAS Defense Platform AI Leader Snapshot",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Mode: ${analysis.mode}`,
    `Confidence: ${analysis.confidence}`,
    `Weather: ${weatherLabel(analysis.weather)} ${analysis.weather.impact}`,
    `Next defensive action: ${analysis.action}`,
    "",
    "Ranked watchlist:",
    ...(analysis.tracks.length
      ? analysis.tracks
          .slice(0, 6)
          .map(
            (item, index) =>
              `${index + 1}. ${item.track.id} | ${item.risk.label.toUpperCase()} ${item.risk.score} | ETA ${formatEta(
                item.eta
              )} | leader score ${item.score}`
          )
      : ["No tracks available."]),
    "",
    "Explainability:",
    "- Higher priority reflects simulated risk, ETA, unacknowledged alerts, missing notes, and review status.",
    "- Lower priority reflects acknowledged, reviewed, or documented tracks.",
    "- Output is for training support only.",
  ].join("\n");
}

function generateWeatherBrief() {
  const weather = weatherState();
  const analysis = leaderAnalysis();
  return [
    "C-UAS Defense Platform Weather Training Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Preset: ${els.weatherPreset.selectedOptions[0].textContent}`,
    `Impact: ${weatherLabel(weather)} ${weather.impact}`,
    `Wind: ${weather.wind} kt`,
    `Visibility: ${weather.visibility} m`,
    `Turbulence: ${weather.turbulence}/10`,
    "",
    "Operator guidance:",
    `- ${els.weatherOperatorEffect.textContent}`,
    `- ${analysis.action}`,
    `- Route advisor: ${weatherRouteAdvisory().action}`,
    "- Treat low-visibility observations as training-limited until confirmed by the checklist and notes.",
    "",
    "Simulation guidance:",
    `- ${els.weatherSimulationEffect.textContent}`,
    "- Weather effects are simulated for training review only.",
  ].join("\n");
}

function generateMissionBrief() {
  const command = commandAnalysis();
  return [
    "C-UAS Defense Platform Mission Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Mission profile: ${els.missionProfile.selectedOptions[0].textContent}`,
    `ROE posture: ${els.roePosture.selectedOptions[0].textContent}`,
    `Mission risk: ${command.riskLabel} ${Math.round(command.riskScore)}`,
    `Readiness: ${command.readiness}`,
    `Weather: ${weatherLabel(command.weather)} ${command.weather.impact}`,
    "",
    "Commander priority:",
    command.leader.priority
      ? `- ${command.leader.priority.track.id}: ${command.leader.priority.risk.label.toUpperCase()} ${
          command.leader.priority.risk.score
        }, ETA ${formatEta(command.leader.priority.eta)}`
      : "- No active priority.",
    "",
    "ROE matrix:",
    ...command.roe.map((item) => `- ${item.label}: ${item.status}${item.active ? " / active" : ""}`),
    "",
    "Sector readiness:",
    ...command.sectors.map(
      (sector) =>
        `- ${sector.name}: ${sector.status.toUpperCase()}, ${sector.tracks} tracks, ${sector.alerts} alert, ${sector.watch} watch`
    ),
    "",
    "Command guidance:",
    "- Keep all actions inside passive monitoring, documentation, authorized notification, and handoff workflow.",
    "- Use AI Leader output as decision support, not as automatic authority.",
  ].join("\n");
}

function generateCommandSnapshot() {
  const command = commandAnalysis();
  return [
    "C-UAS Defense Platform Command Snapshot",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Profile: ${command.profile}`,
    `Posture: ${command.posture}`,
    `Risk score: ${Math.round(command.riskScore)}`,
    `Readiness: ${command.readiness}`,
    `Alerts: ${command.counts.alert}`,
    `Watch: ${command.counts.watch}`,
    `Breaches: ${command.breachTotal}`,
    `Weather impact: ${command.weather.impact}`,
    "",
    "Sector load:",
    ...command.sectors.map((sector) => `- ${sector.name}: ${sector.load}`),
    "",
    "Audit note:",
    "Snapshot is for simulated commander review and training records only.",
  ].join("\n");
}

function generateFusionBrief() {
  const fusion = sensorFusionAnalysis();
  return [
    "C-UAS Defense Platform Multi-Sensor Fusion Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Sensor posture: ${els.sensorPosture.selectedOptions[0].textContent}`,
    `Fusion confidence: ${fusion.confidence}`,
    `Sensor agreement: ${fusion.agreement}`,
    `Data quality: ${fusion.qualityLabel}`,
    `Active fault: ${state.sensorFault || "none"}`,
    "",
    "Sensor feeds:",
    ...fusion.feeds.map((feed) => `- ${feed.label}: ${feed.quality} / ${feed.status}`),
    "",
    "Fused tracks:",
    ...(fusion.fusedTracks.length
      ? fusion.fusedTracks
          .slice(0, 6)
          .map((item) => `- ${item.track.id}: fused ${item.score}, ${item.risk.label}, ETA ${formatEta(item.eta)}`)
      : ["- No tracks available."]),
    "",
    "Training guidance:",
    "- Use fusion confidence to decide how much corroboration is needed before closeout or handoff.",
    "- This is simulated sensor-quality assessment only.",
  ].join("\n");
}

function generateIffBrief() {
  const iff = iffAnalysis();
  return [
    "C-UAS Defense Platform IFF / Friendly Registry Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Registry policy: ${els.iffPolicy.selectedOptions[0].textContent}`,
    `Registry status: ${iff.registryStatus}`,
    `Friendly matches: ${iff.friendly.length}`,
    `Unknown tracks: ${iff.unknown.length}`,
    `False-positive reduction: ${iff.falsePositiveReduction}%`,
    "",
    "Registry entries:",
    ...(state.friendlyRegistry.length
      ? state.friendlyRegistry.map((entry) => `- ${entry.id}: ${entry.name}, ${entry.trackId}, corridor ${entry.corridor}`)
      : ["- None."]),
    "",
    "Track classification:",
    ...iff.classifications.map(
      (item) => `- ${item.track.id}: ${item.iff.label} ${item.iff.confidence || ""}, sector ${item.sector}, risk ${item.risk.label}`
    ),
    "",
    "Training guidance:",
    "- Friendly classification reduces false positives but still requires review when sector, notes, or registry confidence are weak.",
    "- This is a simulated registry workflow only.",
  ].join("\n");
}

function generateRoeBrief() {
  const roe = roeAnalysis();
  return [
    "C-UAS Defense Platform Rules of Engagement Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Duty authority: ${els.dutyAuthority.selectedOptions[0].textContent}`,
    `Notify command at: ${els.notifyThreshold.selectedOptions[0].textContent}`,
    `Closure rule: ${els.closureRule.selectedOptions[0].textContent}`,
    "",
    `Selected track: ${roe.selected ? roe.selected.id : "None"}`,
    `Decision: ${roe.decision}`,
    `Authority check: ${roe.authorityOk ? "Authorized" : "Insufficient"}`,
    `Command notification: ${roe.notifyRequired ? (roe.notified ? "Recorded" : "Required") : "Not required"}`,
    `Closure eligible: ${roe.closureEligible ? "Yes" : "No"}`,
    `Closed: ${roe.closed ? "Yes" : "No"}`,
    "",
    "Decision logic:",
    "- Operator may monitor, note, and mark reviewed during normal conditions.",
    "- Supervisor/commander review is required for alert, breach, unidentified alert, or elevated mission risk.",
    "- Incident closure requires the selected closure rule plus an audit trail.",
    "",
    "Training boundary:",
    "This ROE module is for simulated defensive workflow, notification, evidence, and closeout decisions only.",
  ].join("\n");
}

function generateCommanderBrief() {
  const dashboard = commanderDashboardAnalysis();
  return [
    "C-UAS Defense Platform Mission Commander Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Command status: ${dashboard.status}`,
    `Mission readiness: ${dashboard.command.readiness}`,
    `Weather impact: ${weatherLabel(dashboard.weather)} ${dashboard.weather.impact}`,
    `Operator status: ${dashboard.operatorStatus}`,
    `Incident queue: ${dashboard.queue.length}`,
    "",
    "Commander priorities:",
    ...dashboard.priorities.map((priority) => `- ${priority}`),
    "",
    "Sector map:",
    ...dashboard.command.sectors.map(
      (sector) => `- ${sector.name}: ${sector.status.toUpperCase()}, ${sector.tracks} tracks, load ${sector.load}`
    ),
    "",
    "Incident queue:",
    ...(dashboard.queue.length
      ? dashboard.queue
          .slice(0, 8)
          .map((item) => `- ${item.track.id}: ${item.sector}, ${item.risk.label}, ${item.notified ? "notified" : "pending"}`)
      : ["- Clear."]),
    "",
    "Command guidance:",
    "- Use this dashboard for simulated prioritization, readiness review, notification tracking, and audit-ready closeout.",
  ].join("\n");
}

function generateQueueSnapshot() {
  const dashboard = commanderDashboardAnalysis();
  return [
    "C-UAS Defense Platform Incident Queue Snapshot",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Queue count: ${dashboard.queue.length}`,
    `Operator status: ${dashboard.operatorStatus}`,
    "",
    ...(dashboard.queue.length
      ? dashboard.queue.map(
          (item, index) =>
            `${index + 1}. ${item.track.id} | sector ${item.sector} | ${item.risk.label} | priority ${item.priority} | ${
              item.notified ? "notified" : "pending notification"
            }`
        )
      : ["Queue clear."]),
  ].join("\n");
}

function generateScenarioBrief() {
  const scenario = activeScenario();
  const dashboard = commanderDashboardAnalysis();
  return [
    "C-UAS Defense Platform Scenario Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Scenario: ${scenario.label}`,
    `Tempo: ${scenario.tempo}`,
    `Focus: ${scenario.focus}`,
    `Risk: ${scenario.risk}`,
    `Protected zone: ${scenario.radius} m`,
    `Track density: ${scenario.density}`,
    `Weather preset: ${scenario.weather}`,
    `Mission profile: ${scenario.mission}`,
    `ROE posture: ${scenario.roe}`,
    "",
    "Training objectives:",
    ...scenario.objectives.map((objective) => `- ${objective}`),
    "",
    "Current commander status:",
    `- ${dashboard.status}`,
    `- Queue: ${dashboard.queue.length}`,
    `- Operator: ${dashboard.operatorStatus}`,
    "",
    "Training boundary:",
    "Scenario library supports simulated monitoring, classification, defensive workflow, and training records only.",
  ].join("\n");
}

function generateAirportDefenseBrief() {
  const airport = airportDefenseAnalysis();
  return [
    `C-UAS Defense Platform ${airport.mode.briefPrefix} Airport Brief`,
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Platform mode: ${airport.mode.label}`,
    `Airport defense status: ${airport.status}`,
    `Runway readiness: ${airport.runwayReadiness}`,
    `Approach corridor: ${airport.approachCorridor}`,
    `ATC coordination: ${airport.atcCoordination}`,
    `Responder posture: ${airport.responderPosture}`,
    `Next defensive action: ${airport.nextAction}`,
    "",
    "Authorized response cell:",
    ...airport.responseCell.map((unit) => `- ${unit.unit}: ${unit.status} / ${unit.role}`),
    "",
    "Protection workflow:",
    ...airport.workflow.map((step) => `- ${step.step}: ${step.detail}`),
    "",
    "Operational boundary:",
    airport.mode.boundary,
  ].join("\n");
}

function generateRedTeamBrief() {
  const analysis = redTeamAnalysis();
  return [
    "C-UAS Defense Platform Red-Team Training Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Pattern: ${analysis.pattern.label}`,
    `Intensity: ${analysis.intensity}/5`,
    `Training pressure: ${analysis.pressure} ${analysis.pressureScore}`,
    `Red-team tracks: ${analysis.redTracks.length}`,
    `Decoys: ${analysis.decoys.length}`,
    `Low-altitude tracks: ${analysis.lowAltitude.length}`,
    `Weather-masked tracks: ${analysis.weatherMasked.length}`,
    "",
    "Training cues:",
    ...analysis.pattern.cues.map((cue) => `- ${cue}`),
    "",
    "Recent injects:",
    ...(state.redTeamEvents.length
      ? state.redTeamEvents.slice(-5).map((event) => `- ${event.pattern} intensity ${event.intensity}: ${event.created.join(", ")}`)
      : ["- None."]),
    "",
    "Training boundary:",
    "Red-team mode creates simulated training tracks only for operator prioritization, logging, fusion review, and defensive workflow practice.",
  ].join("\n");
}

function generateCommsBrief() {
  const comms = commsState();
  const fusion = sensorFusionAnalysis();
  const dashboard = commanderDashboardAnalysis();
  return [
    "C-UAS Defense Platform Comms Degradation Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Preset: ${els.commsPreset.selectedOptions[0].textContent}`,
    `Impact: ${commsLabel(comms)} ${comms.impact}`,
    `Latency: ${comms.latency} ms`,
    `Packet loss: ${comms.packetLoss}%`,
    `GPS uncertainty: ${comms.gps} m`,
    `Operator fatigue: ${comms.fatigue}/10`,
    "",
    "Effects:",
    `- ${els.commsOperatorEffect.textContent}`,
    `- ${els.commsSensorEffect.textContent}`,
    `- ${els.commsCommandEffect.textContent}`,
    "",
    `Fusion confidence: ${fusion.confidence}`,
    `Commander operator status: ${dashboard.operatorStatus}`,
    "",
    "Training guidance:",
    "- Treat delayed or missing feeds as simulated uncertainty and require stronger notes before closeout.",
    "- Use ROE notification records when command timing is degraded.",
  ].join("\n");
}

function generateEvidencePackage() {
  const audit = auditAnalysis();
  return [
    "C-UAS Defense Platform Audit Evidence Package",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Session: ${state.sessionId}`,
    `Evidence officer: ${els.evidenceOfficer.value || "Duty officer"}`,
    `Audit status: ${audit.status}`,
    `Audit score: ${audit.score}`,
    "",
    "Evidence records:",
    ...(state.evidenceRecords.length
      ? state.evidenceRecords.map((record) => `- ${record.id}: ${record.trackId}, ${record.risk}, ${record.decision}, ${record.officer}`)
      : ["- None."]),
    "",
    "Approvals:",
    `- Command notifications: ${audit.notifications}`,
    `- Closures: ${audit.closures}`,
    `- Acknowledgements: ${audit.acknowledgements}`,
    `- Notes: ${audit.notes}`,
  ].join("\n");
}

function generateLeaderV2Brief() {
  const v2 = leaderV2Analysis();
  return [
    "C-UAS Defense Platform AI Leader v2 Brief",
    `Generated: ${new Date().toLocaleString("bg-BG")}`,
    `Horizon: ${els.forecastHorizon.selectedOptions[0].textContent}`,
    `Risk forecast: ${v2.riskLabel} ${v2.riskValue}`,
    `Staffing recommendation: ${v2.staffing}`,
    `Training critique: ${v2.critique}`,
    "",
    "Commander brief:",
    `- Status: ${v2.dashboard.status}`,
    `- Queue: ${v2.dashboard.queue.length}`,
    `- Operator: ${v2.dashboard.operatorStatus}`,
    "",
    "Safe next action:",
    `- ${v2.leader.action}`,
  ].join("\n");
}

function generateFieldPackage() {
  return JSON.stringify({ packageType: "cuas-field-package", snapshot: offlineSnapshot(), reports: { commander: generateCommanderBrief(), audit: generateEvidencePackage(), leaderV2: generateLeaderV2Brief() } }, null, 2);
}

function render() {
  updateAlertTimers();
  const counts = riskCounts();
  const nearest = nearestTrack();
  const nextEta = nextEtaTrack();
  const breachTotal = Object.values(state.breaches).reduce((total, count) => total + count, 0);
  els.radiusValue.textContent = `${els.radiusInput.value} m`;
  els.densityValue.textContent = `${els.densityInput.value} drones`;
  els.trackCount.textContent = String(state.tracks.length);
  els.alertCount.textContent = String(counts.alert);
  els.watchCount.textContent = String(counts.watch);
  els.closestTrack.textContent = nearest ? `${nearest.id} ${Math.round(distance(nearest))} m` : "None";
  els.zoneLoad.textContent = counts.alert > 0 ? "Alert" : counts.watch > 1 ? "Elevated" : "Normal";
  els.nextEta.textContent = nextEta ? `${nextEta.track.id} ${formatEta(nextEta.eta)}` : "--";
  els.breachCount.textContent = String(breachTotal);
  els.clock.textContent = new Date(Date.now() - state.startedAt).toISOString().slice(11, 19);
  els.pauseBtn.textContent = state.paused ? "Resume scenario" : "Pause scenario";
  renderPlatformMode();
  draw();
  renderDetails();
  renderList();
  renderLog();
  renderChecklist();
  renderTraining();
  renderReview();
  renderAcademy();
  renderLeader();
  renderWeather();
  renderCommand();
  renderFusion();
  renderIff();
  renderRoe();
  renderCommanderDashboard();
  renderScenarioLibrary();
  renderAirportDefense();
  renderRedTeam();
  renderComms();
  renderAudit();
  renderLeaderV2();
  renderOffline();
}

function addEvent(message) {
  const elapsedMs = Math.max(Date.now() - state.startedAt, 0);
  state.events.push({
    time: new Date().toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    elapsed: new Date(elapsedMs).toISOString().slice(11, 19),
    message,
  });
  state.reviewIndex = state.events.length - 1;
}

function selectedTrack() {
  return state.tracks.find((track) => track.id === state.selectedId);
}

let lastTick = performance.now();
function animate(now) {
  const delta = Math.min((now - lastTick) / 1000, 0.08);
  lastTick = now;
  updateTracks(delta);
  render();
  requestAnimationFrame(animate);
}

els.radiusInput.addEventListener("input", render);
els.densityInput.addEventListener("change", resetScenario);
els.resetBtn.addEventListener("click", resetScenario);
els.riskFilter.addEventListener("change", render);

els.operatorNote.addEventListener("input", () => {
  const track = selectedTrack();
  if (track) state.notes[track.id] = els.operatorNote.value;
});

els.scenarioPreset.addEventListener("change", () => {
  const preset = els.scenarioPreset.value;
  const presets = {
    airport: { radius: 210, density: 7, speed: 1 },
    infrastructure: { radius: 170, density: 6, speed: 0.7 },
    event: { radius: 130, density: 9, speed: 0.7 },
    custom: null,
  };

  if (presets[preset]) {
    els.radiusInput.value = presets[preset].radius;
    els.densityInput.value = presets[preset].density;
    state.speed = presets[preset].speed;
    document.querySelectorAll("[data-speed]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.speed) === state.speed);
    });
    resetScenario();
    addEvent(`Scenario preset loaded: ${els.scenarioPreset.selectedOptions[0].textContent}`);
  }
});

document.querySelectorAll("[data-check]").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    addEvent(`Checklist updated: ${checkbox.parentElement.textContent.trim()}`);
    renderChecklist();
  });
});

document.querySelectorAll("[data-module]").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    addEvent(`Academy module updated: ${checkbox.parentElement.textContent.trim()}`);
    render();
  });
});

els.trainingLevel.addEventListener("change", () => {
  addEvent(`Training level set to ${els.trainingLevel.selectedOptions[0].textContent}`);
  render();
});

els.pauseBtn.addEventListener("click", () => {
  state.paused = !state.paused;
  addEvent(state.paused ? "Scenario paused" : "Scenario resumed");
  render();
});

document.querySelectorAll("[data-speed]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-speed]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.speed = Number(button.dataset.speed);
    addEvent(`Scenario speed changed to ${button.textContent}`);
  });
});

els.notifyBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (track) addEvent(`Operator notified for ${track.id}`);
});

els.ackBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (track) {
    track.acknowledged = true;
    if (state.firstAlertAt[track.id] && !state.responses.some((response) => response.trackId === track.id)) {
      state.responses.push({
        trackId: track.id,
        seconds: Math.round((Date.now() - state.firstAlertAt[track.id]) / 1000),
      });
    }
    addEvent(`Alert acknowledged for ${track.id}`);
    render();
  }
});

els.logBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (track) {
    state.notes[track.id] = els.operatorNote.value;
    addEvent(`Incident note saved for ${track.id}`);
    render();
  }
});

els.reportBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateReport();
  const track = selectedTrack();
  if (track) addEvent(`Incident report generated for ${track.id}`);
  render();
});

els.clearBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (track) {
    track.reviewed = true;
    addEvent(`${track.id} marked reviewed`);
    render();
  }
});

els.injectBtn.addEventListener("click", () => {
  const angle = rand(0, Math.PI * 2);
  const track = {
    id: `DR-${String(state.tracks.length + 1).padStart(3, "0")}`,
    x: Math.cos(angle) * 260,
    y: Math.sin(angle) * 260,
    heading: angle + Math.PI + rand(-0.2, 0.2),
    speed: rand(18, 30),
    altitude: rand(45, 120),
    reviewed: false,
    acknowledged: false,
    trail: [],
    wasInsideZone: false,
  };
  state.tracks.push(track);
  state.selectedId = track.id;
  state.injects += 1;
  addEvent(`Training drill injected: ${track.id}`);
  render();
});

els.summaryBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateTrainingSummary();
  addEvent("Training summary generated");
  render();
});

els.reviewTimeline.addEventListener("input", () => {
  state.reviewIndex = Number(els.reviewTimeline.value);
  renderReview();
});

els.markerBtn.addEventListener("click", () => {
  const selected = selectedReviewEvent();
  if (!selected) return;
  state.reviewMarkers.push({
    index: selected.index,
    elapsed: selected.event.elapsed,
    message: selected.event.message,
    focus: reviewFocusFor(selected.event.message),
  });
  addEvent(`AAR marker captured for ${selected.event.elapsed}`);
  render();
});

els.aarBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateAfterActionReview();
  addEvent("After-action review generated");
  render();
});

els.certificateBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateCertificate();
  addEvent("Training certificate generated");
  render();
});

els.academyExportBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateAcademyRecord();
  addEvent("Academy record exported to report output");
  render();
});

els.leaderBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = leaderBriefText();
  addEvent("AI Leader brief generated");
  render();
});

els.leaderSnapshotBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateLeaderSnapshot();
  addEvent("AI Leader snapshot captured");
  render();
});

els.weatherPreset.addEventListener("change", () => {
  const presets = {
    clear: { wind: 4, visibility: 5000, turbulence: 1 },
    wind: { wind: 28, visibility: 4200, turbulence: 6 },
    rain: { wind: 18, visibility: 1800, turbulence: 4 },
    fog: { wind: 6, visibility: 600, turbulence: 2 },
    storm: { wind: 36, visibility: 900, turbulence: 9 },
  };
  const preset = presets[els.weatherPreset.value];
  if (!preset) {
    render();
    return;
  }
  els.windInput.value = preset.wind;
  els.visibilityInput.value = preset.visibility;
  els.turbulenceInput.value = preset.turbulence;
  addEvent(`Weather preset loaded: ${els.weatherPreset.selectedOptions[0].textContent}`);
  render();
});

[els.windInput, els.visibilityInput, els.turbulenceInput].forEach((input) => {
  input.addEventListener("input", () => {
    els.weatherPreset.value = "manual";
    addEvent("Weather parameters adjusted");
    render();
  });
});

els.weatherBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateWeatherBrief();
  addEvent("Weather training brief generated");
  render();
});

els.weatherDrillBtn.addEventListener("click", () => {
  els.weatherPreset.value = "storm";
  els.weatherPreset.dispatchEvent(new Event("change"));
  state.weatherDrillActive = true;
  els.injectBtn.click();
  addEvent("Adverse weather drill started");
  render();
});

els.routeCorrectionBtn.addEventListener("click", () => {
  applyWeatherRouteCorrection();
  render();
});

[els.missionProfile, els.roePosture].forEach((select) => {
  select.addEventListener("change", () => {
    addEvent(`Command setting updated: ${select.selectedOptions[0].textContent}`);
    render();
  });
});

els.missionBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateMissionBrief();
  addEvent("Mission brief generated");
  render();
});

els.commanderSnapshotBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateCommandSnapshot();
  addEvent("Command snapshot captured");
  render();
});

els.sensorPosture.addEventListener("change", () => {
  addEvent(`Sensor posture set to ${els.sensorPosture.selectedOptions[0].textContent}`);
  render();
});

els.fusionBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateFusionBrief();
  addEvent("Multi-sensor fusion brief generated");
  render();
});

els.sensorFaultBtn.addEventListener("click", () => {
  const feeds = ["radar", "eo", "acoustic", "rf"];
  const currentIndex = feeds.indexOf(state.sensorFault);
  state.sensorFault = feeds[(currentIndex + 1) % feeds.length];
  addEvent(`Simulated sensor fault injected: ${state.sensorFault}`);
  render();
});

els.iffPolicy.addEventListener("change", () => {
  addEvent(`IFF policy set to ${els.iffPolicy.selectedOptions[0].textContent}`);
  render();
});

els.markFriendlyBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (!track) return;
  const existing = state.friendlyRegistry.find((entry) => entry.trackId === track.id);
  if (!existing) {
    state.friendlyRegistry.push({
      id: `FR-${String(state.friendlyRegistry.length + 1).padStart(3, "0")}`,
      trackId: track.id,
      name: `Exercise friendly ${track.id}`,
      corridor: sectorFor(track),
      verified: els.iffPolicy.value !== "strict",
    });
    addEvent(`${track.id} added to friendly registry`);
  } else {
    existing.corridor = sectorFor(track);
    existing.verified = true;
    addEvent(`${track.id} friendly registry entry verified`);
  }
  render();
});

els.iffBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateIffBrief();
  addEvent("IFF registry brief generated");
  render();
});

[els.dutyAuthority, els.notifyThreshold, els.closureRule].forEach((select) => {
  select.addEventListener("change", () => {
    addEvent(`ROE setting updated: ${select.selectedOptions[0].textContent}`);
    render();
  });
});

els.notifyCommandBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (!track) return;
  state.commandNotifications[track.id] = {
    time: new Date().toISOString(),
    authority: els.dutyAuthority.value,
  };
  addEvent(`Command notification recorded for ${track.id}`);
  render();
});

els.closeIncidentBtn.addEventListener("click", () => {
  const track = selectedTrack();
  if (!track) return;
  const roe = roeAnalysis();
  if (roe.closureEligible && roe.authorityOk) {
    state.closedIncidents[track.id] = {
      time: new Date().toISOString(),
      rule: els.closureRule.value,
    };
    track.reviewed = true;
    addEvent(`Incident closed for ${track.id}`);
  } else {
    addEvent(`Incident closeout blocked for ${track.id}: ${roe.decision}`);
  }
  render();
});

els.roeBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateRoeBrief();
  addEvent("ROE brief generated");
  render();
});

els.commanderBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateCommanderBrief();
  addEvent("Commander brief generated");
  render();
});

els.queueSnapshotBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateQueueSnapshot();
  addEvent("Incident queue snapshot captured");
  render();
});

document.querySelectorAll("[data-platform-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    state.platformMode = button.dataset.platformMode === "military" ? "military" : "civil";
    addEvent(`Platform mode switched to ${platformModeConfig().label}`);
    render();
  });
});

els.trainingScenario.addEventListener("change", () => {
  state.activeTrainingScenario = els.trainingScenario.value;
  addEvent(`Training scenario selected: ${activeScenario().label}`);
  render();
});

els.loadScenarioBtn.addEventListener("click", () => {
  loadTrainingScenario();
});

els.scenarioBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateScenarioBrief();
  addEvent("Scenario brief generated");
  render();
});

els.airportDefenseBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateAirportDefenseBrief();
  addEvent("Airport defense brief generated");
  render();
});

els.redTeamPattern.addEventListener("change", () => {
  addEvent(`Red-team pattern set to ${activeRedTeamPattern().label}`);
  render();
});

els.redTeamIntensity.addEventListener("input", () => {
  addEvent(`Red-team intensity set to ${els.redTeamIntensity.value}/5`);
  render();
});

els.redTeamInjectBtn.addEventListener("click", () => {
  injectRedTeamPattern();
});

els.redTeamBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateRedTeamBrief();
  addEvent("Red-team brief generated");
  render();
});

els.commsPreset.addEventListener("change", () => {
  const presets = {
    nominal: { latency: 100, packetLoss: 0, gps: 5, fatigue: 1 },
    latency: { latency: 1500, packetLoss: 10, gps: 15, fatigue: 3 },
    loss: { latency: 500, packetLoss: 40, gps: 20, fatigue: 4 },
    gps: { latency: 300, packetLoss: 10, gps: 60, fatigue: 3 },
    fatigue: { latency: 400, packetLoss: 5, gps: 15, fatigue: 8 },
    blackout: { latency: 2200, packetLoss: 55, gps: 70, fatigue: 7 },
  };
  const preset = presets[els.commsPreset.value];
  if (!preset) {
    render();
    return;
  }
  els.latencyInput.value = preset.latency;
  els.packetLossInput.value = preset.packetLoss;
  els.gpsUncertaintyInput.value = preset.gps;
  els.fatigueInput.value = preset.fatigue;
  addEvent(`Comms degradation preset loaded: ${els.commsPreset.selectedOptions[0].textContent}`);
  render();
});

[els.latencyInput, els.packetLossInput, els.gpsUncertaintyInput, els.fatigueInput].forEach((input) => {
  input.addEventListener("input", () => {
    els.commsPreset.value = "manual";
    addEvent("Comms degradation parameters adjusted");
    render();
  });
});

els.commsDrillBtn.addEventListener("click", () => {
  els.commsPreset.value = "blackout";
  els.commsPreset.dispatchEvent(new Event("change"));
  state.commsDrills.push({ time: new Date().toISOString(), preset: "blackout" });
  addEvent("Comms degradation drill started");
  render();
});

els.commsBriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateCommsBrief();
  addEvent("Comms degradation brief generated");
  render();
});

els.recordEvidenceBtn.addEventListener("click", () => {
  recordEvidencePoint();
  render();
});

els.evidencePackageBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateEvidencePackage();
  addEvent("Evidence package generated");
  render();
});

els.evidenceJsonBtn.addEventListener("click", () => {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), evidence: state.evidenceRecords, audit: auditAnalysis() }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cuas-evidence-chain.json";
  a.click();
  URL.revokeObjectURL(url);
  addEvent("Evidence JSON exported");
  render();
});

els.forecastHorizon.addEventListener("change", render);

els.leader2BriefBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateLeaderV2Brief();
  addEvent("AI Leader v2 brief generated");
  render();
});

els.trainingCritiqueBtn.addEventListener("click", () => {
  els.incidentReport.textContent = generateLeaderV2Brief();
  addEvent("Training critique generated");
  render();
});

els.saveOfflineBtn.addEventListener("click", () => {
  const snapshot = offlineSnapshot();
  localStorage.setItem("cuas-offline-snapshot", JSON.stringify(snapshot));
  state.lastOfflineSave = snapshot.savedAt;
  addEvent("Offline local snapshot saved");
  render();
});

els.loadOfflineBtn.addEventListener("click", () => {
  const raw = localStorage.getItem("cuas-offline-snapshot");
  if (raw) {
    restoreOfflineSnapshot(JSON.parse(raw));
    addEvent("Offline local snapshot loaded");
  } else {
    addEvent("Offline local snapshot not found");
  }
  render();
});

els.fieldPackageBtn.addEventListener("click", () => {
  const blob = new Blob([generateFieldPackage()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cuas-field-package.json";
  a.click();
  URL.revokeObjectURL(url);
  addEvent("Field package exported");
  render();
});

els.clearLogBtn.addEventListener("click", () => {
  state.events = [];
  state.reviewMarkers = [];
  state.reviewIndex = 0;
  addEvent("Operator log cleared");
  render();
});

els.copyReportBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(els.incidentReport.textContent);
  addEvent("Incident report copied to clipboard");
  renderLog();
});

els.exportBtn.addEventListener("click", () => {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), events: state.events }, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cuas-training-log.json";
  a.click();
  URL.revokeObjectURL(url);
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  let nearest = null;
  let nearestDistance = Infinity;

  for (const track of state.tracks) {
    const point = metersToCanvas(track.x, track.y);
    const hit = Math.hypot(point.x - x, point.y - y);
    if (hit < nearestDistance) {
      nearest = track;
      nearestDistance = hit;
    }
  }

  if (nearest && nearestDistance < 34) {
    state.selectedId = nearest.id;
    render();
  }
});

resetScenario();
requestAnimationFrame(animate);
