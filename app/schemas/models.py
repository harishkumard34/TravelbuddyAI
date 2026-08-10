from pydantic import BaseModel, Field

# 1. INPUT VALIDATION (Security Guard for incoming data):
# User Frontend-la irundhu anuppura JSON-a theliva check panna indha TripRequest model use aagudhu.
# Pydantic library idhai automatic aaga validate pannum.
class TripRequest(BaseModel):
    # 'destination' string aaga irukkanum. Field description namma puridhalukkaaga.
    destination: str = Field(..., description="Endha ooru poga poranga? (e.g., Goa)")
    
    # 'days' number aaga irukkanum. gt=0 na "greater than 0" nu artham. (-ve days anuppa koodadhu)
    days: int = Field(..., gt=0, description="Ethana naalu trip? (e.g., 3)")
    
    # 'budget' number aaga irukkanum.
    budget: int = Field(..., gt=0, description="Trip-oda budget evlo? (e.g., 5000)")

# 2. OUTPUT FORMATTING (Rules for outgoing data):
# Namma API thiruppi Frontend-kku anuppura response eppadi irukkanum nu idhu theermanikkum.
# Idhu JSON-a maarumbodhu {"status": "success", "data": {"itinerary": "..."}} nu pakkaavaga maaridum.
class TripResponse(BaseModel):
    status: str
    data: dict
