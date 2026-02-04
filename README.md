# MOVIE'D 🎬

A cinematic discovery platform offering curated lists, real-time search, and a modern, motion-rich interface for film enthusiasts. Inspired by Letterboxd and modern streaming aesthetics.

## 1. Dataset & Source
All movie data, images, and person details are sourced from **The Movie Database (TMDB)**.
* **Source URL:** [https://developer.themoviedb.org/docs](https://developer.themoviedb.org/docs)
* **Attribution:** This product uses the TMDB API but is not endorsed or certified by TMDB.

## 2. Data Method
Instead of scraping, this application uses **Dynamic API Consumption**:
* **Server-Side Rendering (SSR):** Landing pages and SEO-critical content (like movie details) are fetched on the server using Next.js Server Components.
* **Client-Side Caching:** Interactive elements (like the predictive search bar and genre filters) use **TanStack Query** to cache responses, ensuring instant navigation without re-fetching data unnecessarily.
* **Parallel Fetching:** `Promise.all` is used to fetch Trending, Top Rated, and Upcoming data simultaneously to minimize "waterfall" loading times.

## 3. Tech Stack & Design
**Tech Stack:**
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Dark/Light mode support)
* **Animations:** GSAP (GreenSock) for high-performance timeline animations.
* **State/Data:** TanStack Query (React Query)
* **Icons:** Lucide React

**Design Inspiration:**
* **Letterboxd:** The poster-centric grid layout and emphasis on film typography.
* **Apple TV UI:** The smooth, parallax hover effects on movie cards.
* **Minimalist Brutalism:** High contrast borders and large typographic headers.

## 4. AI Prompt Engineering
Here are examples of prompts used to accelerate development:

**Prompt 1 (Complex Animation Logic):**
> "Refactor this React movie grid component to use GSAP. I want the cards to enter with a 'waterfall' stagger effect where they slide up and fade in. However, ensure there is no flash of unstyled content (FOUC) by handling the initial CSS visibility state correctly."

**Prompt 2 (Predictive UX):**
> "Create a 'Smart Search' component for TMDB. It should use a custom debounce hook to prevent API spam. When the user types, show a dropdown with the movie poster, title, and year. Support keyboard navigation (Arrow Up/Down) and include a 'Cmd+K' shortcut to focus the input."

**Prompt 3 (API "Recipes"):**
> "Generate a configuration object for 'Curated Lists' using the TMDB Discover API. I need specific parameter combinations (genre IDs, vote counts, keywords) to create lists like 'Atmospheric Horror', 'Auteur Essentials', and 'Best of the 2020s'."

## 5. Future Improvements (With 2 More Days)
If I had 48 more hours, I would implement:

1.  **Authentication (Supabase/NextAuth):** Allow users to sign up, helping them transition from a passive viewer to an active curator.
2.  **User Watchlists:** A database table to store `user_id` and `movie_id` pairs, allowing users to "Heart" or "Watchlist" films.
3.  **Infinite Scroll:** Replace the current pagination with a `useInfiniteQuery` observer to allow endless scrolling on Category and List pages.
4.  **Skeleton Loading States:** Polish the `loading.tsx` UI to match the exact dimensions of the movie cards for a layout-shift-free experience.

## Installation

1. Clone the repo:
   ```bash
   git clone [https://github.com/shan-n/movied.git](https://github.com/shan-n/movied.git)

```

2. Install dependencies:
```bash
npm install

```


3. Add your API Key to `.env.local`:
```bash
NEXT_PUBLIC_TMDB_TOKEN=your_tmdb_read_access_token

```


4. Run the dev server:
```bash
npm run dev
