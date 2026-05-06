# PubCore Frontend

A modern Next.js frontend for managing a publishing platform. This application provides a complete interface for managing Books, Authors, and Publishers with full CRUD operations, advanced filtering, pagination, and JWT-based authentication.

## 🚀 Features

- **Authentication**: Secure JWT-based login and registration
- **Author Management**: Create, read, update, and delete authors with bio and nationality info
- **Publisher Management**: Manage publishers with contact details and website information
- **Book Catalog**: Comprehensive book management with metadata (ISBN, genre, year, description)
- **Advanced Filtering**: Filter books by title, genre, author, publisher, and year
- **Pagination**: Efficient navigation through large datasets
- **Responsive Design**: Fully responsive for mobile, tablet, and desktop
- **Dashboard**: Overview showing statistics for all entities
- **Form Validation**: Client-side validation with helpful error messages
- **Modern UI**: Clean, intuitive interface with Material-UI components
- **State Management**: Context API + Zustand for auth state

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Material-UI](https://mui.com/)
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Authentication**: JWT Bearer token stored in localStorage
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📋 Prerequisites

- Node.js 18.0 or later
- pnpm (recommended) or npm/yarn
- PubCore API backend running (default: `http://localhost:8080`)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd pubcore-frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory or copy from `.env.example`:

```bash
cp env.example .env.local
```

Edit `.env.local` and set the API URL (default is already set):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 5. Build for production

```bash
pnpm build
pnpm start
```

## 📖 Usage

### Login/Register

1. Navigate to `http://localhost:3000/login` or `/register`
2. Create a new account or login with existing credentials
3. After authentication, you'll be redirected to the dashboard

### Dashboard

- View statistics for Authors, Publishers, and Books
- Navigate to different sections using the sidebar menu

### Managing Authors

- **List**: View all authors with pagination and search
- **Create**: Click "Add Author" button to create new author
- **Edit**: Click the edit icon on any row
- **Delete**: Click the delete icon (confirmation required)

### Managing Publishers

- **List**: View all publishers with pagination and search
- **Create**: Click "Add Publisher" button
- **Edit**: Click the edit icon
- **Delete**: Click the delete icon

### Managing Books

- **List**: View all books with multiple filter options
- **Filters**: By title, genre, author, and publisher
- **Create**: Click "Add Book" button
- **Edit**: Click the edit icon
- **Delete**: Click the delete icon

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── login/
│   │   └── page.tsx         # Login page
│   ├── register/
│   │   └── page.tsx         # Register page
│   └── (dashboard)/
│       ├── layout.tsx       # Dashboard layout with sidebar
│       ├── page.tsx         # Dashboard overview
│       ├── authors/
│       ├── publishers/
│       └── books/
├── components/
│   └── common/
│       ├── sidebar/         # Navigation sidebar
│       ├── pagination/      # Pagination component
│       ├── delete-confirm-dialog/  # Delete confirmation dialog
│       └── layout/
├── lib/
│   ├── api.ts              # API client and endpoints
│   └── axios-client.ts     # Axios instance with JWT interceptor
├── stores/
│   └── useAuthStore.ts     # Zustand auth store
├── hooks/
│   └── useNotification.ts  # Toast notification hook
├── types/
│   └── entities.d.ts       # TypeScript interfaces
└── config/
    └── app-config.ts       # App configuration

```

## 🔐 Authentication

### How it works

1. User credentials are sent to `/auth/login` or `/auth/register`
2. Backend returns JWT token and user information
3. Token is stored in localStorage
4. Axios interceptor automatically adds token to all requests
5. If token is invalid (401), user is redirected to login

### JWT Token

- Automatically attached to all API requests
- Stored in `localStorage` with key `pubcore_auth_token`
- Interceptor handles expired tokens

## 🔌 API Integration

### Base URL

The API base URL is configured via environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Available Endpoints

See [BACKEND_API.md](./BACKEND_API.md) for complete API documentation.

#### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

#### Authors

- `GET /authors` - List authors (with pagination/filtering)
- `GET /authors/:id` - Get author details
- `POST /authors` - Create author
- `PUT /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

#### Publishers

- `GET /publishers` - List publishers
- `GET /publishers/:id` - Get publisher details
- `POST /publishers` - Create publisher
- `PUT /publishers/:id` - Update publisher
- `DELETE /publishers/:id` - Delete publisher

#### Books

- `GET /books` - List books (with advanced filtering)
- `GET /books/:id` - Get book details
- `POST /books` - Create book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

## 🧪 Testing

Run tests with:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

## 📝 Code Quality

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm ts
```

### Code Formatting

```bash
pnpm format
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-hosted

1. Build the project: `pnpm build`
2. Start production server: `pnpm start`
3. Use PM2 or similar for process management
4. Configure reverse proxy (nginx/Apache)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/material-ui/getting-started/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for PubCore Publishing Platform**

yarn install

````

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
````

Configure the required environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Add other environment variables as needed
NEXT_PUBLIC_APP_ENV=development
```

### 4. Run the development server

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
├── actions/              # Server actions
├── app/                  # Next.js App Router pages
│   ├── (dashboard)/      # Dashboard layout group
│   │   ├── tasks/        # Task management pages
│   │   │   ├── [id]/     # Task detail/edit page
│   │   │   └── create/   # Create task page
│   │   └── page.tsx      # Dashboard home
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── common/           # Shared UI components
│   │   ├── data-table/   # Data table components
│   │   ├── form/         # Form components
│   │   ├── layout/       # Layout components
│   │   └── ...
│   └── features/         # Feature-specific components
├── config/               # App configuration
├── hooks/                # Custom React hooks
│   ├── react-query/      # API hooks
│   └── zod/              # Validation hooks
├── lib/                  # Utility libraries
├── providers/            # React context providers
├── stores/               # State management
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── validations/          # Zod validation schemas
```

## 🎯 Core Pages

### Task List Page (`/`)

- Display all tasks with status indicators
- Filter tasks by status (TO_DO, IN_PROGRESS, DONE)
- Pagination controls
- Quick actions (edit, delete) for each task
- "Add New Task" button

### Create Task Page (`/tasks/create`)

- Form with title and description fields
- Status selection
- Form validation
- Success/error handling

### Edit Task Page (`/tasks/[id]`)

- Pre-filled form with existing task data
- Update title, description, and status
- Delete task option
- Form validation and error handling

## 🔧 API Integration

The application integrates with a REST API backend with the following endpoints:

- `GET /tasks` - Fetch tasks with optional filtering and pagination
- `GET /tasks/:id` - Fetch a specific task
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id` - Update an existing task
- `DELETE /tasks/:id` - Delete a task

API client configuration is located in `src/lib/axios-client.ts`.

## 🎨 Styling & Theming

- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Material-UI**: React component library for consistent design
- **Responsive Design**: Mobile-first approach with breakpoint-specific styling
- **Dark/Light Theme**: Automatic theme switching based on user preference
- **Custom Theme**: Extended Material-UI theme with custom colors and typography

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Indonesian (id)

Language files are located in the `messages/` directory. Use the language selector to switch between languages.

## ✅ Form Validation

Client-side validation is implemented using Zod schemas:

- Required field validation
- String length validation
- Custom validation rules
- Real-time error feedback

## 🧪 Testing

Run the test suite:

```bash
pnpm test
# or
npm test
```

Run tests in watch mode:

```bash
pnpm test:watch
# or
npm run test:watch
```

## 🚀 Deployment

### Deploy to Vercel

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔒 Environment Variables

| Variable              | Description             | Required | Default       |
| --------------------- | ----------------------- | -------- | ------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL    | Yes      | -             |
| `NEXT_PUBLIC_APP_ENV` | Application environment | No       | `development` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Design Decisions & Assumptions

- **State Management**: Used React Query for server state and Zustand for client state
- **Form Handling**: React Hook Form for performance and validation with Zod
- **Styling**: Tailwind CSS + Material-UI for rapid development and consistency
- **File Structure**: Feature-based organization for scalability
- **API Communication**: Axios for HTTP requests with interceptors for error handling
- **Internationalization**: Prepared for multi-language support from the start

## 🐛 Known Issues & Limitations

- None currently reported

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Material-UI](https://mui.com/) for the component library
- [TanStack Query](https://tanstack.com/query) for excellent data fetching
- [Vercel](https://vercel.com/) for seamless deployment
