import os
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware 
from routers import employees, attendance

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL")

origins = [
    "http://localhost:5173",   # local development
    frontend_url               # production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)