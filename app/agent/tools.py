import requests
from langchain_core.tools import tool

# NOTE: DuckDuckGo search tool removed because Render server IP is permanently
# blocked by DuckDuckGo causing TimeoutException on every request.
# The LLM has sufficient travel knowledge built-in to plan detailed itineraries.

# TOOL: Custom Weather Fetcher (Open-Meteo - free, no IP restrictions)
# AI indha tool-kku oru ooroda pera (e.g., "Madurai") input aaga tharum.
# Indha @tool tag irukkardhala Langchain idhai oru AI tool aaga maathidum.
@tool
def get_current_weather(location: str) -> str:
    """Endha oora irundhalum, anga ippo weather eppadi irukku nu thedi kandupudikka indha tool-a use pannunga. Input should be the city name."""
    try:
        # Step 1: Geocoding (Oor pera vachu Latitude, Longitude kandupudikkum)
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1&language=en&format=json"
        geo_response = requests.get(geo_url, timeout=10).json()
        
        if not geo_response.get("results"):
            return f"Could not find coordinates for {location}"
            
        lat = geo_response["results"][0]["latitude"]
        lon = geo_response["results"][0]["longitude"]
        
        # Step 2: Weather API (Andha Lat, Lon-a vachu Ippo Temperature enna nu edukkurom)
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
        weather_response = requests.get(weather_url, timeout=10).json()
        
        if "current_weather" in weather_response:
            temp = weather_response["current_weather"]["temperature"]
            wind = weather_response["current_weather"]["windspeed"]
            return f"Current Weather in {location}: Temperature is {temp}°C with wind speed of {wind} km/h."
            
        return f"Could not fetch weather for {location}"
    except Exception as e:
        return f"Weather service unavailable: {str(e)}"

# TOOL LIST: Only weather tool now (DuckDuckGo removed due to Render IP block)
my_tools = [get_current_weather]