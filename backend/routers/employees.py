from fastapi import APIRouter, HTTPException 
from models import Employee
from database import employee_collection

router = APIRouter()

@router.post("/employees")
async def create_employee(employee: Employee):

    existing = await employee_collection.find_one(
        {"employee_id": employee.employee_id}
    )

    if existing:
        raise HTTPException(status_code=400, detail="Employee already exists")

    await employee_collection.insert_one(employee.dict())

    return {"message": "Employee created"}


@router.get("/employees")
async def get_employees():

    employees = []
    cursor = employee_collection.find()

    async for employee in cursor:
        employee["_id"] = str(employee["_id"])
        employees.append(employee)

    return employees


@router.get("/employees/count")
async def get_employee_count():
    count = await employee_collection.count_documents({})
    return {"count": count}

@router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str):

    result = await employee_collection.delete_one(
        {"employee_id": employee_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted"}