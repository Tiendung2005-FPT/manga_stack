import { useState } from "react"
import { saltRounds } from "../constants/Bcrypt.js";
import bcrypt from 'bcryptjs';
import axios from 'axios';
import "../css/Auth.css";
import { useNavigate } from "react-router-dom";

export default function Auth() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [screen, setScreen] = useState("register")
    const salt = saltRounds;
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            alert('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const existingUsersResponse = await axios.get('http://localhost:9999/users');
            const existingUsers = existingUsersResponse.data;

            const usernameExists = existingUsers.some(user => user.username.toLowerCase() === username.toLowerCase());
            const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());

            if (usernameExists) {
                alert('Username already exists');
                return;
            }

            if (emailExists) {
                alert('Email already exists');
                return;
            }

            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = {
                id: `user${Date.now()}`,
                username: username.trim(),
                email: email.trim(),
                password: hashedPassword,
                role: "role2"
            };

            await axios.post('http://localhost:9999/users', newUser);

            alert('Registration successful! Please login.');
            setScreen('login');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        }
    }

    const handleLogin = async () => {
        const identifier = username || email;

        if (!identifier.trim() || !password.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const usersResponse = await axios.get('http://localhost:9999/users');
            const users = usersResponse.data;

            const user = users.find(u =>
                u.username.toLowerCase() === identifier.toLowerCase() ||
                u.email.toLowerCase() === identifier.toLowerCase()
            );

            if (!user) {
                alert('User not found');
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                alert('Invalid password');
                return;
            }

            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }));

            alert('Login successful!');
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again.');
        }
    }

    return (
        <div className="auth-container">
            <div className="form-container">
                {screen === 'login' ? (
                    <h2 className="text-purple auth-title">Login to your MangaStack Account</h2>
                ) : (
                    <h2 className="text-purple auth-title">Create your MangaStack Account</h2>
                )}
                <div className="d-flex flex-column gap-3 w-75">
                    {screen === 'register' && (
                        <>
                            <div>
                                <div className="text-white">Username</div>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <div className="text-white">Email Address</div>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    {screen === 'login' && (
                        <div>
                            <div className="text-white">Username or Email</div>
                            <input
                                type="text"
                                placeholder="Enter your username or email"
                                value={username || email}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                    )}
                    <div>
                        <div className="text-white">Password</div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {screen === 'register' && (
                        <div>
                            <div className="text-white">Confirm Password</div>
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <button className="button btn-purple" onClick={screen === 'login' ? handleLogin : handleRegister}>
                        {screen === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                    <div className="auth-toggle">
                        {screen === 'login' ? (
                            <>
                                <span className="text-white">Don't have an account? </span>
                                <span className="text-purple auth-link" onClick={() => setScreen('register')}>Sign Up</span>
                            </>
                        ) : (
                            <>
                                <span className="text-white">Already have an account? </span>
                                <span className="text-purple auth-link" onClick={() => setScreen('login')}>Log In</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}