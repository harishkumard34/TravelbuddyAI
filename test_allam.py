import os
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

@tool
def dummy_tool(query: str) -> str:
    """Searches weather"""
    return "Sunny"

try:
    llm = ChatGroq(model="allam-2-7b", api_key=os.getenv("GROQ_API_KEY")).bind_tools([dummy_tool])
    resp = llm.invoke("What's the weather?")
    print("ALLAM TOOL CALLS:", resp.tool_calls)
except Exception as e:
    print(f"ALLAM Tool Error: {e}")
