import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

export const getEmployees = () => API.get("/employees")

export const createEmployee = (data) =>
    API.post("/employees", data)

export const deleteEmployee = (id) =>
    API.delete(`/employees/${id}`)

export const markAttendance = (data) =>
    API.post("/attendance", data)

export const getAttendance = (id) =>
    API.get(`/attendance/${id}`)

export const getTodaySummary = () =>
    API.get("/attendance/today/summary")

export const getEmployeeCount = () =>
    API.get("/employees/count")