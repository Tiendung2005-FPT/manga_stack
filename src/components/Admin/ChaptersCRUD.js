import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./Admin.css";

export default function ChaptersCRUD() {
    const [chapters, setChapters] = useState([]);
    const [mangas, setMangas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [formData, setFormData] = useState({
        mangaId: '',
        chapterNumber: 1,
        title: '',
        isVisible: true,
        pages: ''
    });
    const [filterMangaId, setFilterMangaId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMangas();
        fetchChapters();
    }, []);

    const fetchMangas = async () => {
        try {
            const res = await axios.get("http://localhost:9999/manga");
            setMangas(res.data);
        } catch (error) {
            console.error("Failed to fetch mangas", error);
        }
    };

    const fetchChapters = async () => {
        try {
            const res = await axios.get("http://localhost:9999/chapters");
            setChapters(res.data);
        } catch (error) {
            console.error("Failed to fetch chapters", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setEditingChapter(null);
        setFormData({
            mangaId: mangas.length > 0 ? mangas[0].id : '',
            chapterNumber: 1,
            title: '',
            isVisible: true,
            pages: ''
        });
    };

    const handleShow = (chapter = null) => {
        if (chapter) {
            setEditingChapter(chapter);
            setFormData({
                mangaId: chapter.mangaId,
                chapterNumber: chapter.chapterNumber,
                title: chapter.title,
                isVisible: chapter.isVisible,
                pages: chapter.pages ? chapter.pages.join('\n') : ''
            });
        } else {
            setFormData({
                ...formData,
                mangaId: filterMangaId || (mangas.length > 0 ? mangas[0].id : '')
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const num = parseFloat(formData.chapterNumber);
        const mId = formData.mangaId;

        const duplicate = chapters.find(c =>
            c.mangaId === mId &&
            c.chapterNumber == num &&
            (!editingChapter || c.id !== editingChapter.id)
        );
        console.log(duplicate);
        if (duplicate) {
            alert(`Chapter ${num} already exists for this manga!`);
            return;
        }

        const mangaChapters = chapters.filter(c =>
            c.mangaId === mId &&
            (!editingChapter || c.id !== editingChapter.id)
        );

        const maxChapter = mangaChapters.length > 0
            ? Math.max(...mangaChapters.map(c => c.chapterNumber))
            : 0;

        if (num > maxChapter + 1) {
            alert(`You cannot skip chapters. Maximum allowed chapter number for this manga is ${maxChapter + 1}.`);
            return;
        }

        try {
            const payload = { ...formData };
            payload.chapterNumber = num;
            payload.pages = payload.pages.split('\n').map(p => p.trim()).filter(p => p !== '');

            if (editingChapter) {
                await axios.put(`http://localhost:9999/chapters/${editingChapter.id}`, { ...editingChapter, ...payload });
            } else {
                payload.id = crypto.randomUUID();
                await axios.post("http://localhost:9999/chapters", payload);
            }
            fetchChapters();
            handleClose();
        } catch (error) {
            console.error("Failed to save chapter", error);
        }
    };

    const filteredChapters = filterMangaId
        ? chapters.filter(c => c.mangaId === filterMangaId)
        : chapters;

    const getMangaTitle = (mangaId) => {
        const m = mangas.find(m => m.id === mangaId);
        return m ? m.title : 'Unknown Manga';
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-table-header flex-wrap gap-3">
                <h2 className="admin-page-title mb-0">Chapters Management</h2>

                <div className="d-flex align-items-center gap-3">
                    <div className="admin-search-container">
                        <span className="admin-search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search chapters..."
                            className="admin-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Form.Select
                        value={filterMangaId}
                        onChange={(e) => setFilterMangaId(e.target.value)}
                        style={{ width: '250px', backgroundColor: 'var(--black)', color: 'var(--white)', borderColor: 'var(--grey2)' }}
                    >
                        <option value="" className="select-option">All Mangas</option>
                        {mangas.map(m => (
                            <option key={m.id} value={m.id} className="select-option">{m.title}</option>
                        ))}
                    </Form.Select>
                    <button className="admin-btn admin-btn-primary" onClick={() => handleShow()}>+ Add Chapter</button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Manga</th>
                            <th>Chapter Num</th>
                            <th>Title</th>
                            <th>Pages</th>
                            <th>Visible</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChapters.filter(c => 
                            (c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             c.chapterNumber.toString().includes(searchTerm))
                        ).map(c => (
                            <tr key={c.id}>
                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {getMangaTitle(c.mangaId)}
                                </td>
                                <td>{c.chapterNumber}</td>
                                <td>{c.title || '-'}</td>
                                <td>{c.pages ? c.pages.length : 0} pages</td>
                                <td>{c.isVisible ? 'Yes' : 'No'}</td>
                                <td>
                                    <div className="admin-action-cell">
                                        <button className="admin-btn admin-btn-warning" onClick={() => handleShow(c)}>Edit</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredChapters.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted">No chapters found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg" contentClassName="admin-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>{editingChapter ? 'Edit Chapter' : 'Add Chapter'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Manga</Form.Label>
                            <Form.Select
                                required
                                value={formData.mangaId}
                                onChange={(e) => setFormData({ ...formData, mangaId: e.target.value })}
                                disabled={!!editingChapter}
                                className={`${editingChapter ? 'text-dark' : ''}`}

                            >
                                <option value="">Select Manga</option>
                                {mangas.map(m => (
                                    <option key={m.id} value={m.id}>{m.title}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="row mb-3">
                            <Form.Group className="col-md-6">
                                <Form.Label>Chapter Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    required
                                    value={formData.chapterNumber}
                                    onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="col-md-6">
                                <Form.Label>Title (Optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Pages (One image URL per line)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                required
                                value={formData.pages}
                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                placeholder="https://example.com/page1.jpg&#10;https://example.com/page2.jpg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="switch"
                                id="chapter-visible-switch"
                                label="Is Visible"
                                checked={formData.isVisible}
                                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
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
