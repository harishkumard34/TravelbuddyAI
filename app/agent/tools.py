import requests
from langchain_core.tools import tool
from langchain_community.tools import DuckDuckGoSearchRun

# 1. TOOL: DuckDuckGo (Internet Search Engine)
# Namma AI-kku current aana details thedanum na (e.g., ticket price, hotels), indha tool-a thaan AI use pannum.
search_tool = DuckDuckGoSearchRun(
    name="web_search",
    description="Internet-la travel information, places, and budget details thedi edukka use pannunga."
)

# 2. TOOL: Custom Weather Fetcher (Open-Meteo)
# AI indha tool-kku oru ooroda pera (e.g., "Madurai") input aaga tharum.
# Indha @tool tag irukkardhala Langchain idhai oru AI tool aaga maathidum.
@tool
def get_current_weather(location: str) -> str:
    """Endha oora irundhalum, anga ippo weather eppadi irukku nu thedi kandupudikka indha tool-a use pannunga. Input should be the city name."""
    try:
        # Step 2a: Geocoding (Oor pera vachu Latitude, Longitude kandupudikkum)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json"
        geo_response = requests.get(geo_url).json()
        
        if not geo_response.get("results"):
            return f"Could not find coordinates for {location}"
            
        lat = geo_response["results"][0]["latitude"]
        lon = geo_response["results"][0]["longitude"]
        
        # Step 2b: Weather API (Andha Lat, Lon-a vachu Ippo Temperature enna nu edukkurom)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        weather_response = requests.get(weather_url).json()
        
        if "current_weather" in weather_response:
            temp = weather_response["current_weather"]["temperature"]
            wind = weather_response["current_weather"]["windspeed"]
            # Kedaicha weather data-va oru text-aaga AI-kku thiruppi tharrom.
            return f"Current Weather in {location}: Temperature is {temp}°C with wind speed of {wind} km/h."
            
        return f"Could not fetch weather for {location}"
    except Exception as e:
        return f"Weather service unavailable: {str(e)}"

# 3. TOOL LIST:
# Namma uruvaakkuna rendu aayudhangalaiyum (Search + Weather) oru list-la potu travel_agent.py-kku export pandrom.
my_tools = [search_tool, get_current_weather]