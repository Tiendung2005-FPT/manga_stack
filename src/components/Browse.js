import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "../css/Browse.css";

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mangaList, setMangaList] = useState([]);
    const [filteredManga, setFilteredManga] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [mangaResponse, genresResponse] = await Promise.all([
                axios.get('http://localhost:9999/manga'),
                axios.get('http://localhost:9999/genres')
            ]);
            setMangaList(mangaResponse.data);
            setGenres(genresResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const applyFilters = useCallback(() => {
        let filtered = [...mangaList];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(manga =>
                manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manga.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Genre filter
        if (selectedGenre) {
            filtered = filtered.filter(manga =>
                manga.genres.includes(selectedGenre)
            );
        }

        // Year filter
        if (selectedYear) {
            filtered = filtered.filter(manga =>
                manga.year.toString() === selectedYear
            );
        }

        // Status filter
        if (selectedStatus) {
            filtered = filtered.filter(manga =>
                manga.status === selectedStatus
            );
        }

        setFilteredManga(filtered);
    }, [mangaList, searchTerm, selectedGenre, selectedYear, selectedStatus]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const getGenreName = (genreId) => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Unknown';
    };

    const getGenreNames = (genreIds) => {
        return genreIds.map(id => getGenreName(id)).join(', ');
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    const getYears = () => {
        const years = [...new Set(mangaList.map(m => m.year))].sort((a, b) => b - a);
        return years;
    };

    if (loading) {
        return <div className="loading">Loading manga...</div>;
    }

    return (
        <div className="browse-container">
            <div className="browse-header">
                <h1 className="browse-title">Browse Manga</h1>
                <div className="search-section">
                    <div className="search-bar">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            placeholder="Search manga by title or description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                </div>
            </div>

            <div className="browse-content">
                <div className="filters-sidebar">
                    <h3 className="filter-title">Filters</h3>

                    <div className="filter-section">
                        <h4>Genre</h4>
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Genres</option>
                            {genres.map(genre => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Year</h4>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Years</option>
                            {getYears().map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-section">
                        <h4>Status</h4>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Status</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <button
                        className="clear-filters-btn"
                        onClick={() => {
                            setSelectedGenre('');
                            setSelectedYear('');
                            setSelectedStatus('');
                            setSearchTerm('');
                            setSearchParams({});
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="manga-grid">
                    {filteredManga.length === 0 ? (
                        <div className="no-results">
                            <h3>No manga found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredManga.map(manga => (
                            <Link to={`/manga/${manga.id}`} key={manga.id} className="manga-card">
                                <div className="manga-cover">
                                    <img
                                        src={manga.coverUrl || `https://picsum.photos/seed/${manga.id}/200/280.jpg`}
                                        alt={manga.title}
                                        className="manga-image"
                                    />
                                </div>
                                <div className="manga-info">
                                    <h3 className="manga-title">{manga.title}</h3>
                                    <p className="manga-description">
                                        {manga.description ?
                                            manga.description.substring(0, 100) + '...' :
                                            'No description available'
                                        }
                                    </p>
                                    <div className="manga-meta">
                                        <span className="manga-year">{manga.year}</span>
                                        <span className={`manga-status ${manga.status}`}>
                                            {manga.status}
                                        </span>
                                    </div>
                                    <div className="manga-genres">
                                        {getGenreNames(manga.genres)}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
