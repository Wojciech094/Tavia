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

- Doc ripo : [https://docs.google.com/document/d/1vT3ZMp2DwFz39gNQzQggCmN9Vh-J__Z9QZsY8XMnPwo/edit?usp=sharing]
- Live site: [https://taviastay.netlify.app/]
- GitHub repository: [https://github.com/Wojciech094/Tavia]
- Figma style guide: [https://www.figma.com/design/Y1Q5N1LmXRXrHsxkdZQEJo/Tavia-FINAL-PROJECT?node-id=0-1&t=eYYhI2EeyZT0fCdx-1]
- Figma prototype desktop: [https://www.figma.com/proto/Y1Q5N1LmXRXrHsxkdZQEJo/Tavia-FINAL-PROJECT?node-id=1-2606&t=eYYhI2EeyZT0fCdx-1&starting-point-node-id=1%3A2606&show-proto-sidebar=1]
- Figma prototype mobile: [https://www.figma.com/proto/Y1Q5N1LmXRXrHsxkdZQEJo/Tavia-FINAL-PROJECT?node-id=1-1256&t=eYYhI2EeyZT0fCdx-1]
- Kanban board: [https://github.com/users/Wojciech094/projects/11]
- Roadmap: [https://github.com/users/Wojciech094/projects/11/views/4]

## Author

Wojtek Lesniak