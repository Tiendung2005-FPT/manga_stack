import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "../css/MangaDetail.css"
import axios from "axios"
import { Container, Row, Col, Button } from "react-bootstrap"

export default function MangaDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [manga, setManga] = useState(null)
    const [chapters, setChapters] = useState([])
    const [genres, setGenres] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)
    const [userRating, setUserRating] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const mangaRes = await axios.get(`http://localhost:9999/manga/${id}`)
                const mangaData = mangaRes.data

                const ratingsRes = await axios.get(`http://localhost:9999/ratings?mangaId=${id}`)
                const ratingData = ratingsRes.data

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

                // chapters
                const chaptersRes = await axios.get(`http://localhost:9999/chapters?mangaId=${id}`)
                const chaptersData = chaptersRes.data.sort((a, b) => a.chapterNumber - b.chapterNumber)

                // genres
                if (mangaData.genres?.length > 0) {
                    const genrePromises = mangaData.genres.map(gid =>
                        axios.get(`http://localhost:9999/genres/${gid}`)
                    )
                    const genreResponses = await Promise.all(genrePromises)
                    setGenres(genreResponses.map(res => res.data))
                }

                setManga({
                    ...mangaData,
                    avgRating,
                    ratingCount: ratingData.length
                })

                setChapters(chaptersData)

            } catch (err) {
                console.error(err)
            }
        }

        if (id) fetchData()
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
                alert("Added to favorites!")
            } else {
                let updated

                if (fav.favoriteManga.includes(id)) {
                    updated = fav.favoriteManga.filter(m => m !== id)
                    setIsFavorite(false)
                    alert("Removed from favorites!")
                } else {
                    updated = [...fav.favoriteManga, id]
                    setIsFavorite(true)
                    alert("Added to favorites!")
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

            alert("Rated successfully!")

        } catch (err) {
            console.error(err)
        }
    }

    if (!manga) {
        return (
            <Container className="text-center text-white py-5">
                <h2>Loading...</h2>
            </Container>
        )
    }

    return (
        <div className="manga-detail-container">
            <Row>
                <Col md={4}>
                    <img src={manga.coverUrl} alt={manga.title} className="manga-detail-cover" />

                    <div className="mt-3">
                        <button className="w-100 mb-2 btn-purple">
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

                <Col md={8}>
                    <h1>{manga.title}</h1>

                    <p>
                        ⭐ {manga.avgRating?.toFixed(1) || "0.0"} ({manga.ratingCount || 0} reviews)
                    </p>

                    <div className="mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <i
                                key={star}
                                className={`bi ${star <= userRating ? "bi-star-fill text-warning" : "bi-star text-secondary"}`}
                                style={{ cursor: "pointer", fontSize: "20px", marginRight: "5px" }}
                                onClick={() => handleRating(star)}
                            ></i>
                        ))}
                    </div>

                    <p>{manga.description}</p>

                    <div>
                        {genres.map(g => (
                            <span key={g.id} className="me-2">{g.name}</span>
                        ))}
                    </div>
                </Col>
            </Row>

            {/* CHAPTERS */}
            <Row className="mt-4">
                <Col>
                    <h3>Chapters ({chapters.length})</h3>

                    {chapters.map(c => (
                        <div key={c.id}>
                            <Link to={`/manga/${id}/chapter/${c.id}`}>
                                Chapter {c.chapterNumber}
                            </Link>
                        </div>
                    ))}
                </Col>
            </Row>
        </div>
    )
}