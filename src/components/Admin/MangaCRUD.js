import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Admin.css";

export default function MangaCRUD() {
    const [mangas, setMangas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingManga, setEditingManga] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coverUrl: '',
        status: 'ongoing',
        isVisible: true,
        year: new Date().getFullYear()
    });

    useEffect(() => {
        fetchMangas();
    }, []);

    const fetchMangas = async () => {
        try {
            const res = await axios.get("http://localhost:9999/manga");
            setMangas(res.data);
        } catch (error) {
            console.error("Failed to fetch mangas", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingManga(null);
        setFormData({
            title: '',
            description: '',
            coverUrl: '',
            status: 'ongoing',
            isVisible: true,
            year: new Date().getFullYear()
        });
    };

    const handleShow = (manga = null) => {
        if (manga) {
            setEditingManga(manga);
            setFormData({
                title: manga.title,
                description: manga.description,
                coverUrl: manga.coverUrl,
                status: manga.status,
                isVisible: manga.isVisible,
                year: manga.year
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const duplicate = mangas.find(m =>
            m.title.toLowerCase() === formData.title.toLowerCase() &&
            (!editingManga || m.id !== editingManga.id)
        );
        if (duplicate) {
            alert("Manga title already exists!");
            return;
        }

        try {
            const payload = { ...formData };
            payload.year = parseInt(payload.year, 10);

            if (editingManga) {
                await axios.put(`http://localhost:9999/manga/${editingManga.id}`, { ...editingManga, ...payload });
            } else {
                payload.id = crypto.randomUUID();
                payload.uploadedAt = new Date().toISOString();
                payload.genres = [];
                await axios.post("http://localhost:9999/manga", payload);
            }
            fetchMangas();
            handleClose();
        } catch (error) {
            console.error("Failed to save manga", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-table-header">
                <h2 className="admin-page-title mb-0">Manga Management</h2>
                <button className="admin-btn admin-btn-primary" onClick={() => handleShow()}>+ Add Manga</button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Visible</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mangas.map(m => (
                            <tr key={m.id}>
                                <td>
                                    <img src={m.coverUrl} alt="Cover" style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {m.title}
                                </td>
                                <td><span style={{ textTransform: 'capitalize' }}>{m.status}</span></td>
                                <td>{m.isVisible ? 'Yes' : 'No'}</td>
                                <td>{m.year}</td>
                                <td>
                                    <div className="admin-action-cell">
                                        <button className="admin-btn admin-btn-warning" onClick={() => handleShow(m)}>Edit</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg" contentClassName="admin-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{editingManga ? 'Edit Manga' : 'Add Manga'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Cover URL</Form.Label>
                            <Form.Control
                                type="url"
                                required
                                value={formData.coverUrl}
                                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                            />
                        </Form.Group>
                        <div className="row mb-3">
                            <Form.Group className="col-md-4">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-md-4">
                                <Form.Label>Release Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    required
                                    min="1950" max="2100"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="col-md-4 d-flex align-items-end mb-2">
                                <Form.Check
                                    type="switch"
                                    id="is-visible-switch"
                                    label="Is Visible"
                                    checked={formData.isVisible}
                                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                                />
                            </Form.Group>
                        </div>
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
