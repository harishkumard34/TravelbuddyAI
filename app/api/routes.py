from fastapi import APIRouter, HTTPException
from app.schemas.models import TripRequest, TripResponse
from app.agent.travel_agent import generate_trip_plan

# FastAPI Router-a start pandrom
router = APIRouter()

@router.post("/plan-trip", response_model=TripResponse)
async def plan_trip(request: TripRequest):
    try:
        # LLM kitta irundhu answer edukkura function-a call pandrom
        ai_response = generate_trip_plan(request)
        
        # Answer-a json format-la anuppurom
        return TripResponse(
            status="success",
            data={"itinerary": ai_response}
        )
    except Exception as e:
        # Edhavadhu thappu nadandhaa error anuppurom
        raise HTTPException(status_code=500, detail=str(e))