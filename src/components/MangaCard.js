import { Link } from "react-router-dom"
import "../css/MangaCard.css"

export default function MangaCard({ manga, className }) {
    return (
        <Link to={`/manga/${manga.id}`} className="text-decoration-none">
            <div className={`${className} manga-card`} >
                <div className="manga-img-container">
                    <img src={manga.coverUrl} className="manga-img" alt={manga.title}></img>
                </div>
                <div className="manga-info-box">
                    <h6 className="manga-title">{manga.title}</h6>
                    {manga.avg && (
                        <div className="manga-rating">
                            <i className="bi bi-star-fill"></i>
                            <span>{manga.avg.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}