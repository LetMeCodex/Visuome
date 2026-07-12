# Architecture Decision Record: ADR-0005-Stabilization

## Context & Motivation
Following the implementation of Volume 4 (Motion & Interaction Intelligence), Visuome has grown to include a layered intelligence pipeline (Visual Language, Semantic, Philosophy, and Motion stages). Before initiating Volume 5 (which introduces multi-page website traversal and unified genome persistence), the system requires stabilization to establish a verified engineering baseline.

## Decisions

### 1. Stabilization Release (v0.5.1)
We establish a dedicated stabilization release (`v0.5.1` codename `KINETIC-STABLE`) to solidify test suites, optimize performance (computed style caches), and validate staging boundaries before expanding the surface area of features.

### 2. Postponement of RegistryManager
The core registries (node, style, typography, color, spacing, layout, components, motion, visual language, semantics, philosophy, etc.) are currently coordinate-managed in `ScanResult` and `ScanSession` data models. A centralized `RegistryManager` abstraction is postponed to Volume 5 to avoid refactoring interface adapters twice when cross-session and cross-page genomes are introduced.

### 3. Postponement of Design Genome
The consolidated `DesignGenome` persistence model (which aggregates multi-page token relationships) is postponed to Volume 5, as it requires multi-page crawlers to yield meaningful structural mappings.

### 4. Postponement of Website Discovery
Traversing multiple pages on a target website requires background page lifecycle workers. To maintain the local-first security sandbox of the extension, multi-page traversal is postponed to Volume 5.

## Status
Approved

## Consequences
- The v0.5.1 codebase is certified as a stable foundation.
- All subsequent volumes can build on top of these verified metrics.
