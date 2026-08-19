from langchain.agents import create_agent
from langchain_groq import ChatGroq
from app.core.config import GROQ_API_KEY
from app.agent.tools import my_tools
from app.schemas.models import TripRequest

# 1. LLM (AI Moolai) Setup:
# Inga thaan namma Groq API moolama Llama 3 model-a uyirpikkurom.
# temperature=0.5 na AI konjam creativity-oda yosikkum (Not too robotic, not too crazy).
llm = ChatGroq(
    temperature=0.5,
    model_name="qwen/qwen3.6-27b", # Stable model for tool calling since Llama models were decommissioned
    api_key=GROQ_API_KEY
)

# 2. System Prompt (AI-kkana strict rules):
# AI-kku adhu yaaru, adhu eppadi nadandhukkanum nu solra primary instruction idhu thaan.
# "MANDATORY" nu pottu, weather tool-a kandippa use panna vachu Itinerary uruvaakka solrom.
system_prompt = "You are an expert Travel Assistant. Always use tools to search for real travel info. MANDATORY: You must use the 'get_current_weather' tool to find the current weather of the destination and include a small 'Weather Tip' at the beginning of the itinerary. Return a clear day-by-day itinerary."

# 3. Create Agent Graph (AI + Tools = Agent):
# Verum LLM-a oru Agent aaga maathuradhu indha function thaan.
# LLM-kku namma 'tools'-a kuduthu, 'system_prompt'-um kuduthu oru pakkavaana Agent-a uruvaakurom.
graph = create_agent(
    model=llm,
    tools=my_tools,
    system_prompt=system_prompt
)

# 4. Action Function (Idhai thaan routes.py kooppidum):
def generate_trip_plan(request: TripRequest):
    # User anuppuna data-va vachu oru thelivaana kelviya (Prompt) AI-kku ready pandrom.
    user_query = f"Plan a {request.days}-day trip to {request.destination} with a strict total budget of Rs.{request.budget}. Give a clear day-by-day plan with cost estimates."
    
    print(f"AI Agent Start Aagudhu! Searching for: {request.destination}")
    
    # Langchain Agent expect pandra format-la Message-a pack pandrom.
    inputs = {"messages": [{"role": "user", "content": user_query}]}
    
    # 5. AGENT EXECUTION:
    # graph.invoke() thaan AI-a trigger pannum. 
    # AI ippo yosikkum -> Tool thevaiya nu thedum -> Data-va vaangum -> Final text ezhudhum.
    result = graph.invoke(inputs)
    
    # AI ezhudhuna andha kadeisi (final) message-a mattum filter panni edukkukrom.
    final_message = result["messages"][-1].content
    
    # Andha clean Itinerary text-a thiruppi anuppurom.
    return final_message