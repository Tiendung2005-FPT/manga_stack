import { useEffect, useState } from "react"
import "../css/Home.css"
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import MangaCard from "./MangaCard";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [manga, setManga] = useState([]);
    const [spotlight, setSpotlight] = useState();
    const [genres, setGenres] = useState([]);
    const params = useSearchParams();
    const [searchParams] = useSearchParams();
    const currentPage = searchParams.get("page");
    const [page, setPage] = useState(currentPage || 1)

    useEffect(() => {
        const fetchData = async () => {
            const mangaRes = await axios.get(`http://localhost:9999/manga`)
            const mangaData = mangaRes.data;

            const ratingRes = await axios.get('http://localhost:9999/ratings');
            const ratingData = ratingRes.data;

            const genreRes = await axios.get('http://localhost:9999/genres');
            const genreData = genreRes.data;

            setGenres(genreData)

            const mangaRatings = mangaData.map(m => {
                const mangaRating = ratingData.filter(r => m.id === r.mangaId);
                let sum = 0;
                const count = mangaRating.length;
                mangaRating.forEach(r => sum += r.rating);
                const average = sum / count;
                return {
                    ...m,
                    avg: average,
                    count: count
                }
            })

            const topTen = mangaRatings.sort((a, b) => b.avg - a.avg).slice(0, 10);

            const mangaSpotlight = mangaRatings.sort((a, b) => b.count - a.count)[0];

            setManga(topTen);
            setSpotlight(mangaSpotlight)
        };

        fetchData();
    }, [])
    const navigate = useNavigate();

    const handleReadFirstChapter = async () => {
        try {
            const res = await axios.get(`http://localhost:9999/chapters?mangaId=${spotlight.id}`);

            const chapters = res.data.sort((a, b) => a.chapterNumber - b.chapterNumber);

            if (chapters.length > 0) {
                const firstChapter = chapters[0];
                navigate(`/manga/${spotlight.id}/chapter/${firstChapter.id}`);
            }
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    return (
        <div className="home-container">
            {spotlight && (
                <div className="spotlight">
                    <div>
                        <Link to={`/manga/${spotlight.id}`}>
                            <img src={spotlight.coverUrl} className="spotlight-img"></img>
                        </Link>
                    </div>
                    <div className="d-flex flex-column spotlight-info">
                        <div className="spotlight-icon">SPOTLIGHT</div>
                        <h1 className="spotlight-title">{spotlight.title}</h1>
                        <div className="d-flex gap-3 align-items-center">
                            <div className="d-flex gap-1 align-items-center">
                                <i className="bi bi-star-fill"></i>
                                <div>{spotlight.avg}</div>
                            </div>
                            <div>•</div>
                            <div>{spotlight.year}</div>
                            <div>•</div>
                            <div className={`spotlight-status ${spotlight.status}`}>{spotlight.status.charAt(0).toUpperCase() + spotlight.status.slice(1)}</div>
                        </div>
                        <div className="spotlight-description">{spotlight.description}</div>
                        <div className="d-flex gap-4">
                            <button
                                className="spotlight-read-button button"
                                onClick={handleReadFirstChapter}
                            >
                                <i className="fa-solid fa-book-open-reader"></i>
                                Read First Chapter
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="trending-section">
                <div className="trending-bar">
                    <h2 className="trending-label">
                        Trending Now
                    </h2>
                </div>
                <div className="ho-grid">
                    {manga.length > 0 && manga.map(m => (
                        <div>
                            <MangaCard manga={m} genres={genres}></MangaCard>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}