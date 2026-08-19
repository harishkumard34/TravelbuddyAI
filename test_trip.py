from app.schemas.models import TripRequest
from app.agent.travel_agent import generate_trip_plan
import sys

sys.stdout.reconfigure(encoding='utf-8')

try:
    req = TripRequest(destination="chennai", days=3, budget=5000)
    res = generate_trip_plan(req)
    print("SUCCESS")
    print(res)
except Exception as e:
    print(f"FAILED: {e}")
