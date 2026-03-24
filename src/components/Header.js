import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Header.css";
import HeaderAvatar from "./HeaderAvatar";
import HeaderSearch from "./HeaderSearch";
import Logo from "./Logo";
import NavBar from "./NavBar";
import { createContext, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

export const NavigateContext = createContext();

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const loadUser = () => {
            const user = localStorage.getItem("currentUser");
            setCurrentUser(user ? JSON.parse(user) : null);
        };

        loadUser();

        window.addEventListener("login", loadUser);
        window.addEventListener("logout", loadUser);

        return () => {
            window.removeEventListener("login", loadUser);
            window.removeEventListener("logout", loadUser);
        };
    }, []);

    return (
        <NavigateContext.Provider value={navigate}>
            <Row className="header-container">
                <Col md={4}>
                    <Logo />
                </Col>

                <Col md={4}>
                    <NavBar />
                </Col>

                <Col md={4}>
                    <div className="d-flex gap-3 justify-content-end align-items-center">

                        {!location.pathname.startsWith("/browse") && (
                            <HeaderSearch />
                        )}

                        <Link to={currentUser ? "/profile" : "/auth"}>
                            <HeaderAvatar />
                        </Link>
                    </div>
                </Col>
            </Row>
        </NavigateContext.Provider>
    );
}