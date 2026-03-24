import NavItem from "./NavItem";
import "../css/NavBar.css"
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
    const location = useLocation();
    const page = location.pathname.slice(1);
    const active = page;
    const navigate = useNavigate()

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
            <NavItem title={"Home"} pageActive={"home"} />
            <NavItem title={"Browse"} pageActive={"browse"} />
            <NavItem title={"For You"} pageActive={"for-you"} />
            <div onClick={handleMyList}>
                <NavItem title={"My List"} pageActive={"my-list"} />
            </div>
        </div>
    )
}