# Recipe Manager

A smart recipe management platform that empowers users to streamline their culinary experience through advanced technology and intuitive design.

## Features

- 📝 Recipe Management with CRUD operations
- 📅 Meal Planning Calendar
- 🛒 Automated Shopping List Generation
- 📊 Nutritional Information Tracking
- 🎨 Modern and Responsive UI with shadcn/ui
- 💾 PostgreSQL Database Integration

## Tech Stack

- Frontend: React.js with TypeScript
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- UI Components: shadcn/ui
- State Management: TanStack Query
- Routing: wouter
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/raju8309/recipe-manager.git
   cd recipe-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and update the values:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.

## Project Structure

```
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   └── pages/        # Application pages/routes
├── server/               # Backend Express application
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Database operations
└── shared/              # Shared code between frontend and backend
    └── schema.ts        # Database schema and types
```

## API Endpoints

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe
- `POST /api/recipes` - Create a new recipe
- `PATCH /api/recipes/:id` - Update a recipe
- `DELETE /api/recipes/:id` - Delete a recipe

### Meal Plans

- `GET /api/meal-plans` - Get all meal plans
- `POST /api/meal-plans` - Create a new meal plan
- `DELETE /api/meal-plans/:id` - Delete a meal plan

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
