import { useNavigate } from "react-router-dom"
import "../css/HeaderSearch.css"

export default function HeaderSearch() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            navigate(`/browse?search=${encodeURIComponent(e.target.value.trim())}`);
        }
    };

    return (
        <div className="header-search-container">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
                className="header-search-input"
                placeholder="Search manga..."
                onKeyDown={handleSearch}
            />
        </div>
    )
}