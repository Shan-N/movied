const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

export async function getPopularMovies() {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour (SSG/ISR)
  });
  return res.json();
}

export async function getMovieDetails(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour (SSG/ISR)
  });
  return res.json();
}

export async function searchMovies(query: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
        accept: 'application/json',
      },
    }
  );
  return res.json();
}
export async function getMovieCredits(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour (SSG/ISR)
  });
  return res.json();
}

export async function getMovieVideos(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour (SSG/ISR)
  });
  return res.json();
}

export async function getMoviesByActor(name: string) {
  // 1. Search for the person to get their ID and Profile Path
  const searchRes = await fetch(
    `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(name)}&language=en-US`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` } }
  );
  const searchData = await searchRes.json();
  const person = searchData.results[0]; // Get the first match

  if (!person) return null;

  // 2. Get their full movie credits using their ID
  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/person/${person.id}/movie_credits?language=en-US`,
    { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` } }
  );
  const creditsData = await creditsRes.json();

  return {
    person: person, // This contains profile_path
    results: creditsData.cast, // This contains the FULL list of movies

  };
}

export async function getTopRatedMovies() {
  const res = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` }
  });
  return res.json();
}

export async function getUpcomingMovies() {
  const res = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` }
  });
  return res.json();
}

export async function getCategories() {
  const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en-US', {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` }
  });
  return res.json();
}

export async function getMoviesByCategory(genreId: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`,
    {
      headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_TOKEN}` }
    }
  );
  return res.json();
}


export async function getDiscoverMovies(params: Record<string, string | number | boolean | undefined>) {
  const urlParams = new URLSearchParams({
    language: 'en-US',
    include_adult: 'false',
    page: '1',
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;

    let finalKey = key;
    if (key === 'vote_count_gte') finalKey = 'vote_count.gte';
    if (key === 'vote_count_lte') finalKey = 'vote_count.lte';
    if (key === 'vote_average_gte') finalKey = 'vote_average.gte';
    if (key === 'primary_release_date_gte') finalKey = 'primary_release_date.gte';
    if (key === 'primary_release_date_lte') finalKey = 'primary_release_date.lte';
    
    urlParams.set(finalKey, String(value));
  });

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${urlParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 }
  });

  return res.json();
}

export async function getRandomMovie() {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: 'application/json',
    },
    next: { revalidate: 3600 } // Revalidate every hour (SSG/ISR)
  });
  const data = await res.json();
  const results = data.results;
  const randomIndex = Math.floor(Math.random() * results.length);
  return results[randomIndex];
}