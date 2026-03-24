import '../css/GenreChip.css'

export default function GenreChip({ name, state, onToggle }) {
    const label = state === "included" ? "+" : state === "excluded" ? "−" : "";
    return (
        <button
            className={`gc-chip gc-chip--${state}`}
            onClick={onToggle}
            title={state === "none" ? "Click to include" : state === "included" ? "Click to exclude" : "Click to clear"}
        >
            {state !== "none" && <span className="gc-chip__badge">{label}</span>}
            {name}
        </button>
    );
}