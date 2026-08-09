from langchain.agents import create_agent
from langchain_groq import ChatGroq
from app.core.config import GROQ_API_KEY
from app.agent.tools import my_tools
from app.schemas.models import TripRequest

# 1. LLM (Moolai) Setup
llm = ChatGroq(
    temperature=0.5,
    model_name="llama-3.1-8b-instant",
    api_key=GROQ_API_KEY
)

# 2. System Prompt
system_prompt = "You are an expert Travel Assistant. Always use tools to search for real travel info. MANDATORY: You must use the 'get_current_weather' tool to find the current weather of the destination and include a small 'Weather Tip' at the beginning of the itinerary. Return a clear day-by-day itinerary."

# 3. Create Agent Graph
graph = create_agent(
    model=llm,
    tools=my_tools,
    system_prompt=system_prompt
)

# Indha function thaan namma API call pannum
def generate_trip_plan(request: TripRequest):
    user_query = f"Plan a {request.days}-day trip to {request.destination} with a strict total budget of Rs.{request.budget}. Give a clear day-by-day plan with cost estimates."
    
    print(f"AI Agent Start Aagudhu! Searching for: {request.destination}")
    
    inputs = {"messages": [{"role": "user", "content": user_query}]}
    
    # Agent-a run pandrom
    result = graph.invoke(inputs)
    final_message = result["messages"][-1].content
    
    return final_message