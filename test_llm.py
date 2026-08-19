import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
try:
    llm = ChatGroq(model="qwen/qwen3.6-27b", api_key=os.getenv("GROQ_API_KEY"))
    response = llm.invoke("Say hi!")
    print("Qwen Response:", response.content)
except Exception as e:
    print("Qwen Error:", str(e))
    
try:
    llm2 = ChatGroq(model="openai/gpt-oss-20b", api_key=os.getenv("GROQ_API_KEY"))
    response = llm2.invoke("Say hi!")
    print("GPT-OSS Response:", response.content)
except Exception as e:
    print("GPT-OSS Error:", str(e))
