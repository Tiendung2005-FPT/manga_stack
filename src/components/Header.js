import "../css/Header.css"
import HeaderAvatar from "./HeaderAvatar"
import HeaderSearch from "./HeaderSearch"
import Logo from "./Logo"
import NavBar from "./NavBar"

export default function Header() {
    return (
        <div className="header-container">
            <Logo />
            <NavBar />
            <div className="d-flex gap-3 justify-content-center align-items-center">
                <HeaderSearch />
                <HeaderAvatar />
            </div>
        </div>
    )
}