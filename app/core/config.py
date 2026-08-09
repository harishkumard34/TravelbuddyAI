import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the Groq API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY or GROQ_API_KEY == "gsk_inga_unga_nijamaana_key_podunga" or GROQ_API_KEY == "gsk_inga_unga_phone_la_kedaicha_key_podunga":
    raise ValueError("Dei! .env file-la nijamana GROQ_API_KEY podu da!")
