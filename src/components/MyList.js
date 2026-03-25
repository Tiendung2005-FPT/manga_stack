import { useEffect, useState } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import MangaCard from "./MangaCard"
import { useNavigate } from "react-router-dom"

export default function MyList() {
    const [mangaList, setMangaList] = useState([])
    const [genres, setGenres] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchFavorites = async () => {
            const user = JSON.parse(localStorage.getItem("currentUser"))

            try {
                const res = await axios.get(`http://localhost:9999/favorites?userId=${user.id}`)
                const fav = res.data[0]

                if (!fav || fav.favoriteManga.length === 0) {
                    setMangaList([])
                    return
                }

                const mangaPromises = fav.favoriteManga.map(id =>
                    axios.get(`http://localhost:9999/manga/${id}`)
                )

                const mangaData = (await Promise.all(mangaPromises)).map(r => r.data).filter(m => m.isVisible);
                setMangaList(mangaData);

            } catch (err) {
                console.error(err)
            }
        }

        const fetchGenres = async () => {
            const genreRes = await axios.get('http://localhost:9999/genres');
            const genreData = genreRes.data;
            setGenres(genreData);
        }
        fetchFavorites()
        fetchGenres();
    }, [])

    return (
        <Container className="mt-4">
            <h2 className="text-white mb-4">My Favorite Manga</h2>

            <div className="ml-grid">
                {mangaList.length > 0 ? (
                    mangaList.map(m => (
                        <div key={m.id}>
                            <MangaCard manga={m} genres={genres} />
                        </div>
                    ))
                ) : (
                    <p className="text-white">No favorites yet.</p>
                )}
            </div>
        </Container>
    )
}