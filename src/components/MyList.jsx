import { useEffect, useState } from "react"
import axios from "axios"
import { Container, Row, Col } from "react-bootstrap"
import MangaCard from "./MangaCard"
import { useNavigate } from "react-router-dom"

export default function MyList() {
    const [mangaList, setMangaList] = useState([])
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

                const mangaData = await Promise.all(mangaPromises)

                setMangaList(mangaData.map(r => r.data))

            } catch (err) {
                console.error(err)
            }
        }

        fetchFavorites()
    }, [])

    return (
        <Container className="mt-4">
            <h2 className="text-white mb-4">My Favorite Manga</h2>

            <Row>
                {mangaList.length > 0 ? (
                    mangaList.map(m => (
                        <Col md={3} key={m.id}>
                            <MangaCard manga={m} />
                        </Col>
                    ))
                ) : (
                    <p className="text-white">No favorites yet.</p>
                )}
            </Row>
        </Container>
    )
}