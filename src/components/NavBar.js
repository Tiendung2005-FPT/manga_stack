import NavItem from "./NavItem";
import "../css/NavBar.css"
import { useLocation } from "react-router-dom";

export default function NavBar() {
    const location = useLocation();
    const page = location.pathname.slice(1);
    const active = page;

    return (
        <div className="nav-bar">
            <NavItem title={"Home"} pageActive={"home"} active={active} />
            <NavItem title={"Browse"} pageActive={"browse"} active={active} />
            <NavItem title={"For You"} pageActive={"for-you"} active={active} />
            <NavItem title={"My List"} pageActive={"my-list"} active={active} />
        </div>
    )
}