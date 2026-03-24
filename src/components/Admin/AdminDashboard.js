import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        mangas: 0,
        chapters: 0,
        genres: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, mangasRes, chaptersRes, genresRes] = await Promise.all([
                    axios.get('http://localhost:9999/users'),
                    axios.get('http://localhost:9999/manga'),
                    axios.get('http://localhost:9999/chapters'),
                    axios.get('http://localhost:9999/genres')
                ]);

                setStats({
                    users: usersRes.data.length,
                    mangas: mangasRes.data.length,
                    chapters: chaptersRes.data.length,
                    genres: genresRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch admin statistics", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <h2 className="admin-page-title">Admin Dashboard</h2>
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-title">Total Users</div>
                    <div className="admin-stat-value">{stats.users}</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-title">Total Mangas</div>
                    <div className="admin-stat-value">{stats.mangas}</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-title">Total Chapters</div>
                    <div className="admin-stat-value">{stats.chapters}</div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-title">Total Genres</div>
                    <div className="admin-stat-value">{stats.genres}</div>
                </div>
            </div>
        </div>
    );
}
