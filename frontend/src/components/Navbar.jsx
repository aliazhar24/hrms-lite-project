import { Link, useLocation } from "react-router-dom"

const NAV_LINKS = [
    { to: "/", label: "Dashboard" },
    { to: "/employees", label: "Employees" },
    { to: "/attendance", label: "Attendance" },
]

export default function Navbar() {
    const { pathname } = useLocation()

    return (
        <nav
            style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
            className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center"
        >
            {/* Brand */}
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                <span className="text-sm font-semibold text-slate-800 tracking-tight">HRMS Lite</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-1">
                {NAV_LINKS.map(({ to, label }) => {
                    const active = pathname === to
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={`px-4 py-1.5 rounded-lg text-xs transition ${active
                                    ? "bg-slate-100 text-slate-800 font-medium"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}