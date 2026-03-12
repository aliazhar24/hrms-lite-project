import { useEffect, useState } from "react"
import {
    getEmployees,
    createEmployee,
    deleteEmployee
} from "../api/api"

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "HR", "Finance", "Operations", "Other"]

const inputClass = (hasError) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition ${hasError ? "border-red-300 bg-red-50" : "border-slate-200"
    }`

export default function Employees() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [toast, setToast] = useState(null)
    const [search, setSearch] = useState("")
    const [filterDept, setFilterDept] = useState("All")
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" })
    const [errors, setErrors] = useState({})

    const showToast = (msg, type = "success") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const loadEmployees = async () => {
        try {
            setLoading(true)
            const res = await getEmployees()
            setEmployees(res.data)
        } catch {
            showToast("Failed to load employees", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadEmployees() }, [])

    const validate = () => {
        const e = {}
        if (!form.employee_id.trim()) e.employee_id = "Required"
        else if (employees.some(emp => emp.employee_id === form.employee_id.trim()))
            e.employee_id = "ID already exists"
        if (!form.full_name.trim()) e.full_name = "Required"
        if (!form.email.trim()) e.email = "Required"
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email"
        else if (employees.some(emp => emp.email.toLowerCase() === form.email.trim().toLowerCase()))
            e.email = "Email already registered"
        if (!form.department.trim()) e.department = "Required"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!validate()) return
        try {
            setSubmitting(true)
            await createEmployee(form)
            setForm({ employee_id: "", full_name: "", email: "", department: "" })
            setErrors({})
            showToast("Employee added successfully")
            loadEmployees()
        } catch (err) {
            showToast(err.response?.data?.detail || "Failed to add employee", "error")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            setDeletingId(id)
            await deleteEmployee(id)
            showToast("Employee removed")
            loadEmployees()
        } catch {
            showToast("Failed to delete employee", "error")
        } finally {
            setDeletingId(null)
            setConfirmDelete(null)
        }
    }

    const filtered = employees.filter(emp => {
        const matchSearch =
            emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
            emp.email?.toLowerCase().includes(search.toLowerCase())
        const matchDept = filterDept === "All" || emp.department === filterDept
        return matchSearch && matchDept
    })

    const depts = ["All", ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))]

    return (
        <div style={{ fontFamily: "'DM Mono', 'Courier New', monospace" }} className="min-h-screen bg-slate-50">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${toast.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-80">
                        <p className="text-sm font-semibold text-slate-800 mb-1">Remove Employee?</p>
                        <p className="text-xs text-slate-400 mb-5">
                            This will permanently delete{" "}
                            <span className="text-slate-600 font-medium">{confirmDelete.full_name}</span> from the system.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 py-2 rounded-xl text-sm border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete.employee_id)}
                                disabled={deletingId === confirmDelete.employee_id}
                                className="flex-1 py-2 rounded-xl text-sm bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
                            >
                                {deletingId === confirmDelete.employee_id ? "Removing…" : "Remove"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                        <span className="text-xs text-slate-400 uppercase tracking-widest">HR System</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">Employees</h1>
                </div>

                {/* Add Employee Form */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5 shadow-sm">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-4">Add Employee</p>

                    <div className="grid grid-cols-2 gap-3 mb-3">

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Employee ID</label>
                            <input
                                placeholder="e.g. EMP-001"
                                value={form.employee_id}
                                onChange={e => setForm({ ...form, employee_id: e.target.value })}
                                className={inputClass(errors.employee_id)}
                            />
                            {errors.employee_id && <p className="text-xs text-red-400 mt-1 ml-0.5">{errors.employee_id}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Full Name</label>
                            <input
                                placeholder="Jane Smith"
                                value={form.full_name}
                                onChange={e => setForm({ ...form, full_name: e.target.value })}
                                className={inputClass(errors.full_name)}
                            />
                            {errors.full_name && <p className="text-xs text-red-400 mt-1 ml-0.5">{errors.full_name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Email</label>
                            <input
                                type="email"
                                placeholder="jane@company.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className={inputClass(errors.email)}
                            />
                            {errors.email && <p className="text-xs text-red-400 mt-1 ml-0.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 mb-1 ml-0.5">Department</label>
                            <select
                                value={form.department}
                                onChange={e => setForm({ ...form, department: e.target.value })}
                                className={inputClass(errors.department)}
                            >
                                <option value="">Select department</option>
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                            {errors.department && <p className="text-xs text-red-400 mt-1 ml-0.5">{errors.department}</p>}
                        </div>

                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={submitting}
                        className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white py-2.5 rounded-xl text-sm font-medium transition"
                    >
                        {submitting ? "Adding…" : "Add Employee"}
                    </button>
                </div>

                {/* Employee List */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Employee List
                            {!loading && <span className="ml-2 text-slate-300 normal-case">({filtered.length})</span>}
                        </p>
                        <button onClick={loadEmployees} className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
                            {loading ? "Loading…" : "Refresh ↻"}
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-2 mb-4">
                        <input
                            placeholder="Search name, ID or email…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                        />
                        <select
                            value={filterDept}
                            onChange={e => setFilterDept(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                        >
                            {depts.map(d => <option key={d}>{d}</option>)}
                        </select>
                    </div>

                    {/* Dept stats */}
                    {!loading && employees.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {Array.from(new Set(employees.map(e => e.department).filter(Boolean))).map(dept => (
                                <span key={dept} className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1 rounded-full">
                                    {dept}: {employees.filter(e => e.department === dept).length}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* List */}
                    {loading ? (
                        <div className="space-y-2.5">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-11 bg-slate-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-300 text-3xl mb-2">◎</p>
                            <p className="text-sm text-slate-400">
                                {employees.length ? "No employees match your search" : "No employees yet"}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-1.5">
                            {filtered.map(emp => (
                                <li key={emp.employee_id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                                            {emp.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-slate-700 font-medium truncate">{emp.full_name}</p>
                                            <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                        <span className="text-xs text-slate-400 hidden sm:block">{emp.employee_id}</span>
                                        <span className="text-xs bg-violet-50 text-violet-600 border border-violet-100 px-2.5 py-1 rounded-full hidden sm:block">
                                            {emp.department}
                                        </span>
                                        <button
                                            onClick={() => setConfirmDelete(emp)}
                                            className="text-xs text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}