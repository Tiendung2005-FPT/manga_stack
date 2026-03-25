import { useContext, useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "../css/MangaDetail.css"
import axios from "axios"
import { Container, Row, Col, Button, Badge, Table } from "react-bootstrap"

export default function MangaDetail() {
    const { id } = useParams()
    const [manga, setManga] = useState(null)
    const [chapters, setChapters] = useState([])
    const [genres, setGenres] = useState([])

    const [isFavorite, setIsFavorite] = useState(false)
    const [userRating, setUserRating] = useState(0)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mangaRes = await axios.get(`http://localhost:9999/manga/${id}`)
                const mangaData = mangaRes.data
                if (!mangaData.isVisible) {
                    setManga(null);
                    return;
                }

                const ratingsRes = await axios.get('http://localhost:9999/ratings')
                const ratingData = ratingsRes.data.filter(r => r.mangaId === id)

                let avgRating = 0
                if (ratingData.length > 0) {
                    const sum = ratingData.reduce((acc, r) => acc + r.rating, 0)
                    avgRating = sum / ratingData.length
                }

                const user = JSON.parse(localStorage.getItem("currentUser"))
                if (user) {
                    const myRate = ratingData.find(r => r.userId === user.id)
                    if (myRate) setUserRating(myRate.rating)
                }

                const chaptersRes = await axios.get(`http://localhost:9999/chapters?mangaId=${id}`)
                const chaptersData = chaptersRes.data.filter(c => c.isVisible);

                if (mangaData.genres && mangaData.genres.length > 0) {
                    const genrePromises = mangaData.genres.map(genreId =>
                        axios.get(`http://localhost:9999/genres/${genreId}`)
                    )
                    const genreResponses = await Promise.all(genrePromises)
                    const genresData = genreResponses.map(res => res.data)
                    setGenres(genresData)
                }

                setManga({ ...mangaData, avgRating, ratingCount: ratingData.length })
                setChapters(chaptersData.sort((a, b) => a.chapterNumber - b.chapterNumber))

            } catch (error) {
                console.error('Error fetching manga details:', error)
            }
        }

        if (id) {
            fetchData()
        }
    }, [id])

    useEffect(() => {
        const checkFavorite = async () => {
            const user = JSON.parse(localStorage.getItem("currentUser"))
            if (!user) return

            try {
                const res = await axios.get(`http://localhost:9999/favorites?userId=${user.id}`)
                const fav = res.data[0]

                if (fav?.favoriteManga.includes(id)) {
                    setIsFavorite(true)
                }
            } catch (err) {
                console.error(err)
            }
        }

        checkFavorite()
    }, [id])

    const handleFavorite = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"))

        if (!user) {
            alert("You must login first!")
            navigate("/auth")
            return
        }

        try {
            const res = await axios.get(`http://localhost:9999/favorites?userId=${user.id}`)
            let fav = res.data[0]

            if (!fav) {
                await axios.post("http://localhost:9999/favorites", {
                    userId: user.id,
                    favoriteManga: [id]
                })
                setIsFavorite(true)
            } else {
                let updated

                if (fav.favoriteManga.includes(id)) {
                    updated = fav.favoriteManga.filter(m => m !== id)
                    setIsFavorite(false)
                } else {
                    updated = [...fav.favoriteManga, id]
                    setIsFavorite(true)
                }

                await axios.put(`http://localhost:9999/favorites/${fav.id}`, {
                    ...fav,
                    favoriteManga: updated
                })
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleRating = async (star) => {
        const user = JSON.parse(localStorage.getItem("currentUser"))

        if (!user) {
            alert("You must login first!")
            navigate("/auth")
            return
        }

        try {
            const res = await axios.get(
                `http://localhost:9999/ratings?mangaId=${id}&userId=${user.id}`
            )
            const existing = res.data[0]

            if (existing) {
                await axios.put(`http://localhost:9999/ratings/${existing.id}`, {
                    ...existing,
                    rating: star
                })
            } else {
                await axios.post("http://localhost:9999/ratings", {
                    id: "rating-" + Date.now(),
                    mangaId: id,
                    userId: user.id,
                    rating: star
                })
            }

            setUserRating(star)

            const allRatings = await axios.get(`http://localhost:9999/ratings?mangaId=${id}`)
            const list = allRatings.data

            const sum = list.reduce((acc, r) => acc + r.rating, 0)
            const avg = list.length ? sum / list.length : 0

            setManga(prev => ({
                ...prev,
                avgRating: avg,
                ratingCount: list.length
            }))


        } catch (err) {
            console.error(err)
        }
    }

    const handleReadFirstChapter = async () => {
        try {
            const res = await axios.get(`http://localhost:9999/chapters?mangaId=${manga.id}`);

            const chapters = res.data
                .filter(c => c.isVisible)
                .sort((a, b) => a.chapterNumber - b.chapterNumber);

            if (chapters.length > 0) {
                const firstChapter = chapters[0];
                navigate(`/manga/${manga.id}/chapter/${firstChapter.id}`);
            }
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

    if (!manga) {
        return (
            <Container className="manga-detail-container">
                <div className="text-center text-white py-5">
                    <h2>Manga not found</h2>
                    <Link to="/home" className="btn btn-primary">Back to Home</Link>
                </div>
            </Container>
        )
    }

    return (
        <div className="manga-detail-container">
            <Row className="manga-detail-header">
                <Col md={4} className="manga-cover-section">
                    <img src={manga.coverUrl} alt={manga.title} className="manga-detail-cover" />
                    <div className="manga-actions mt-3">
                        <button className="w-100 mb-2 btn-purple" onClick={() => handleReadFirstChapter()}>
                            <i className="bi bi-book-open-reader me-2"></i>
                            Start Reading
                        </button>

                        <Button
                            variant={isFavorite ? "warning" : "outline-secondary"}
                            className="w-100 mb-2"
                            onClick={handleFavorite}
                        >
                            <i className={`bi ${isFavorite ? "bi-bookmark-fill" : "bi-bookmark"} me-2`}></i>
                            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </Button>
                    </div>
                </Col>

                <Col md={8} className="manga-info-section">
                    <div className="manga-title-section">
                        <h1 className="manga-detail-title">{manga.title}</h1>
                        <div className="manga-meta d-flex gap-3 mb-2">
                            <div className="d-flex align-items-center gap-1">
                                <i className="bi bi-star-fill text-warning"></i>
                                <span className="fw-bold">{manga.avgRating?.toFixed(1) || 'N/A'}</span>
                                <span className="text-white m-0">({manga.ratingCount || 0} reviews)</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <i className="bi bi-calendar"></i>
                                <span>{manga.year}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                <i className="bi bi-circle-fill text-success"></i>
                                <span className={`status-badge ${manga.status}`}>
                                    {manga.status?.charAt(0).toUpperCase() + manga.status?.slice(1) || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-3 d-flex align-items-center gap-2">
                            <span className="text-white">Your Rating:</span>
                            <div>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <i
                                        key={star}
                                        className={`bi ${star <= userRating ? "bi-star-fill text-warning" : "bi-star text-secondary"}`}
                                        style={{ cursor: "pointer", fontSize: "20px", marginRight: "5px" }}
                                        onClick={() => handleRating(star)}
                                    ></i>
                                ))}
                            </div>
                        </div>

                        <div className="genres-section mb-3">
                            {genres.map(genre => (
                                <div key={genre.id} className="genre-badge me-2">
                                    {genre.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="manga-description-section">
                        <h3>Description</h3>
                        <p className="manga-description">{manga.description}</p>
                    </div>

                </Col>
            </Row>

            <Row className="manga-chapters-section mt-5">
                <Col>
                    <h2 className="section-title mb-2">Chapters ({chapters.length})</h2>
                    <div className="d-flex">
                        {chapters.length > 0 ? (
                            <table className="chapters-list">
                                <tbody>
                                    {chapters.map(chapter => (
                                        <tr key={chapter.id}>
                                            <Link className="chapter-item" to={`/manga/${id}/chapter/${chapter.id}`}>
                                                <div className="chapter-info">
                                                    <h5 className="chapter-title">
                                                        Chapter {chapter.chapterNumber}: {chapter.title || 'Untitled'}
                                                    </h5>
                                                </div>
                                                <div className="chapter-action">
                                                    <i className="bi bi-chevron-right"></i>
                                                </div>
                                            </Link>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-white">No chapters available yet.</p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    )
}