import os
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware 
from routers import employees, attendance

app = FastAPI()

@app.get("/")
async def health():
    return {"status": "running"}

frontend_url = os.getenv("FRONTEND_URL")

origins = [
    
    frontend_url           
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

    
)

app.include_router(employees.router)
app.include_router(attendance.router)