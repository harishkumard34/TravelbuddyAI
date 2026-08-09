import asyncio
from app.schemas.models import TripRequest
from app.agent.travel_agent import generate_trip_plan

request = TripRequest(destination="Goa", days=3, budget=5000)
try:
    print("Testing generate_trip_plan...")
    result = generate_trip_plan(request)
    print("Success! Output:", result[:100])
except Exception as e:
    print("Error:", repr(e))
