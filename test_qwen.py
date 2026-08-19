import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
models = ["qwen/qwen3.6-27b", "openai/gpt-oss-20b", "groq/compound-mini"]
for m in models:
    try:
        llm = ChatGroq(model=m, api_key=os.getenv("GROQ_API_KEY"))
        print(f"Testing {m}...")
        resp = llm.invoke("say hi")
        print(f"SUCCESS {m}: {resp.content}")
    except Exception as e:
        print(f"FAILED {m}: {e}")
