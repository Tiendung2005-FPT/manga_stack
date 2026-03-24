import NavItem from "./NavItem";
import "../css/NavBar.css"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
    const location = useLocation();
    const page = location.pathname.slice(1);
    const active = page;
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            const user = localStorage.getItem("currentUser");
            if (user) {
                const parsedUser = JSON.parse(user);
                setIsAdmin(parsedUser.role === "role1");
            } else {
                setIsAdmin(false);
            }
        };

        loadUser();

        window.addEventListener("login", loadUser);
        window.addEventListener("logout", loadUser);

        return () => {
            window.removeEventListener("login", loadUser);
            window.removeEventListener("logout", loadUser);
        };
    }, []);

    const handleMyList = () => {
        const user = JSON.parse(localStorage.getItem("currentUser"))

        if (!user) {
            alert("Please login first!")
            navigate("/auth")
            return
        }

        navigate("/my-list")
    }

    return (
        <div className="nav-bar">

            <NavItem title={"Home"} pageActive={"home"} active={active} />
            <NavItem title={"Browse"} pageActive={"browse"} active={active} />
            <div onClick={handleMyList}>
                <NavItem title={"My List"} pageActive={"my-list"} active={active} />
            </div>
            {isAdmin && (
                <div onClick={() => navigate("/admin")}>
                    <NavItem title={"Admin"} pageActive={"admin"} active={active} />
                </div>
            )}
        </div>
    )
}