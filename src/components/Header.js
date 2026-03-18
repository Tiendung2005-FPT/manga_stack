import { Link, useNavigate } from "react-router-dom"
import "../css/Header.css"
import HeaderAvatar from "./HeaderAvatar"
import HeaderSearch from "./HeaderSearch"
import Logo from "./Logo"
import NavBar from "./NavBar"
import { createContext, useState, useEffect } from "react"

export const NavigateContext = createContext();

export default function Header() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        setCurrentUser(user ? JSON.parse(user) : null);
    }, []);

    return (
        <NavigateContext.Provider value={navigate}>
            <div className="header-container">
                <Logo />
                <NavBar />
                <div className="d-flex gap-3 justify-content-center align-items-center">
                    <HeaderSearch />
                    <Link to={currentUser ? "/profile" : "/auth"}>
                        <HeaderAvatar />
                    </Link>
                </div>
            </div>
        </NavigateContext.Provider>
    )
}