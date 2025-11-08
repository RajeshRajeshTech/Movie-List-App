import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext()

    // Normalize id (TMDB uses id, OMDB uses imdbID)
    const idKey = movie?.id || movie?.imdbID
    const favorite = isFavorite(idKey)

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(idKey)
        else addToFavorites(movie)
    }

    // Poster: prefer TMDB poster_path, fallback to OMDB Poster
    const posterSrc = movie?.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : movie?.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image"

    const title = movie?.title || movie?.Title || "Untitled"
    const releaseYear = movie?.release_date?.split("-")[0] || movie?.Year || (movie?.Released ? movie.Released.split(" ").slice(-1)[0] : "")

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img src={posterSrc} alt={title} />
                <div className="movie-overlay">
                    <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                        ♥
                    </button>
                </div>
            </div>

            <div className="movie-info">
                <h3>{title}</h3>
                <p className="movie-meta">
                    {releaseYear}
                    {" \u2022 "}
                    {movie?.runtime || movie?.Runtime || "--"}
                </p>

                {movie?.Director || movie?.Actors ? (
                    <p className="movie-sub">{movie?.Director ? `Director: ${movie.Director}` : ''}{movie?.Actors ? ` • ${movie.Actors}` : ''}</p>
                ) : null}

                {movie?.BoxOffice ? <p className="movie-sub">Box Office: {movie.BoxOffice}</p> : null}

                {movie?.Ratings && Array.isArray(movie.Ratings) && (
                    <div className="movie-ratings">
                        {movie.Ratings.map((r) => (
                            <span key={r.Source} className="rating">
                                {r.Source}: {r.Value}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MovieCard