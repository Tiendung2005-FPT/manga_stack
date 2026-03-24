import { useState, useEffect } from "react";
import axios from "axios";
import bcrypt from 'bcryptjs';
import { saltRounds } from "../../constants/Bcrypt.js";
import { Modal, Button, Form } from "react-bootstrap";
import "./Admin.css";

export default function UsersCRUD() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'role2' });
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('currentUser'));
        setCurrentUser(loggedIn);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:9999/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: 'role2' });
    };

    const handleShow = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ username: user.username, email: user.email, password: '', role: user.role });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const duplicateUsername = users.find(u =>
            u.username.toLowerCase() === formData.username.toLowerCase() &&
            (!editingUser || u.id !== editingUser.id)
        );
        if (duplicateUsername) {
            alert("Username already exists!");
            return;
        }

        const duplicateEmail = users.find(u =>
            u.email.toLowerCase() === formData.email.toLowerCase() &&
            (!editingUser || u.id !== editingUser.id)
        );
        if (duplicateEmail) {
            alert("Email already exists!");
            return;
        }

        try {
            const payload = { ...formData };
            if (payload.password) {
                payload.password = await bcrypt.hash(payload.password, saltRounds);
            } else if (editingUser) {
                payload.password = editingUser.password;
            }

            if (editingUser) {
                await axios.put(`http://localhost:9999/users/${editingUser.id}`, { ...editingUser, ...payload });
            } else {
                payload.id = `user${Date.now()}`;
                await axios.post("http://localhost:9999/users", payload);
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-table-header d-flex flex-column align-items-start gap-3">
                <h2 className="admin-page-title mb-0">Users Management</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="admin-search-container">
                        <span className="admin-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => handleShow()}>+ Add User</button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.filter(u =>
                            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.role === 'role1' ? 'Admin' : 'User'}</td>
                                <td>
                                    <div className="admin-action-cell">
                                        <button className="admin-btn admin-btn-warning" onClick={() => handleShow(u)}>Edit</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleClose} contentClassName="admin-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password {editingUser && "(Leave blank to keep current)"}</Form.Label>
                            <Form.Control
                                type="password"
                                required={!editingUser}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="role2">User</option>
                                <option value="role1">Admin</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" type="submit" style={{ backgroundColor: 'var(--purple1)', borderColor: 'var(--purple1)' }}>Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
