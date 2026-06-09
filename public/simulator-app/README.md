# C-UAS Defense Platform

This is a safe, non-weaponized military defensive platform prototype.
It is organized around simulated C-UAS monitoring, sector readiness, mission briefing,
defensive ROE workflow, evidence handling, incident containment, and operator training.
The core purpose is protection of airports, critical infrastructure, and civilian areas from drone incidents.

The platform is split into two operational branches:

- Civil Protection: airport operations, ATC, airport security, police/gendarmerie, emergency services, civilian-area protection
- Military Defense: mission commander, military C-UAS team, security forces, airspace liaison, civil authority liaison, protected-site defense

It intentionally excludes EMP generation, signal interference, drone takeover, destructive actions,
payload control, firing workflows, hardware parameters, and operational instructions for harming
or disabling drones.

## What it includes

- Military defense deck with simulated drone tracks on a protected airspace map
- Civil Protection / Military Defense mode switch
- Adjustable protected-zone radius
- Adjustable track density and scenario speed
- Pause/resume for operator review
- Risk filters for active tracks
- Closest-track and zone-load summary
- Airport perimeter, critical infrastructure, and forward operating site presets
- ETA estimate for simulated tracks entering the protected zone
- Track trails for movement-history review
- Simulated protected-zone breach counters and log events
- Per-track operator notes
- Operator checklist for evidence, notification, and defensive handoff workflow
- Alert acknowledgement for training records
- Incident report generation and clipboard copy
- Risk scoring for monitor/watch/alert training
- Operator notifications, reviewed status, and incident logging
- JSON export of the training log
- Phase 6 training evaluation dashboard
- Safe drill injects for simulated operator exercises
- Training objectives, score, average response time, and session summary
- Phase 7 after-action review timeline
- Instructor review markers and AAR report generation
- Phase 8 instructor academy dashboard
- Training modules, proficiency scoring, certificate output, and academy record export
- Phase 9 AI Leader dashboard
- Local explainable prioritization, defensive-action coaching, leader brief, and leader snapshot output
- Phase 10 adverse-weather simulation
- Wind drift, turbulence, visibility overlay, weather drill, friendly-route correction advisor, and weather training brief
- Phase 11 defensive command layer
- Mission profile, defensive ROE posture, sector readiness, mission brief, and command snapshot
- Phase 12 multi-sensor fusion
- Simulated radar, EO/IR, acoustic, and RF observer quality with fusion confidence and sensor fault drills
- Phase 13 IFF / friendly drone registry
- Friendly match classification, false-positive reduction, registry review, and IFF brief output
- Phase 14 rules of engagement module
- Authority checks, command-notification thresholds, closure rules, decision cards, and ROE brief output
- Phase 15 mission commander dashboard
- Sector map, commander priorities, readiness/weather/operator status, incident queue, commander brief, and queue snapshot
- Phase 16 scenario library
- Base defense, convoy overwatch, warehouse perimeter, airport airside, border sector, and critical infrastructure training modes
- Airport Defense Mode
- Airport runway readiness, approach-corridor watch, ATC coordination, authorized response cell, and airport defense brief
- Phase 17 red-team simulator
- Safe training-track injection for swarm behavior, decoys, low-altitude approach, and weather masking
- Phase 18 comms degradation
- Simulated latency, packet loss, sensor feed loss, GPS uncertainty, operator fatigue, comms drills, and comms brief output
- Phase 19 audit-grade evidence chain
- Evidence officer, audit records, approvals, evidence package, and evidence JSON export
- Phase 20 AI Leader v2
- Commander brief, risk forecast, staffing recommendation, and training critique
- Phase 21 offline rugged mode
- Local snapshot save/load, field package export, and offline field-mode checklist

## How to run

Open `index.html` in a browser. No build step or network access is required.
