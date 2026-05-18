# Tavia

Tavia is a modern accommodation booking application built for the Noroff Project Exam 2 brief.  
The project uses the Noroff Holidaze API and allows customers to browse venues and make bookings, while venue managers can create and manage their own venues.

## Features

### All users

- Browse a list of venues
- Search venues by name, city or country
- Filter venues by price, amenities, rating and guest count
- Sort venues by newest, oldest, price, rating and guest capacity
- View a specific venue details page
- View venue availability and booked dates

### Customers

- Register as a customer using a `stud.noroff.no` email
- Log in and log out
- Create a booking
- View upcoming bookings
- Update profile avatar

### Venue managers

- Register as a venue manager using a `stud.noroff.no` email
- Log in and log out
- Create, edit and delete venues
- View upcoming bookings for managed venues
- Update profile avatar

## Built With

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Day Picker
- Date-fns
- Lucide React
- Playwright
- Noroff Holidaze API

## Getting Started

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run linting

```bash
npm run lint
```

### Run Playwright tests

```bash
npm run test:e2e
```

## Testing

The project includes Playwright end-to-end tests for core user flows:

- Home page loading
- Navigation to venues
- Venue list rendering
- Opening venue details
- Search
- Filters
- Sort by newest
- Login page rendering
- Register page rendering
- Basic responsive layout smoke test

Full customer and venue manager flows were also tested manually, including registration, login, profile update, booking creation, manager venue creation, editing, deletion and viewing managed bookings.

## Links

- Live site:
- GitHub repository:
- Figma style guide:
- Figma prototype:
- Kanban board:
- Roadmap:

## Author

Wojtek Lesniak