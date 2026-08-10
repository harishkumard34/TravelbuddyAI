from fastapi import APIRouter, HTTPException
from app.schemas.models import TripRequest, TripResponse
from app.agent.travel_agent import generate_trip_plan

# 1. ROUTER SETUP:
# API vazhigalai (routes) uruvaakka APIRouter-a start pandrom.
router = APIRouter()

# 2. ENDPOINT CREATION:
# Frontend-la irundhu vara POST request-a indha "/plan-trip" url thaan vaangum.
# response_model=TripResponse na, thiruppi anuppumbodhu JSON format "TripResponse" rules-kku etha maari thaan irukkanum nu strict aaga solludhu.
@router.post("/plan-trip", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    try:
        # 3. CALLING THE AI AGENT:
        # Frontend anuppuna data-va (request), namma AI Agent (travel_agent.py)-kitta kudukkurom.
        # AI theliva yosichu, tools-a use panni Itinerary text-a uruvaakki 'ai_response'-la tharum.
        ai_response = generate_trip_plan(request)
        
        # 4. PACKAGING THE RESPONSE:
        # AI kudutha raw Itinerary text-a, oru thelivaana JSON parcel-aaga (TripResponse format) katturadhu indha idam thaan.
        return TripResponse(
            status="success",
            data={"itinerary": ai_response}
        )
    except Exception as e:
        # 5. ERROR HANDLING:
        # Edhavadhu thappu nadandhaa (e.g., API server down, timeout), udane user-kku 500 error code-oda reason-a anuppurom.
        raise HTTPException(status_code=500, detail=str(e))