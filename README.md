
# NanyangGifts CRM Web app

A custom CRM and operations workspace built with Next.js, React, TypeScript, Supabase, and modern component-driven UI patterns. The app is designed around a grouped board workflow similar to Monday.com, with client rows, nested subitems, assignments, activity tracking, document generation, and external collaboration flows for clients and suppliers.

## Core Features

### Board-based CRM

- Grouped CRM board inspired by Monday.com-style sections and collapsible groups.
- Client rows with inline editing for business and contact fields.
- Expandable rows with nested subitems for project-level or line-item tracking.
- Bulk row selection and deletion for faster board management.
- Search and filtering across client and subitem data.
- Drag-and-drop movement of clients between groups, with status-aware grouping behavior discussed during implementation.

### Status and workflow management

- Custom client statuses such as New Lead, Contacted, Quoted, Follow Up, Shortlisted, Project Started, Project Done, Closed, and Unqualified were used as the core board workflow model during development.
- Reply status tracking for outreach follow-up and reassignment flows.
- Follow-up date handling for timing-sensitive pipeline management.
- Option management for status-like fields, including work to migrate options and colors from hardcoded UI constants into database-backed configuration.

### Collaboration and assignments

- Multi-user assignee support at both the client and subitem levels.
- Assignee data modeled through join tables linked to user profiles in Supabase.
- Round-robin assignment was a major design influence earlier in the project, especially for lead ownership and response workflows.

### Activity logging

- Per-client activity log with user attribution and change descriptions.
- Tracking for field updates, subitem creation, subitem deletion, and nested item changes.
- Internal audit trail design to show who changed what and when across client records.

### Document generation

- Generate Estimate workflow integrated with QuickBooks-oriented logic and external accounting considerations.
- Generate Order Confirmation Form workflow with a dedicated modal, internal page, and public client-facing signing/review flow.
- OCF flow designed with editable internal fields, public tokenized sharing, and client-side review/signoff behavior.

### External collaboration

- Public client-facing OCF page accessible through a tokenized link rather than requiring standard app authentication.
- Supplier-facing view planned and discussed as a table-based external workflow for selected subitem data.
- Architecture explored for exposing only supplier-relevant fields while protecting internal operational data.

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI | Tailwind-style utility classes, Lucide icons, Radix UI patterns, custom reusable row components |
| Backend | Supabase |
| Database | PostgreSQL via Supabase |
| Auth / access patterns | Supabase auth for internal users, tokenized access for selected external parties (client, supplier) |
| Integrations | QuickBooks |
