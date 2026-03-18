import { Link, useNavigate } from "react-router-dom"
import "../css/Header.css"
import HeaderAvatar from "./HeaderAvatar"
import HeaderSearch from "./HeaderSearch"
import Logo from "./Logo"
import NavBar from "./NavBar"
import { createContext } from "react"

export const NavigateContext = createContext();

export default function Header() {
    const navigate = useNavigate();
    return (
        <NavigateContext.Provider value={navigate}>
            <div className="header-container">
                <Logo />
                <NavBar />
                <div className="d-flex gap-3 justify-content-center align-items-center">
                    <HeaderSearch />
                    <Link to="/auth">
                        <HeaderAvatar />
                    </Link>
                </div>
            </div>
        </NavigateContext.Provider>
    )
}