# Hostel Management Admin Panel

A complete, production-ready admin panel built with React + TypeScript, featuring a professional blue-and-white design system for managing hostel operations.

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router v6 with nested routes
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **State Management**: In-memory DB with localStorage persistence
- **Build Tool**: Vite

### Project Structure

```
src/admin/
├── styles/
│   └── theme.css                    # CSS variables & theme
├── routes/
│   ├── routePaths.ts                # Route constants
│   └── AdminRoutes.tsx              # Route definitions
├── layout/
│   ├── AdminLayout.tsx              # Main layout wrapper
│   ├── Sidebar.tsx                  # Navigation sidebar
│   └── Topbar.tsx                   # Top navigation bar
├── components/
│   ├── DataTable.tsx                # Generic table with pagination
│   ├── ConfirmDialog.tsx            # Confirmation modal
│   ├── Toast.tsx                    # Notifications
│   ├── StatCard.tsx                 # Dashboard metrics
│   ├── Tabs.tsx                     # Tabbed interface
│   ├── SearchInput.tsx              # Search component
│   ├── Select.tsx                   # Dropdown selector
│   ├── Badge.tsx                    # Status badges
│   ├── EmptyState.tsx               # No data display
│   └── Loading.tsx                  # Loading states
├── types/
│   ├── common.ts                    # Shared types & utilities
│   ├── people.ts                    # Tenant & Employee types
│   ├── hostel.ts                    # Hostel types
│   ├── accounts.ts                  # Transaction types
│   └── comms.ts                     # Communication types
├── pages/
│   ├── Overview.tsx                 # Dashboard with stats & charts
│   ├── People/
│   │   ├── TenantsList.tsx
│   │   └── EmployeesList.tsx
│   ├── Accounts/
│   │   └── AccountsList.tsx
│   ├── Hostel/
│   │   ├── HostelList.tsx
│   │   ├── HostelCreate.tsx
│   │   └── HostelEdit.tsx
│   ├── Alerts/
│   │   └── AlertsList.tsx
│   ├── Vendor/
│   │   └── VendorList.tsx
│   ├── Communication/
│   │   └── CommunicationBoard.tsx
│   ├── FPA/
│   │   └── FinanceDashboard.tsx
│   └── Settings/
│       └── SettingsForm.tsx
├── mock/
│   ├── tenants.json                 # 15 tenant records
│   ├── employees.json               # 12 employee records
│   ├── accounts.json                # 22 transaction records
│   ├── hostels.json                 # 10 hostel records
│   ├── vendors.json                 # 12 vendor records
│   ├── alerts.json                  # 10 alert records
│   ├── messages.json                # 16 message records
│   ├── finance-monthly.json         # 12 months data
│   └── finance-yearly.json          # 6 years data
└── services/
    ├── db.ts                        # In-memory database layer
    └── hostel.service.ts            # Hostel business logic
```

## 🎨 Design System

### Color Palette
- **Brand Blue**: 50-900 scale (`#eff6ff` to `#1e3a8a`)
- **Success**: Green tones
- **Warning**: Amber tones
- **Danger**: Red tones
- **Info**: Blue tones

### Key Features
- Airy spacing with consistent padding
- `rounded-2xl` for modern feel
- Accessible focus rings
- Responsive design (mobile-first)
- Smooth transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation & Development

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The admin panel is accessible at: **http://localhost:5173/admin**

## ✅ RUN CHECKLIST - Manual Testing Guide

### 1. Initial Setup ✓
- [x] Dependencies installed
- [x] Theme CSS imported in main.tsx
- [x] Build completes without errors
- [x] Dev server starts successfully

### 2. Routing & Navigation

Navigate to **http://localhost:5173/admin** and verify:

- [ ] `/admin` redirects to `/admin/overview`
- [ ] Sidebar navigation visible and styled correctly
- [ ] All navigation items clickable:
  - [ ] Overview
  - [ ] People → Tenants
  - [ ] People → Employees
  - [ ] Accounts
  - [ ] Hostel Management
  - [ ] Alerts
  - [ ] Vendor
  - [ ] Communication
  - [ ] FP&A
  - [ ] Settings
- [ ] Active route is highlighted in sidebar
- [ ] Topbar shows correct page title
- [ ] Sidebar expands/collapses for People section

### 3. Overview Page (`/admin/overview`)

- [ ] **Stats Cards** display:
  - [ ] Occupancy Rate with percentage
  - [ ] Active Tenants count
  - [ ] Open Alerts count
  - [ ] Monthly Revenue in USD format
  - [ ] Active Vendors count
  - [ ] Pending Payments count
- [ ] **Monthly Revenue Trend Chart**:
  - [ ] Chart renders with Recharts
  - [ ] Income line (blue) displays
  - [ ] Expenses line (red) displays
  - [ ] Tooltip shows formatted currency on hover
  - [ ] 12 months of data visible
- [ ] **Recent Activity** section:
  - [ ] Shows top 5 alerts
  - [ ] Color-coded severity dots
  - [ ] Date formatting correct

### 4. People Pages

#### Tenants (`/admin/people/tenants`)
- [ ] Page title displays "Tenants"
- [ ] "Add Tenant" button visible
- [ ] **Data Table**:
  - [ ] Loads 15 tenant records from JSON
  - [ ] Columns: Name, Email, Phone, Room, Lease Start, Lease End, Status
  - [ ] Status badges color-coded (Active=green, Pending=amber, Inactive=gray)
  - [ ] Dates formatted correctly
- [ ] **Search**:
  - [ ] Type in search box filters by name/email/room instantly
  - [ ] Clear search restores full list
- [ ] **Status Filter**:
  - [ ] Dropdown shows All/Active/Inactive/Pending
  - [ ] Filtering works correctly
- [ ] **Pagination**:
  - [ ] 10 rows per page
  - [ ] Next/Previous buttons work
  - [ ] Page counter accurate

#### Employees (`/admin/people/employees`)
- [ ] Similar checks as Tenants
- [ ] Loads 12 employee records
- [ ] Role column displays correctly

### 5. Accounts Page (`/admin/accounts`)

- [ ] **Summary Cards**:
  - [ ] Total Income (green)
  - [ ] Total Expenses (red)
  - [ ] Net Balance (blue)
  - [ ] Values calculated correctly
- [ ] **Data Table**:
  - [ ] Loads 22+ transactions
  - [ ] Type badges: Rent/Deposit=green, Expense=amber, Refund=info
  - [ ] Amount column: green for income, red for expenses
  - [ ] Currency formatting correct ($X,XXX.XX)
  - [ ] Status badges (Paid/Pending/Overdue)
- [ ] **Filters**:
  - [ ] Type filter (All/Rent/Deposit/Expense/Refund)
  - [ ] Status filter (All/Paid/Pending/Overdue)
  - [ ] Both filters work together
- [ ] **Search** by reference or tenant name

### 6. Hostel Management (CRUD)

#### Hostel List (`/admin/hostel`)
- [ ] "Add Hostel" button visible
- [ ] **Data Table**:
  - [ ] Loads 10 hostels from JSON
  - [ ] Columns: Name, City, Floors, Rooms/Floor, Manager, Phone
  - [ ] Search filters by name/city/manager
- [ ] **Actions**:
  - [ ] Edit button navigates to edit page
  - [ ] Delete button opens confirmation dialog
  - [ ] Delete confirmation shows hostel name
  - [ ] Delete removes hostel and shows success toast
  - [ ] Toast auto-closes after 5 seconds

#### Hostel Create (`/admin/hostel/create`)
- [ ] "Back to Hostels" link works
- [ ] **Form Fields**:
  - [ ] Name (text, required, min 3 chars)
  - [ ] City (text, required)
  - [ ] Total Floors (number, min 1, max 50)
  - [ ] Rooms per Floor (number, min 1, max 100)
  - [ ] Manager Name (text, required)
  - [ ] Manager Phone (tel, regex validated)
  - [ ] Notes (textarea, optional)
- [ ] **Validation**:
  - [ ] Submit with empty fields shows errors
  - [ ] Invalid phone shows error message
  - [ ] Valid submission works
- [ ] **Success**:
  - [ ] Toast displays success message
  - [ ] Redirects to hostel list after 1.5s
  - [ ] New hostel appears in list

#### Hostel Edit (`/admin/hostel/:id/edit`)
- [ ] Form pre-fills with existing hostel data
- [ ] Same validation as create
- [ ] Save changes updates hostel
- [ ] Success toast and redirect work

### 7. Alerts Page (`/admin/alerts`)

- [ ] **Summary Cards**:
  - [ ] Danger count (red)
  - [ ] Warning count (amber)
  - [ ] Info count (blue)
- [ ] **Data Table**:
  - [ ] Loads 10 alerts
  - [ ] Severity badges color-coded
  - [ ] Status badges (Open=amber, Closed=green)
  - [ ] Assigned To column
- [ ] **Filters**:
  - [ ] Severity filter (All/Info/Warn/Danger)
  - [ ] Status filter (All/Open/Closed)

### 8. Vendor Page (`/admin/vendor`)

- [ ] "Add Vendor" button visible
- [ ] **Data Table**:
  - [ ] Loads 12 vendors
  - [ ] Rating column shows star + number
  - [ ] Last Invoice date formatted
  - [ ] Status badges
- [ ] Search and status filter work

### 9. Communication Board (`/admin/communication`)

- [ ] "New Message" button visible
- [ ] **Tabs**:
  - [ ] Three tabs: Tenants, Employees, Vendors
  - [ ] Tab counts display correct numbers
  - [ ] Clicking tab switches view instantly (no loading)
  - [ ] Active tab styled differently
- [ ] **Messages List**:
  - [ ] Messages filtered by selected tab
  - [ ] Subject, from, date display correctly
  - [ ] Badge shows message target
  - [ ] Body text truncated with line-clamp
- [ ] **Summary Cards**:
  - [ ] Total Messages count
  - [ ] This Month count
  - [ ] Active Threads count

### 10. FP&A Dashboard (`/admin/fpa`)

- [ ] **KPI Cards**:
  - [ ] Net Income YTD with YoY growth indicator
  - [ ] Total Revenue
  - [ ] Total Expenses
  - [ ] Avg Monthly Income
  - [ ] Trend arrows (up/down) correct
- [ ] **Monthly Chart**:
  - [ ] Line chart with 3 lines (Income, Expenses, Net Profit)
  - [ ] Tooltip shows currency values
  - [ ] All 12 months visible
  - [ ] Legend displays
- [ ] **Yearly Chart**:
  - [ ] Bar chart with 3 bars per year
  - [ ] 6 years of data (2020-2025)
  - [ ] Colors: blue=income, red=expenses, green=net
- [ ] **Financial Ratios**:
  - [ ] Profit Margin percentage
  - [ ] Expense Ratio percentage
  - [ ] YoY Growth percentage with color

### 11. Settings Page (`/admin/settings`)

- [ ] **Profile Information**:
  - [ ] Name field pre-filled
  - [ ] Email field pre-filled
  - [ ] Password field (placeholder text)
  - [ ] Show/hide password toggle works
- [ ] **Manager Permissions**:
  - [ ] 6 permission checkboxes
  - [ ] All checked by default
  - [ ] Clicking toggles checkbox
  - [ ] Each has description text
- [ ] **Save**:
  - [ ] "Save Settings" button works
  - [ ] Success toast appears
  - [ ] Refresh page → settings persist (localStorage)

### 12. Responsive Design

Test at different breakpoints:
- [ ] Desktop (>1024px): Sidebar + content side-by-side
- [ ] Tablet (768-1024px): Layouts adjust
- [ ] Mobile (<768px): Navigation adapts

### 13. Accessibility

- [ ] All interactive elements have visible focus rings
- [ ] Buttons have hover states
- [ ] Color contrast meets WCAG standards
- [ ] ESC key closes ConfirmDialog
- [ ] Keyboard navigation works in tables

### 14. Performance

- [ ] Initial page load < 3s
- [ ] Route transitions smooth
- [ ] Charts render without lag
- [ ] Search filtering instant (<100ms)
- [ ] No console errors

### 15. Data Persistence

- [ ] Create a new hostel → refresh page → still visible
- [ ] Delete hostel → refresh page → still deleted
- [ ] Change settings → refresh page → settings saved

## 🎯 Key Features Summary

✅ **Complete Admin Panel** - All 9+ pages implemented
✅ **Type-Safe** - Full TypeScript coverage
✅ **Form Validation** - Zod schemas with react-hook-form
✅ **CRUD Operations** - Hostel create, read, update, delete
✅ **Data Persistence** - localStorage integration
✅ **Charts & Analytics** - Recharts integration for FP&A
✅ **Responsive Design** - Mobile-first approach
✅ **Professional UI** - Blue/white theme, modern components
✅ **Accessibility** - Focus management, keyboard navigation
✅ **Production Ready** - Build succeeds, no TypeScript errors

## 📊 Mock Data Details

- **Tenants**: 15 records (Active, Pending, Inactive statuses)
- **Employees**: 12 records (Various roles)
- **Transactions**: 22 records (Mix of income/expenses)
- **Hostels**: 10 properties (Different cities)
- **Vendors**: 12 vendors (Various specialties)
- **Alerts**: 10 alerts (Info, Warning, Danger levels)
- **Messages**: 16 messages (Across all targets)
- **Finance**: 12 months + 6 years historical data

## 🔧 Development Notes

### Adding New Pages
1. Create page component in `src/admin/pages/`
2. Add route in `src/admin/routes/AdminRoutes.tsx`
3. Add route constant in `src/admin/routes/routePaths.ts`
4. Add navigation item in `src/admin/layout/Sidebar.tsx`

### Adding New Entities
1. Define types in `src/admin/types/`
2. Create mock JSON in `src/admin/mock/`
3. Add service functions in `src/admin/services/`
4. Create CRUD pages

### Styling
- Use Tailwind utility classes
- Reference theme variables from `theme.css`
- Brand colors: `brand-{50-900}`
- Spacing: `p-6`, `gap-6`, `space-y-6`
- Borders: `rounded-2xl`, `border-slate-200`

## 📝 Notes

- All routes are nested under `/admin/*`
- Data persists to localStorage with prefix `hm_admin_`
- Charts require `recharts` library
- Forms use `react-hook-form` + `zod` for validation
- No custom hooks files created (as per requirements)

## 🐛 Troubleshooting

**Build errors**: Ensure all type imports use `import type` syntax
**Charts not rendering**: Check `recharts` is installed
**Routing issues**: Verify `BrowserRouter` wraps `<App />` in `main.tsx`
**Data not persisting**: Check browser localStorage is enabled

## 📄 License

This project is part of a Hotel Management system.

---

**Built with** ❤️ **using React + TypeScript + Tailwind CSS**

