import { useEffect, useState } from "react"
import "../css/Home.css"
import axios from "axios";

export default function Home() {
    const [spotlight, setSpotlight] = useState();

    useEffect(() => {
        axios.get('http://localhost:9999/manga?_limit=1')
            .then(res => setSpotlight(res.data[0]))
    }, [])

    useEffect(() => {
        console.log(spotlight);
    }, [spotlight])

    return (
        <div className="home-container">
            {spotlight && (
                <div className="spotlight">
                    <img src={spotlight.coverUrl} className="spotlight-img"></img>
                    <div className="d-flex flex-column">
                        <div className="spotlight-icon">Spotlight</div>
                        <h3 className="spotlight-title">{spotlight.title}</h3>
                        <div>{spotlight.description}</div>
                    </div>
                </div>
            )}
        </div>
    )
}