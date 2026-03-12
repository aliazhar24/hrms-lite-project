import { useState } from "react"
import { markAttendance, getAttendance, getEmployees } from "../api/api"


const STATUS_CONFIG = {
    Present: { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700", toggle: "bg-emerald-50 border-emerald-300 text-emerald-700" },
    Absent: { dot: "bg-red-400", badge: "bg-red-100 text-red-600", toggle: "bg-red-50 border-red-300 text-red-600" },
    "Half Day": { dot: "bg-amber-400", badge: "bg-amber-100 text-amber-700", toggle: "bg-amber-50 border-amber-300 text-amber-700" },
    Late: { dot: "bg-blue-400", badge: "bg-blue-100 text-blue-600", toggle: "bg-blue-50 border-blue-300 text-blue-600" },
}

export default function Attendance() {
    const [employeeId, setEmployeeId] = useState("")
    const [date, setDate] = useState("")
    const [status, setStatus] = useState("Present")
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState(null)
    const [filterStatus, setFilterStatus] = useState("All")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [employeeName, setEmployeeName] = useState("")

    const showToast = (msg, type = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const resolveEmployeeName = async (id) => {
        try {
            const res = await getEmployees()
            const emp = res.data.find(e => String(e._id) === String(id) || String(e.employee_id) === String(id))
            setEmployeeName(emp ? emp.name : "")
        } catch {
            setEmployeeName("")
        }
    }

    const handleIdChange = (val) => {
        setEmployeeId(val)
        setEmployeeName("")
        if (val.trim()) resolveEmployeeName(val.trim())
    }

    const submit = async () => {
        if (!employeeId || !date) {
            showToast("Please fill Employee ID and Date", "error")
            return
        }
        try {
            setSubmitting(true)
            await markAttendance({ employee_id: employeeId, date, status })
            showToast("Attendance marked successfully")
            loadRecords()
        } catch (err) {

            console.log(err)

            const backendMessage = err?.response?.data?.detail

            if (backendMessage) {
                showToast(backendMessage, "error")
            } else {
                showToast("Server error. Please try again.", "error")
            }

        } finally {
            setSubmitting(false)
        }
    }

    const loadRecords = async () => {
        if (!employeeId) {
            showToast("Enter an Employee ID first", "error")
            return
        }
        try {
            setLoading(true)
            const res = await getAttendance(employeeId.trim())
            setRecords(res.data)
        } catch (err) {
            showToast(err.response?.data?.detail || "Failed to load records", "error")
        } finally {
            setLoading(false)
        }
    }

    const exportCSV = () => {
        if (!filtered.length) return
        const header = "Date,Status"
        const rows = filtered.map(r => `${r.date},${r.status}`)
        const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `attendance_${employeeId}.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    const filtered = records.filter(r => {
        if (filterStatus !== "All" && r.status !== filterStatus) return false
        if (dateFrom && r.date < dateFrom) return false
        if (dateTo && r.date > dateTo) return false
        return true
    })

    const counts = Object.fromEntries(
        ["Present", "Absent", "Half Day", "Late"].map(s => [s, records.filter(r => r.status === s).length])
    )

    return (
        <div style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }} className="min-h-screen bg-slate-50">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                    {toast.msg}
                </div>
            )}

            <div className="max-w-2xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">HR System</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Attendance</h1>
                </div>

                {/* Mark Attendance Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Mark Attendance</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Employee ID</label>
                            <input
                                placeholder="e.g. EMP-001"
                                value={employeeId}
                                onChange={(e) => handleIdChange(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                            {employeeName && (
                                <p className="text-xs text-blue-500 mt-1 ml-0.5">→ {employeeName}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                        </div>
                    </div>

                    {/* Status Toggle — 4 options */}
                    <div className="mb-5">
                        <label className="block text-xs text-slate-500 mb-1 ml-0.5">Status</label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.keys(STATUS_CONFIG).map((s) => {
                                const cfg = STATUS_CONFIG[s]
                                const active = status === s
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`py-2.5 rounded-xl text-xs font-medium border transition ${active ? cfg.toggle : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                            }`}
                                    >
                                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-px ${active ? cfg.dot : "bg-slate-300"}`}></span>
                                        {s}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        onClick={submit}
                        disabled={submitting}
                        className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white py-2.5 rounded-xl text-sm font-medium transition"
                    >
                        {submitting ? "Marking..." : "Mark Attendance"}
                    </button>
                </div>

                {/* Records Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs uppercase tracking-widest text-slate-400">Records</p>
                        <div className="flex gap-3 items-center">
                            {records.length > 0 && (
                                <button onClick={exportCSV} className="text-xs text-slate-400 hover:text-slate-600 transition">
                                    ↓ Export CSV
                                </button>
                            )}
                            <button onClick={loadRecords} className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
                                {loading ? "Loading…" : "Refresh ↻"}
                            </button>
                        </div>
                    </div>

                    {/* Summary pills */}
                    {records.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(counts).map(([s, n]) => (
                                <span key={s} className={`text-xs px-3 py-1 rounded-full border ${STATUS_CONFIG[s].badge} border-transparent`}>
                                    {n} {s}
                                </span>
                            ))}
                            <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full">
                                {records.length} Total
                            </span>
                        </div>
                    )}

                    {/* Filters */}
                    {records.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            >
                                <option value="All">All Statuses</option>
                                {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                            </select>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                        </div>
                    )}

                    {/* List */}
                    {loading ? (
                        <div className="space-y-2.5">
                            {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-300 text-3xl mb-2">◎</p>
                            <p className="text-sm text-slate-400">{records.length ? "No records match filters" : "No records loaded yet"}</p>
                        </div>
                    ) : (
                        <ul className="space-y-1.5">
                            {filtered.map((r) => {
                                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.Present
                                return (
                                    <li key={r._id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                                        <span className="text-sm text-slate-600">{r.date}</span>
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cfg.badge}`}>
                                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-px ${cfg.dot}`}></span>
                                            {r.status}
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}