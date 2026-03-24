import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Admin.css";

export default function AdminLayout() {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const location = useLocation();
    const page = location.pathname.slice(1);
    const active = page;

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === "role1") {
                setIsAuthorized(true);
            } else {
                navigate("/home");
            }
        } else {
            navigate("/home");
        }
    }, [navigate]);

    if (!isAuthorized) return null;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h3 className="admin-logo">Admin Panel</h3>
                <nav className="admin-nav">
                    <Link to="/admin" className={`admin-nav-link ${active === 'admin' ? 'active' : ''}`}>Dashboard</Link>
                    <Link to="/admin/users" className={`admin-nav-link ${active === 'admin/users' ? 'active' : ''}`}>Users</Link>
                    <Link to="/admin/mangas" className={`admin-nav-link ${active === 'admin/mangas' ? 'active' : ''}`}>Mangas</Link>
                    <Link to="/admin/chapters" className={`admin-nav-link ${active === 'admin/chapters' ? 'active' : ''}`}>Chapters</Link>
                    <Link to="/admin/genres" className={`admin-nav-link ${active === 'admin/genres' ? 'active' : ''}`}>Genres</Link>
                </nav>
            </aside>
            <main className="admin-main">
                <div className="admin-content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
