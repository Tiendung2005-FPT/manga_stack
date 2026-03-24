import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import '../css/Browse.css'
import axios from "axios";
import MangaCard from "./MangaCard";
import GenreChip from "./GenreChip";

const api = axios.create({ baseURL: "http://localhost:9999" });

async function fetchGenres() {
    const res = await api.get("/genres");
    return res.data;
}

async function fetchAllManga() {
    const res = await api.get("/manga");
    return res.data;
}

function applyFilters(mangaList, { keyword, genreFilters, status, sortField, sortDirection }) {
    let result = [...mangaList];

    if (keyword.trim()) {
        const kw = keyword.toLowerCase();
        result = result.filter(m =>
            m.title.toLowerCase().includes(kw) ||
            (m.description || "").toLowerCase().includes(kw)
        );
    }

    if (status) {
        result = result.filter(m => m.status === status);
    }

    const included = Object.entries(genreFilters).filter(([, s]) => s === "included").map(([id]) => id);
    const excluded = Object.entries(genreFilters).filter(([, s]) => s === "excluded").map(([id]) => id);

    if (included.length > 0) {
        result = result.filter(m => included.every(id => m.genres.includes(id)));
    }
    if (excluded.length > 0) {
        result = result.filter(m => excluded.every(id => !m.genres.includes(id)));
    }

    if (sortField && sortDirection !== "none") {
        const dir = sortDirection === "asc" ? 1 : -1;
        result.sort((a, b) => {
            if (sortField === "title") {
                return dir * a.title.localeCompare(b.title);
            }
            if (sortField === "year") {
                return dir * (a.year - b.year);
            }
            if (sortField === "uploadedAt") {
                return dir * (new Date(a.uploadedAt) - new Date(b.uploadedAt));
            }
            return 0;
        });
    } else if (!sortField || sortDirection === "none") {
        result.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }

    return result;
}

const SORT_OPTIONS = [
    { label: "Upload Date", field: "uploadedAt" },
    { label: "Title", field: "title" },
    { label: "Year", field: "year" },
];

function SearchBar({ value, onChange }) {
    return (
        <div className="br-search">
            <svg className="br-search__icon" viewBox="0 0 20 20" fill="none">
                <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
                className="br-search__input"
                type="text"
                placeholder="Search titles…"
                value={value}
                onChange={e => onChange(e.target.value)}
                autoComplete="off"
            />
            {value && (
                <button className="br-search__clear" onClick={() => onChange("")} aria-label="Clear">
                    ×
                </button>
            )}
        </div>
    );
}

function FilterPill({ label, active, onClick }) {
    return (
        <button className={`br-pill ${active ? "br-pill--active" : ""}`} onClick={onClick}>
            {label}
        </button>
    );
}


function SortButton({ label, field, currentField, direction, onToggle }) {
    const active = currentField === field && direction !== "none";
    const arrow = active ? (direction === "asc" ? " ↑" : " ↓") : "";
    return (
        <button className={`br-sort-btn ${active ? "br-sort-btn--active" : ""}`} onClick={() => onToggle(field)}>
            {label}{arrow}
        </button>
    );
}

export default function Browse() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [allManga, setAllManga] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [genreFilters, setGenreFilters] = useState({});
    const [selectedStatus, setSelectedStatus] = useState("");

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("none");

    const [showFilters, setShowFilters] = useState(false);

    const doFetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [manga, genres] = await Promise.all([fetchAllManga(), fetchGenres()]);
            setAllManga(manga);
            setGenreList(genres);
        } catch (err) {
            setError("Failed to load manga. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { doFetch(); }, [doFetch]);

    const mangaList = useMemo(() => applyFilters(allManga, {
        keyword: searchTerm,
        genreFilters,
        status: selectedStatus,
        sortField,
        sortDirection,
    }), [allManga, searchTerm, genreFilters, selectedStatus, sortField, sortDirection]);

    useEffect(() => {
        if (searchTerm) setSearchParams({ search: searchTerm });
        else setSearchParams({});
    }, [searchTerm]);

    const toggleGenre = id => {
        setGenreFilters(prev => {
            const cur = prev[id] || "none";
            const next = cur === "none" ? "included" : cur === "included" ? "excluded" : "none";
            return { ...prev, [id]: next };
        });
    };

    const clearGenreFilters = () => setGenreFilters({});

    const toggleSort = field => {
        if (sortField !== field) {
            setSortField(field);
            setSortDirection(field === "rating" ? "desc" : "asc");
        } else {
            const next = field === "rating"
                ? sortDirection === "desc" ? "asc" : sortDirection === "asc" ? "none" : "desc"
                : sortDirection === "asc" ? "desc" : sortDirection === "desc" ? "none" : "asc";
            setSortDirection(next);
            if (next === "none") setSortField(null);
        }
    };

    const clearAll = () => {
        setSearchTerm("");
        setGenreFilters({});
        setSelectedStatus("");
        setSortField(null);
        setSortDirection("none");
        setSearchParams({});
    };

    const activeFilterCount = useMemo(() => {
        return Object.values(genreFilters).filter(s => s !== "none").length
            + (selectedStatus ? 1 : 0);
    }, [genreFilters, selectedStatus]);

    const activeSortLabel = useMemo(() => {
        if (!sortField || sortDirection === "none") return null;
        const opt = SORT_OPTIONS.find(o => o.field === sortField);
        return `${opt?.label} ${sortDirection === "asc" ? "↑" : "↓"}`;
    }, [sortField, sortDirection]);

    return (
        <div>
            <div className="br">
                <header className="br-header">
                    <div className="br-header__eyebrow">Catalogue</div>
                    <h1 className="br-header__title">Browse Manga</h1>
                    <p className="br-header__sub">
                        {loading
                            ? "Loading…"
                            : mangaList.length === allManga.length
                                ? `${allManga.length} titles`
                                : `${mangaList.length} of ${allManga.length} titles`
                        }
                    </p>
                </header>

                <div className="br-toolbar">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />

                    <div className="br-toolbar__actions">
                        <button
                            className={`br-filter-toggle ${showFilters ? "br-filter-toggle--open" : ""}`}
                            onClick={() => setShowFilters(v => !v)}
                        >
                            <svg viewBox="0 0 18 18" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <path d="M1 4h16M4 9h10M7 14h4" />
                            </svg>
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="br-filter-toggle__badge">{activeFilterCount}</span>
                            )}
                        </button>

                        <div className="br-sort-row">
                            {SORT_OPTIONS.map(o => (
                                <SortButton
                                    key={o.field}
                                    label={o.label}
                                    field={o.field}
                                    currentField={sortField}
                                    direction={sortDirection}
                                    onToggle={toggleSort}
                                />
                            ))}
                        </div>

                        {(activeFilterCount > 0 || activeSortLabel || searchTerm) && (
                            <button className="br-clear-btn" onClick={clearAll}>Clear all</button>
                        )}
                    </div>
                </div>

                {activeSortLabel && (
                    <div className="br-active-row">
                        <span className="br-active-label">Sorted by:</span>
                        <span className="br-active-tag">{activeSortLabel}</span>
                    </div>
                )}

                <div className={`br-filter-panel ${showFilters ? "br-filter-panel--open" : ""}`}>
                    <div className="br-filter-panel__inner">
                        <div className="br-filter-section">
                            <div className="br-filter-section__head">
                                <span>Status</span>
                            </div>
                            <div className="br-filter-section__body">
                                {["", "ongoing", "completed"].map(s => (
                                    <FilterPill
                                        key={s || "all"}
                                        label={s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
                                        active={selectedStatus === s}
                                        onClick={() => setSelectedStatus(s)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="br-filter-section">
                            <div className="br-filter-section__head">
                                <span>Genres</span>
                                {activeFilterCount > 0 && (
                                    <button className="br-genre-clear" onClick={clearGenreFilters}>Clear</button>
                                )}
                            </div>
                            <div className="br-filter-section__body br-filter-section__body--genres">
                                {genreList.map(g => (
                                    <GenreChip
                                        key={g.id}
                                        name={g.name}
                                        state={genreFilters[g.id] || "none"}
                                        onToggle={() => toggleGenre(g.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="br-message br-message--error">
                        <span>{error}</span>
                        <button onClick={doFetch}>Retry</button>
                    </div>
                ) : loading ? (
                    <div className="br-skeleton-grid">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="br-skeleton">
                                <div className="br-skeleton__cover" />
                                <div className="br-skeleton__line" />
                                <div className="br-skeleton__line br-skeleton__line--short" />
                            </div>
                        ))}
                    </div>
                ) : mangaList.length === 0 ? (
                    <div className="br-message">
                        <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="24" cy="24" r="20" />
                            <path d="M16 24h16M24 16v16" opacity=".3" />
                        </svg>
                        <p>No manga found</p>
                        <span>Try adjusting your search or filters</span>
                    </div>
                ) : (
                    <div className="br-grid">
                        {mangaList.map(manga => (
                            <MangaCard key={manga.id} manga={manga} genres={genreList} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}