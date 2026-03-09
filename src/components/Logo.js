import { useContext } from "react"
import "../css/Logo.css"
import { NavigateContext } from "./Header"

export default function Logo() {
    const navigate = useContext(NavigateContext)

    return (
        <div className="icon-container" onClick={() => navigate("/home")}>
            <i className="fa-solid fa-book-open logo-icon"></i>
            <h4 className="icon-title">
                MANGA<span className="icon-title purple">STACK</span>
            </h4>
        </div>
    )
}