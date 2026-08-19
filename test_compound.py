import os
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from dotenv import load_dotenv
import sys
sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

@tool
def dummy_tool(query: str) -> str:
    """Searches weather"""
    return "Sunny"

try:
    llm = ChatGroq(model="groq/compound-mini", api_key=os.getenv("GROQ_API_KEY")).bind_tools([dummy_tool])
    resp = llm.invoke("What's the weather in Chennai?")
    print("TOOL CALLS:", resp.tool_calls)
    print("CONTENT:", resp.content)
except Exception as e:
    print(f"Tool Error: {e}")
