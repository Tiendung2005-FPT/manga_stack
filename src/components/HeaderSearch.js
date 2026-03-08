import { Form } from "react-bootstrap"
import "../css/HeaderSearch.css"

export default function HeaderSearch() {
    return (
        <div className="header-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input className="header-search-input" placeholder="Seach manga..." />
        </div>
    )
}