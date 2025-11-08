const API_KEY = "1d454c9d";
const BASE_URL = "https://www.omdbapi.com/";

// OMDB returns either a single movie object (when fetched by id/title)
// or a Search result with `Search: [...]`. Normalize to always return an array
export const getPopularMovies = async () => {
  // Fetch a small curated list of popular titles using the `t=` (title) parameter
  const POPULAR_TITLES = [
    'Guardians of the Galaxy Vol. 2',
    'Inception',
    'The Dark Knight',
    'Interstellar',
    'The Matrix'
  ];

  const details = await Promise.all(
    POPULAR_TITLES.map(async (title) => {
      try {
        const res = await fetch(`${BASE_URL}?t=${encodeURIComponent(title)}&apikey=${API_KEY}`);
        return res.json();
      } catch (e) {
        return null;
      }
    })
  );

  return details.filter(d => d && d.Response === 'True');
};

export const searchMovies = async (query) => {
  // First try the search endpoint which returns a `Search` array of lightweight items
  const res = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  const data = await res.json();

  if (data && data.Response === "True" && Array.isArray(data.Search)) {
    // To provide richer cards (runtime, director, ratings), fetch full details for the first page
    const details = await Promise.all(
      data.Search.slice(0, 10).map(async (item) => {
        const dres = await fetch(`${BASE_URL}?i=${item.imdbID}&apikey=${API_KEY}`);
        return dres.json();
      })
    );
    return details.filter(d => d && d.Response === "True");
  }

  // If the API returned a single movie object (e.g., exact title/id), wrap it
  if (data && data.Response === "True" && data.Title) return [data];

  return [];
};