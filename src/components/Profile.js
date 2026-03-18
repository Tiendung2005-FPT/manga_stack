import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Auth.css";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/auth');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auth-container">
            <div className="form-container">
                <h2 className="text-purple auth-title">Profile</h2>
                <div className="d-flex flex-column gap-3 w-75">
                    <div>
                        <div className="text-white">Username</div>
                        <div className="profile-info">{user.username}</div>
                    </div>
                    <div>
                        <div className="text-white">Email</div>
                        <div className="profile-info">{user.email}</div>
                    </div>
                    <div>
                        <div className="text-white">Role</div>
                        <div className="profile-info">{user.role === 'role1' ? 'Admin' : 'User'}</div>
                    </div>
                    <div>
                        <div className="text-white">User ID</div>
                        <div className="profile-info">{user.id}</div>
                    </div>
                    <button className="button btn-purple" onClick={handleLogout}>
                        Logout
                    </button>
                    <div className="auth-toggle">
                        <span className="text-white">Want to go back? </span>
                        <span className="text-purple auth-link" onClick={() => navigate('/')}>
                            Home
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
