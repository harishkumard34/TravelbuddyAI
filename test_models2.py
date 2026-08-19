import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
models_to_test = ["llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768", "gemma2-9b-it", "llama-3.1-8b-instant"]

for m in models_to_test:
    try:
        llm = ChatGroq(model=m, api_key=os.getenv("GROQ_API_KEY"))
        response = llm.invoke("hi")
        print(f"SUCCESS: {m}")
    except Exception as e:
        print(f"FAILED: {m} -> {e}")
