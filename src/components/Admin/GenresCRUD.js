import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Admin.css";

export default function GenresCRUD() {
    const [genres, setGenres] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingGenre, setEditingGenre] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await axios.get("http://localhost:9999/genres");
            setGenres(res.data);
        } catch (error) {
            console.error("Failed to fetch genres", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingGenre(null);
        setFormData({ name: '' });
    };

    const handleShow = (genre = null) => {
        if (genre) {
            setEditingGenre(genre);
            setFormData({ name: genre.name });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const duplicate = genres.find(g =>
            g.name.toLowerCase() === formData.name.toLowerCase() &&
            (!editingGenre || g.id !== editingGenre.id)
        );
        if (duplicate) {
            alert("Genre name already exists!");
            return;
        }

        try {
            const payload = { ...formData };
            if (editingGenre) {
                await axios.put(`http://localhost:9999/genres/${editingGenre.id}`, { ...editingGenre, ...payload });
            } else {
                payload.id = crypto.randomUUID();
                await axios.post("http://localhost:9999/genres", payload);
            }
            fetchGenres();
            handleClose();
        } catch (error) {
            console.error("Failed to save genre", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-table-header d-flex flex-column align-items-start gap-3">
                <h2 className="admin-page-title mb-0">Genres Management</h2>
                <div className="d-flex gap-3 align-items-center">
                    <div className="admin-search-container">
                        <span className="admin-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search genres..."
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => handleShow()}>+ Add Genre</button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres.filter(g =>
                            g.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(g => (
                            <tr key={g.id}>
                                <td>{g.id}</td>
                                <td>{g.name}</td>
                                <td>
                                    <div className="admin-action-cell">
                                        <button className="admin-btn admin-btn-warning" onClick={() => handleShow(g)}>Edit</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {genres.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-muted">No genres found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleClose} contentClassName="admin-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{editingGenre ? 'Edit Genre' : 'Add Genre'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Genre Name</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
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
