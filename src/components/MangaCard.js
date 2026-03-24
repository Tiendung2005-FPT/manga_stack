import React from "react";
import { Link } from "react-router-dom";
import "../css/MangaCard.css";

export default function MangaCard({ manga, genres }) {
    const genreNames = (manga.genres || [])
        .map(id => {
            const g = genres.find(g => g.id === id);
            return g?.name ?? null;
        })
        .filter(Boolean)
        .slice(0, 3);

    return (
        <Link to={`/manga/${manga.id}`} className="mc-card">
            <div className="mc-card__cover">
                <img
                    src={manga.coverUrl || `https://picsum.photos/seed/${manga.id}/200/280`}
                    alt={manga.title}
                    loading="lazy"
                />
                <span className={`mc-card__status mc-card__status--${manga.status}`}>
                    {manga.status}
                </span>
            </div>
            <div className="mc-card__body">
                <h3 className="mc-card__title">{manga.title}</h3>
                <div className="mc-card__meta d-flex flex-column">
                    <span className="mc-card__year">{manga.year}</span>
                    <div className="mc-card__genres">
                        {genreNames.map(n => (
                            <span key={n} className="mc-card__genre-tag">{n}</span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}