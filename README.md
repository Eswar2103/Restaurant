# Restaurant Owner Reviews

A full-stack web app where restaurant owners can manage their listings and customers can leave reviews.

**Live demo:** [https://restaurant-owner-reviews.netlify.app/](https://restaurant-owner-reviews.netlify.app/)

## Features

- **Owners** - add, edit, and delete their restaurants; view all customer reviews
- **Customers** - browse restaurants by city, leave a review, and edit or delete their own review
- Authentication with role-based access (owner vs. customer)
- Paginated restaurant listings
- Average rating calculated from reviews

## Tech Stack

- React + Vite
- Supabase (database + auth)
- TanStack Query (data fetching + caching)
- React Router
- Tailwind CSS

## Getting Started

```bash
npm install
npm run dev
```

Requires a `.env` file with your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
