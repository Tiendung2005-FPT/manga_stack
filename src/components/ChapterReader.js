import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "../css/ChapterReader.css"
import axios from "axios"
import { Col, Row } from "react-bootstrap"

export default function ChapterReader() {
    const { id, chapterId } = useParams()
    const navigate = useNavigate()
    const [chapter, setChapter] = useState(null)
    const [manga, setManga] = useState(null)
    const [pages, setPages] = useState([])
    const [mode, setMode] = useState('vertical')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageInput, setPageInput] = useState('1')
    const [headerVisible, setHeaderVisible] = useState(true)
    const [allChapters, setAllChapters] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chapterRes = await axios.get(`http://localhost:9999/chapters/${chapterId}`)
                const chapterData = chapterRes.data
                if(!chapterData.isVisible) {
                    setChapter(null);
                    return;
                }

                const mangaRes = await axios.get(`http://localhost:9999/manga/${id}`)
                const mangaData = mangaRes.data

                const chaptersRes = await axios.get(`http://localhost:9999/chapters?mangaId=${id}`)
                const chaptersData = chaptersRes.data
                    .filter(c => c.isVisible)
                    .sort((a, b) => a.chapterNumber - b.chapterNumber)

                setChapter(chapterData)
                setManga(mangaData)
                setPages(chapterData.pages || [])
                setAllChapters(chaptersData)
                setCurrentPage(1)
                setPageInput('1')
            } catch (error) {
                console.error('Error fetching chapter:', error)
            }
        }

        if (id && chapterId) {
            fetchData()
        }
    }, [id, chapterId])

    useEffect(() => {
        if (mode === 'vertical') {
            window.scrollTo(0, 0)
        }
    }, [chapterId])

    const handlePageClick = (direction) => {
        if (direction === 'next' && currentPage < pages.length) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            setPageInput(newPage.toString())
        } else if (direction === 'prev' && currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            setPageInput(newPage.toString())
        }
    }

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value)
    }

    const handlePageInputSubmit = (e) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(pageInput)
            if (pageNum >= 1 && pageNum <= pages.length) {
                setCurrentPage(pageNum)
            } else {
                setPageInput(currentPage.toString())
            }
        }
    }

    const toggleHeader = () => {
        setHeaderVisible(!headerVisible)
    }

    const getCurrentChapterIndex = () => {
        return allChapters.findIndex(ch => ch.id === chapterId)
    }

    const goToPreviousChapter = () => {
        const currentIndex = getCurrentChapterIndex()
        if (currentIndex > 0) {
            const prevChapter = allChapters[currentIndex - 1]
            navigate(`/manga/${id}/chapter/${prevChapter.id}`)
        }
    }

    const goToNextChapter = () => {
        const currentIndex = getCurrentChapterIndex()
        if (currentIndex < allChapters.length - 1) {
            const nextChapter = allChapters[currentIndex + 1]
            navigate(`/manga/${id}/chapter/${nextChapter.id}`)
        }
    }

    if (!chapter || !manga) {
        return (
            <div className="chapter-reader-container">
                <div className="text-center text-white py-5">
                    <h2>Chapter not found</h2>
                    <Link to={`/manga/${id}`} className="btn btn-primary">Back to Manga</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="chapter-reader-container">
            <div className={`reader-header ${headerVisible ? 'visible' : 'hidden'}`}>
                <div className="reader-info">
                    <Link to={`/manga/${id}`} className="back-link">
                        <i className="bi bi-arrow-left"></i> Back to {manga.title}
                    </Link>
                    <h2 className="chapter-title">
                        Chapter {chapter.chapterNumber}: {chapter.title || 'Untitled'}
                    </h2>
                </div>

                <Row className="reader-controls">
                    <Col md={mode === 'horizontal' ? 5 : 6}>
                        <div className="chapter-nav">
                            <button
                                className="chapter-nav-btn prev"
                                onClick={goToPreviousChapter}
                                disabled={getCurrentChapterIndex() === 0}
                            >
                                <i className="bi bi-chevron-left"></i> Prev
                            </button>
                            <span className="chapter-reader-header">
                                Chapter {getCurrentChapterIndex() + 1} of {allChapters.length}
                            </span>
                            <button
                                className="chapter-nav-btn next"
                                onClick={goToNextChapter}
                                disabled={getCurrentChapterIndex() === allChapters.length - 1}
                            >
                                Next <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </Col>

                    {mode === 'horizontal' && (
                        <Col md={2} className="page-navigation">
                            <span className="page-info">
                                <input
                                    type="text"
                                    value={pageInput}
                                    onChange={handlePageInputChange}
                                    onKeyDown={handlePageInputSubmit}
                                    className="page-input"
                                />
                                /{pages.length}
                            </span>
                        </Col>
                    )}

                    <Col md={mode === 'horizontal' ? 5 : 6} className="mode-toggle">
                        <button
                            className={`mode-btn ${mode === 'vertical' ? 'active' : ''}`}
                            onClick={() => setMode('vertical')}
                        >
                            Vertical
                        </button>
                        <button
                            className={`mode-btn ${mode === 'horizontal' ? 'active' : ''}`}
                            onClick={() => setMode('horizontal')}
                        >
                            Horizontal
                        </button>
                    </Col>
                </Row>
            </div>

            <button className="header-toggle-btn" onClick={toggleHeader}>
                <i className={`bi bi-chevron-${headerVisible ? 'up' : 'down'}`}></i>
            </button>

            <div className={`reader-content ${mode} ${headerVisible ? 'with-header' : 'without-header'}`}>
                {mode === 'vertical' ? (
                    <div className="vertical-reader">
                        {pages.map((pageUrl, index) => (
                            <div key={index} className="vertical-page">
                                <img src={pageUrl} alt={`Page ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="horizontal-reader">
                        <div className="page-container">
                            <div className="page-nav-area left" onClick={() => handlePageClick('prev')} />
                            <div className="page-content">
                                {pages[currentPage - 1] && (
                                    <img src={pages[currentPage - 1]} alt={`Page ${currentPage}`} />
                                )}
                            </div>
                            <div className="page-nav-area right" onClick={() => handlePageClick('next')} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
