# Event Tracking & Ticketing Backend

A robust, scalable backend for event management, ticketing, and booking, built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and PostgreSQL.

---

## 🚀 Features

- **User Authentication & Roles:** Supports `admin`, `organizer`, and `attendee` roles with JWT-based authentication.
- **Event Management:** Organizers can create, update, and manage events and venues.
- **Ticketing System:** Define ticket types, set limits, and manage availability.
- **Booking & Payments:** Attendees can book tickets; supports payment tracking.
- **Role-based Access Control:** Secure endpoints for different user roles.
- **Prisma ORM:** Type-safe database access and migrations.
- **Extensible:** Modular codebase for easy feature addition.

---

## 🏗️ Project Structure

```text
src/
  ├── auth/         # Authentication, guards, roles, JWT
  ├── bookings/     # Ticket booking logic
  ├── events/       # Event CRUD
  ├── tickets/      # Ticket types and management
  ├── users/        # User management
  ├── venues/       # Venue management
  ├── prisma/       # Prisma service and module
  └── common/       # Shared utilities, decorators, etc.
prisma/
  ├── schema.prisma # Prisma schema
  └── migrations/   # DB migrations
```

---

## 🛠️ Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/event-tracking-backend.git
cd event-tracking-backend
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_jwt_secret"
```

> **Note:** Update the `DATABASE_URL` with your PostgreSQL credentials.

### 4. **Set up the Database**

Run Prisma migrations and generate the client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. **Start the Application**

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 🧪 Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📚 API Overview

### Authentication

- `POST /auth/register` — Register a new user  
- `POST /auth/login` — Login and receive JWT  
- `POST /auth/refresh-token` — Refresh JWT

### Users

- `GET /users/me` — Get current user profile (requires JWT)

### Events

- `POST /events` — Create event (organizer only)  
- `GET /events` — List all events  
- `PATCH /events/:id` — Update event (organizer only)  
- `DELETE /events/:id` — Delete event (organizer only)

### Tickets

- `POST /tickets/tickets` — Create ticket type (organizer only)  
- `GET /tickets/events/:id/tickets` — List tickets for an event

### Bookings

- `POST /bookings` — Book tickets (attendee)  
- `GET /bookings/me` — View your bookings

### Venues

- `POST /venues` — Create venue (organizer only)  
- `GET /venues` — List all venues

> **Note:** Most endpoints require authentication and proper role.

---

## 🧑‍💻 Technologies Used

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📝 Prisma Schema Example

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(attendee)
  events    Event[]
  bookings  Booking[]
}

enum Role {
  admin
  organizer
  attendee
}
```

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/feature-name`)  
3. Commit your changes (`git commit -am 'Add new feature'`)  
4. Push to the branch (`git push origin feature/feature-name`)  
5. Open a Pull Request

---

## 🛡️ License

This project is [MIT licensed](LICENSE).

---

## 📬 Contact

For questions, open an issue or contact the maintainer at **asegidadane27@gmail.com**.

---

**Happy coding!**
