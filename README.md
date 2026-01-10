# user-management

# User Management Dashboard

A modern user management dashboard built with React and Material UI, designed to handle user listing, filtering, selection, and actions in a clean and scalable way.

---

## Features

- Display users in a responsive data table
- Filter users by status (All / Active / Absent)
- Multi-row selection with bulk delete
- Single user actions (Edit, Delete, Toggle status)
- Custom checkbox integration with MUI DataGrid
- Confirmation dialogs for destructive actions
- Fully controlled state (selection, filters, dialogs)
- Clean separation between container logic and UI components

---

## Tech Stack

- **React**
- **TypeScript**
- **Material UI (MUI)**
- **Tailwind**
- **MUI X DataGrid**
- **React Query**
- **Axios**
- **JSON Server (Mock API)**

---

## Project Structure

src/
├── components/
│ ├── ManagementTable.tsx
│ ├── Filter.tsx
│ ├── ConfirmDeleteDialog.tsx
│ └── CheckBox.tsx
├── pages/
│ └── users/
│ └── Users.tsx
├── apis/
│ └── users.ts
├── queries/
│ └── useUsers.ts
├── types/
│ └── users.ts
└── db.json

---

## User Status Logic

The application supports the following user statuses:

```ts
type UserStatus = "active" | "absent";
```

## run dependencirs

yarn add

## run project

yarn run dev

## run server

yarn run server
