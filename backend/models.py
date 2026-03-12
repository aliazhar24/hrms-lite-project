from pydantic import BaseModel, EmailStr 

class Employee(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str