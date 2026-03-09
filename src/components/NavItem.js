import { useContext } from "react"
import { NavigateContext } from "./Header"

export default function NavItem({ title, pageActive, active }) {
    const navigate = useContext(NavigateContext)
    return (
        <div className={`nav-item ${pageActive === active ? 'active' : ''}`} onClick={() => navigate(`/${pageActive}`)}>
            {title}
        </div>
    )
}