import requests

try:
    response = requests.post(
        "http://127.0.0.1:8000/api/v1/plan-trip", 
        json={"destination": "chennai", "days": 3, "budget": 5000}
    )
    print(response.status_code)
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
