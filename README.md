# TravelBuddy AI

An intelligent travel planning application that generates optimized itineraries within your budget using AI and real-time web search.

## Architecture & Data Flow

Below is the complete data flow of the application mapped directly to the source code files:

```mermaid
graph LR
    %% Styling
    classDef default fill:#e0d4fc,stroke:#6b01c2,stroke-width:2px,color:#171717,font-weight:bold,border-radius:8px;
    classDef db fill:#c2f0db,stroke:#3ecf8e,stroke-width:2px,color:#171717,font-weight:bold;
    
    A[👤 User Input] --> B[🖥️ Frontend UI<br/>(App.jsx)]
    B --> C[🌐 API Request<br/>(api.js)]
    C --> D[⚙️ FastAPI Backend<br/>(main.py)]
    D --> E[🛣️ API Route<br/>(routes.py)]
    E --> F[🧠 Langchain Agent<br/>(travel_agent.py)]
    
    F <-->|Searches Web| G[🔍 Search Tool<br/>(search_tools.py)]
    
    F -->|Returns Plan| H[📝 JSON Output<br/>(routes.py)]
    H --> I[✨ UI Display<br/>(App.jsx)]
```

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI Agent**: Langchain, Groq (Llama 3)
- **Tools**: DuckDuckGo Web Search

## Deployment
- **Frontend**: Hosted on Netlify
- **Backend**: Hosted on Render
