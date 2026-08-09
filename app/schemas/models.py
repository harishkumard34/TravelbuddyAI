from pydantic import BaseModel, Field

# User API vazhiya anuppura JSON-a check panna indha model
class TripRequest(BaseModel):
    destination: str = Field(..., description="Endha ooru poga poranga? (e.g., Goa)")
    days: int = Field(..., gt=0, description="Ethana naalu trip? (e.g., 3)")
    budget: int = Field(..., gt=0, description="Trip-oda budget evlo? (e.g., 5000)")

# Namma API thiruppi anuppura response model
class TripResponse(BaseModel):
    status: str
    data: dict
