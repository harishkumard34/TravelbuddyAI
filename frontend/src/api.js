const API_BASE_URL = import.meta.env.PROD 
  ? 'https://travelbuddyai-qttc.onrender.com/api/v1' 
  : 'http://127.0.0.1:8000/api/v1';

export const generateTripPlan = async (destination, days, budget) => {
  const response = await fetch(`${API_BASE_URL}/plan-trip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      destination,
      days: parseInt(days),
      budget: parseInt(budget)
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch trip plan. Server might be down or busy.');
  }

  const result = await response.json();
  return result;
};
