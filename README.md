# FeedbackFlow

A modern, structured feedback management system designed for internal communication between managers and team members. Built with React, TypeScript, and TailwindCSS.

## 🌟 Features

### Core Functionality

- **🔐 Role-Based Authentication**: Separate interfaces for managers and employees
- **📝 Structured Feedback**: Organized feedback with strengths, areas for improvement, and sentiment
- **📊 Dashboard Analytics**: Visual insights into feedback trends and acknowledgment status
- **✅ Acknowledgment System**: Employees can acknowledge received feedback
- **🔍 Search & Filter**: Find feedback quickly with advanced filtering options
- **📱 Responsive Design**: Works seamlessly across all device sizes

### User Roles

#### Manager Features

- View team overview with feedback statistics
- Submit structured feedback to team members
- Edit and update previously submitted feedback
- Track acknowledgment status across the team
- Filter and search through all team feedback

#### Employee Features

- View personal feedback timeline
- Acknowledge received feedback
- Track growth trends and sentiment over time
- Search through personal feedback history

### Design & UX

- **Modern Interface**: Clean, professional design suitable for workplace use
- **Intuitive Navigation**: Role-based routing and navigation
- **Real-time Updates**: Immediate feedback on actions and state changes
- **Accessibility**: Built with semantic HTML and proper ARIA attributes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd feedbackflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Demo Accounts

The application comes with pre-configured demo accounts for testing:

### Manager Accounts

- **Email**: `sarah.johnson@company.com`
- **Password**: `manager123`
- **Team**: 3 employees (Mike, Emily, David)

- **Email**: `alex.thompson@company.com`
- **Password**: `manager123`
- **Team**: 2 employees (Lisa, Tom)

### Employee Accounts

- **Email**: `mike.chen@company.com`
- **Password**: `employee123`
- **Manager**: Sarah Johnson

- **Email**: `emily.rodriguez@company.com`
- **Password**: `employee123`
- **Manager**: Sarah Johnson

_Additional employee accounts available - check the login page for the full list._

## 🏗️ Technical Architecture

### Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router 6 (SPA mode)
- **Styling**: TailwindCSS 3 with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Build Tool**: Vite
- **State Management**: React hooks with localStorage persistence
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

### Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components
│       ├── feedback-card.tsx
│       ├── dashboard-stats.tsx
│       └── [shadcn components]
├── pages/               # Route components
│   ├── Login.tsx
│   ├── ManagerDashboard.tsx
│   ├── EmployeeDashboard.tsx
│   ├── SubmitFeedback.tsx
│   ├── ViewFeedback.tsx
│   └── NotFound.tsx
├── lib/                 # Utilities and data management
│   ├── auth.ts          # Authentication logic
│   ├── feedback.ts      # Feedback data operations
│   └── utils.ts         # Helper functions
├── types/               # TypeScript interfaces
│   └── index.ts
├── App.tsx              # Main app with routing
└── main.tsx             # Application entry point
```

### Data Storage

The application uses **localStorage** for data persistence, making it perfect for demonstration and local development. In a production environment, this would be replaced with a proper backend API.

#### Data Models

**User**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "manager" | "employee";
  managerId?: string; // For employees
  teamMemberIds?: string[]; // For managers
  avatar?: string;
}
```

**Feedback**

```typescript
interface Feedback {
  id: string;
  fromUserId: string; // Manager giving feedback
  toUserId: string; // Employee receiving feedback
  strengths: string;
  areasToImprove: string;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: string;
  updatedAt: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  tags?: string[];
}
```

## 🎨 Design System

### Color Palette

- **Primary**: Professional blue-purple (`#6366f1`)
- **Success**: Green for positive feedback (`#16a34a`)
- **Warning**: Amber for neutral feedback (`#f59e0b`)
- **Error**: Red for negative feedback (`#dc2626`)

### Typography

- **Font Family**: System font stack for optimal performance
- **Scale**: Consistent sizing using Tailwind's type scale
- **Weight**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Components

All UI components are built using:

- **Radix UI**: For accessible, unstyled primitives
- **TailwindCSS**: For styling and responsive design
- **Class Variance Authority**: For component variants
- **Custom Design Tokens**: Defined in `tailwind.config.ts`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run test suite
- `npm run typecheck` - TypeScript type checking
- `npm run format.fix` - Format code with Prettier

### Key Features Implementation

#### Authentication Flow

1. User enters credentials on login page
2. System validates against mock user database
3. User object stored in localStorage
4. Protected routes check authentication status
5. Role-based redirects to appropriate dashboard

#### Feedback Management

1. **Creation**: Managers select team member and fill structured form
2. **Storage**: Feedback saved to localStorage with timestamps
3. **Viewing**: Role-based access controls ensure data privacy
4. **Updates**: Managers can edit their own feedback
5. **Acknowledgment**: Employees confirm they've read feedback

#### State Management

- **Authentication**: useState + localStorage for persistence
- **Feedback Data**: Custom hooks for CRUD operations
- **UI State**: Local component state with React hooks
- **Real-time Updates**: State updates trigger UI re-renders

## 🚦 Production Considerations

### For Production Deployment

1. **Backend Integration**

   - Replace localStorage with REST API calls
   - Implement proper authentication (JWT, OAuth)
   - Add input validation and sanitization
   - Database integration (PostgreSQL, MongoDB)

2. **Security**

   - HTTPS enforcement
   - CSRF protection
   - Input validation
   - Role-based API authorization
   - Audit logging

3. **Performance**

   - Code splitting and lazy loading
   - Image optimization
   - CDN integration
   - Bundle analysis and optimization

4. **Monitoring**
   - Error tracking (Sentry, Bugsnag)
   - Analytics integration
   - Performance monitoring
   - User feedback collection

### Environment Variables

For production, you would typically configure:

```env
VITE_API_URL=https://api.feedbackflow.com
VITE_AUTH_DOMAIN=your-auth-domain
VITE_ENVIRONMENT=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for all new code
- Include tests for new functionality
- Update documentation for API changes
- Use semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **TailwindCSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Vite** for the blazing fast build tool

---

**FeedbackFlow** - Making workplace feedback structured, accessible, and actionable.
