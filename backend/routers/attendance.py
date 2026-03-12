from fastapi import APIRouter, HTTPException
from database import attendance_collection, employee_collection
from datetime import date

router = APIRouter()

@router.post("/attendance")
async def mark_attendance(data: dict):

    # check if employee exists
    employee = await employee_collection.find_one(
        {"employee_id": data["employee_id"]}
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee does not exist"
        )

    # check if attendance already exists for same date
    existing = await attendance_collection.find_one({
        "employee_id": data["employee_id"],
        "date": data["date"]
    })

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for this date"
        )

    await attendance_collection.insert_one(data)

    return {"message": "Attendance recorded"}

@router.get("/attendance/today/summary")
async def get_today_summary():
    today = str(date.today())
    pipeline = [
        {"$match": {"date": today}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    result = {}
    async for doc in attendance_collection.aggregate(pipeline):
        result[doc["_id"]] = doc["count"]
    return result

@router.get("/attendance/{employee_id}")
async def get_attendance(employee_id: str):

    records = []

    cursor = attendance_collection.find({"employee_id": employee_id})

    async for record in cursor:
        record["_id"] = str(record["_id"])
        records.append(record)

    return records

