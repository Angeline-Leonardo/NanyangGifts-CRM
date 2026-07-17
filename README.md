
# NanyangGifts CRM Web app

A custom CRM and operations workspace built with Next.js, React, TypeScript, Supabase, and modern component-driven UI patterns. The app is designed around a grouped board workflow similar to Monday.com, with client rows, nested subitems, assignments, activity tracking, document generation, and external collaboration flows for clients and suppliers.[1][2]

## Overview

This application manages the full lifecycle of leads and projects in a board-style interface. It combines CRM tracking, internal operations, document workflows, and external portals into a single web app so teams can move from intake to fulfillment without leaving the system.[1][3][4]

The current product direction centers on a grouped CRM board with editable client rows, collapsible sections, subitem management, assignee workflows, status filtering, activity logs, QuickBooks estimate generation, order confirmation forms, and supplier-facing table views.[1][5][6][7][8]

## Core Features

### Board-based CRM

- Grouped CRM board inspired by Monday.com-style sections and collapsible groups.[1]
- Client rows with inline editing for business and contact fields.[2]
- Expandable rows with nested subitems for project-level or line-item tracking.[2]
- Bulk row selection and deletion for faster board management.[2]
- Search and filtering across client and subitem data.[9][10]
- Drag-and-drop movement of clients between groups, with status-aware grouping behavior discussed during implementation.[1]

### Status and workflow management

- Custom client statuses such as New Lead, Contacted, Quoted, Follow Up, Shortlisted, Project Started, Project Done, Closed, and Unqualified were used as the core board workflow model during development.[1]
- Reply status tracking for outreach follow-up and reassignment flows.[11]
- Follow-up date handling for timing-sensitive pipeline management.[11][12]
- Option management for status-like fields, including work to migrate options and colors from hardcoded UI constants into database-backed configuration.[2]

### Collaboration and assignments

- Multi-user assignee support at both the client and subitem levels.[2]
- Assignee data modeled through join tables linked to user profiles in Supabase.[2]
- Round-robin assignment was a major design influence earlier in the project, especially for lead ownership and response workflows.[11][13]

### Activity logging

- Per-client activity log with user attribution and change descriptions.[5]
- Tracking for field updates, subitem creation, subitem deletion, and nested item changes.[5]
- Internal audit trail design to show who changed what and when across client records.[5]

### Document generation

- Generate Estimate workflow integrated with QuickBooks-oriented logic and external accounting considerations.[6][14]
- Generate Order Confirmation Form workflow with a dedicated modal, internal page, and public client-facing signing/review flow.[3][7]
- OCF flow designed with editable internal fields, public tokenized sharing, and client-side review/signoff behavior.[7]

### External collaboration

- Public client-facing OCF page accessible through a tokenized link rather than requiring standard app authentication.[7]
- Supplier-facing view planned and discussed as a table-based external workflow for selected subitem data.[4][8]
- Architecture explored for exposing only supplier-relevant fields while protecting internal operational data.[4]

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI | Tailwind-style utility classes, Lucide icons, Radix UI patterns, custom reusable row components |
| Backend | Supabase |
| Database | PostgreSQL via Supabase |
| Auth / access patterns | Supabase auth for internal users, tokenized access for selected external flows |
| Integrations | QuickBooks, earlier workflow exploration with Make and Zapier |

The app is built as a modern React application with typed client models, reusable UI components, and Supabase-backed persistence for records, assignments, groups, and workflow data.[2][6]

## Key Modules

### CRM board

The main board renders grouped client rows, supports expansion and collapse, inline editing, selection, filtering, and nested subitem tables. This is the operational center of the product and the component where much of the assignment, grouping, and document workflow wiring lives today.[1][2]

### Client rows and subitems

Client rows are responsible for presenting core CRM data and operational actions, while subitems support more granular fulfillment or item-level tracking. This layered structure mirrors how the app separates high-level client management from detailed execution work.[2]

### Assignments layer

Assignments are handled separately from the raw client record model, with profile-based multi-select behavior for both client and subitem assignees. Supabase join tables and helper functions were discussed as the persistence model for this feature.[2]

### Activity system

The activity log feature records mutations on clients and subitems and displays them in a row-level modal or panel. The design emphasis is on readable audit history rather than raw database event data.[5]

### OCF workflow

The Order Confirmation Form flow includes creation, internal editing, public sharing, and client submission. The internal route is intended for staff operations, while the public token route is intended for client review and signature-related interaction.[3][7]

### Supplier view

The supplier workflow is intended as a simplified table view rather than a board, focused on exposing only the fields suppliers need to view or update. This was explicitly preferred over pushing the process into Google Sheets.[4][8]

## Data Model Highlights

The app uses typed entities such as clients, subitems, profiles, groups, and activity entries to model the workspace. During implementation discussions, the CRM record was structured to include client-level fields, nested subitems, assignment relationships, expansion state, and activity history.[9][2]

Notable data concepts include:

- `Client` records for top-level CRM entries.[9]
- `Subitem` records for nested operational rows under each client.[2]
- `CRMGroup` records for board grouping and section ordering.[1]
- Profile-linked assignee maps for client and subitem ownership.[2]
- Activity log entries for audit history.[5]
- OCF records and tokenized external access flows for document review.[7]

## Workflow Summary

1. Create or import a client into the CRM board.[1]
2. Assign owners, set statuses, and manage follow-up or reply tracking.[2][11]
3. Expand the client to manage subitems and deeper operational work.[2]
4. Review activity history to monitor updates across users.[5]
5. Generate downstream documents such as estimates or order confirmation forms when needed.[6][7]
6. Share specific operational views externally through controlled public or tokenized flows where appropriate.[4][7][8]

## Integrations

### QuickBooks

Estimate generation was designed around creating customer and item records as needed and then generating a new estimate from CRM data. The workflow also explored how generated estimate identifiers and downstream PDF handling could be mapped back into the app.[6][14]

### Supabase

Supabase is the primary backend for data, auth, storage, and workflow persistence. It underpins clients, subitems, assignment joins, activity logs, groups, document records, and external access patterns discussed throughout development.[5][2][7]

### Automation tools

Make and Zapier were discussed earlier in the broader workflow design, especially around assignment automation, inbox-driven lead routing, and external integrations. Those discussions helped shape the app's operational model even where the final product moved more logic directly into the web app itself.[11][13]

## Current Product Direction

The app has evolved from a basic board into a more complete internal operations platform. Based on the implemented and planned features discussed so far, the product is moving toward a unified workspace for CRM management, internal execution, client document handling, supplier collaboration, and accounting-connected actions.[1][3][4][6]

## Repository Notes

This repository represents an actively evolving product. Features such as dynamic option management, activity logging, grouped board rendering, supplier-facing access, and document workflows were all built iteratively, so some modules may reflect ongoing migration from hardcoded UI behavior toward database-driven configuration and more structured external flows.[5][2][8]


