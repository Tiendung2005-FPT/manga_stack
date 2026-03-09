import "../css/Container.css"

export default function Container({ children }) {
    return (
        <div className="body-container">
            {children}
        </div>
    )
}