# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: residents (habitantes) of a condominium who lend and borrow everyday items (tools, ladders, speakers) with their neighbors.
Secondary: the condominium admin (a resident with extra powers: approve join requests, manage neighbors, review reports, see all loans) and the Global Administrator who approves new condominiums.

## Product Purpose
YipShare lets neighbors in the same condominium publish items, request loans for a set time, hand them over and return them with verification codes, and rate each other afterwards. Success is items changing hands between neighbors without friction or disputes.

## Operating Context
- Spanish-language UI (es-MX), academic project (IPN).
- Roles: habitante, admin de condominio, Administrador Global.
- Loan lifecycle: pendiente → aceptado → en_curso → finalizado (or rechazado); codes confirm handover and return.
- Reports (reportes) flag neighbors who failed a loan; admin can revoke a neighbor's permission to borrow.

## Capabilities and Constraints
- Next.js 16 (App Router), React 19, Tailwind CSS v4, plain JS.
- No backend yet: data is example data in `lib/` and page-level constants; TODOs mark backend calls.
- Items have optional images (`imagen: null` is common), so item UI must work without photos.

## Brand Commitments
- Logo: `public/img/logo_yipshare_icono.png`.
- Institutional blue `#1e4a73` must be kept.

## Evidence on Hand
Only example data. No real testimonials, metrics or user photos exist; do not fabricate them.

## Product Principles
1. Trust between neighbors comes first: owner, location and rating are always visible next to an item.
2. The common path (find an item, request it) must be faster than asking in the building's group chat.
3. Admin powers live alongside the resident experience, not in a separate tool.
