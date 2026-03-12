import { useEffect, useState } from "react"
import { getTodaySummary, getEmployeeCount } from "../api/api"

const CARDS = [
    { key: "total", label: "Total Employees", color: "text-slate-800", dot: "bg-violet-500" },
    { key: "Present", label: "Present Today", color: "text-emerald-600", dot: "bg-emerald-500" },
    { key: "Absent", label: "Absent Today", color: "text-red-500", dot: "bg-red-400" },
    { key: "Half Day", label: "Half Day Today", color: "text-amber-600", dot: "bg-amber-400" },
    { key: "Late", label: "Late Today", color: "text-blue-500", dot: "bg-blue-400" },
]

export default function DashboardCards() {
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const [summaryRes, countRes] = await Promise.all([
                    getTodaySummary(),
                    getEmployeeCount()
                ])
                setStats({ ...summaryRes.data, total: countRes.data.count })
            } catch {
                // fail silently
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div
            style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-8"
        >
            {CARDS.map(({ key, label, color, dot }) => (
                <div key={key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
                        <p className="text-xs text-slate-400">{label}</p>
                    </div>
                    {loading ? (
                        <div className="h-7 w-10 bg-slate-100 rounded-lg animate-pulse"></div>
                    ) : (
                        <p className={`text-2xl font-semibold ${color}`}>{stats[key] ?? 0}</p>
                    )}
                </div>
            ))}
        </div>
    )
}