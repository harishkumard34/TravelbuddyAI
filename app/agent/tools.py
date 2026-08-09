import requests
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

# 1. Namma pazhaya aayudham (DuckDuckGo)
search_tool = DuckDuckGoSearchRun(
    name="web_search",
    description="Internet-la travel information, places, and budget details thedi edukka use pannunga."
)

# 2. Neenga keta puthu aayudham (Custom Weather Tool)
@tool
def get_current_weather(location: str) -> str:
    """Endha oora irundhalum, anga ippo weather eppadi irukku nu thedi kandupudikka indha tool-a use pannunga. Input should be the city name."""
    try:
        # Step 1: Ooroda Latitude, Longitude edukka Geocoding API use pandrom (Free, No Key)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json"
        geo_response = requests.get(geo_url).json()
        
        if not geo_response.get("results"):
            return f"Could not find coordinates for {location}"
            
        lat = geo_response["results"][0]["latitude"]
        lon = geo_response["results"][0]["longitude"]
        
        # Step 2: Kedaicha Lat, Lon vachu asaal Weather edukkurom (Free, No Key)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        weather_response = requests.get(weather_url).json()
        
        if "current_weather" in weather_response:
            temp = weather_response["current_weather"]["temperature"]
            wind = weather_response["current_weather"]["windspeed"]
            return f"Current Weather in {location}: Temperature is {temp}°C with wind speed of {wind} km/h."
            
        return f"Could not fetch weather for {location}"
    except Exception as e:
        return f"Weather service unavailable: {str(e)}"

# Rendu aayudhangalaiyum list-la potachu
my_tools = [search_tool, get_current_weather]