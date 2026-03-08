export default function NavItem({ title, pageActive, active }) {
    return (
        <div className={`nav-item ${pageActive === active ? 'active' : ''}`}>
            {title}
        </div>
    )
}