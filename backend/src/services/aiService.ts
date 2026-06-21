import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface TripInput {
  destination: string;
  numberOfDays: number;
  budgetType: 'Low' | 'Medium' | 'High';
  interests: string[];
}

export class AIService {
  /**
   * Generate a complete travel itinerary using AI
   */
  static async generateItinerary(tripInput: TripInput): Promise<any> {
    const { destination, numberOfDays, budgetType, interests } = tripInput;

    const prompt = `Create a detailed ${numberOfDays}-day travel itinerary for ${destination}.

Budget Level: ${budgetType}
Interests: ${interests.join(', ')}

Please provide a day-by-day itinerary in the following JSON format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Brief title for the day",
      "activities": [
        {
          "name": "Activity name",
          "description": "Detailed description",
          "time": "Suggested time (e.g., 9:00 AM)",
          "cost": estimated cost in USD
        }
      ]
    }
  ]
}

Make it realistic, engaging, and tailored to the ${budgetType.toLowerCase()} budget and specified interests.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planner. Provide responses in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      return JSON.parse(content);
    } catch (error: any) {
      console.error('AI Itinerary Generation Error:', error);
      throw new Error('Failed to generate itinerary: ' + error.message);
    }
  }

  /**
   * Estimate trip budget using AI
   */
  static async estimateBudget(tripInput: TripInput): Promise<any> {
    const { destination, numberOfDays, budgetType } = tripInput;

    const prompt = `Estimate the travel budget for a ${numberOfDays}-day trip to ${destination} with a ${budgetType} budget.

Provide a breakdown in the following JSON format:
{
  "budget": {
    "flights": amount in USD,
    "accommodation": amount in USD,
    "food": amount in USD,
    "activities": amount in USD,
    "miscellaneous": amount in USD,
    "total": total amount in USD
  }
}

Be realistic and consider typical costs for the destination and budget level.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a travel budget expert. Provide responses in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      return JSON.parse(content);
    } catch (error: any) {
      console.error('AI Budget Estimation Error:', error);
      throw new Error('Failed to estimate budget: ' + error.message);
    }
  }

  /**
   * Suggest hotels based on destination and budget
   */
  static async suggestHotels(tripInput: TripInput): Promise<any> {
    const { destination, budgetType } = tripInput;

    const prompt = `Suggest 3-5 hotels in ${destination} for a ${budgetType} budget traveler.

Provide suggestions in the following JSON format:
{
  "hotels": [
    {
      "name": "Hotel name",
      "category": "Budget Friendly/Mid Range/Luxury",
      "priceRange": "Price range per night",
      "rating": rating out of 5,
      "description": "Brief description"
    }
  ]
}

Include a mix that aligns with the ${budgetType.toLowerCase()} budget preference.`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a hotel recommendation expert. Provide responses in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      return JSON.parse(content);
    } catch (error: any) {
      console.error('AI Hotel Suggestion Error:', error);
      throw new Error('Failed to suggest hotels: ' + error.message);
    }
  }

  /**
   * Regenerate a specific day with custom requirements
   */
  static async regenerateDay(
    destination: string,
    dayNumber: number,
    requirements: string,
    budgetType: string
  ): Promise<any> {
    const prompt = `Regenerate Day ${dayNumber} of a travel itinerary for ${destination}.

Special Requirements: ${requirements}
Budget Level: ${budgetType}

Provide the day's itinerary in the following JSON format:
{
  "day": ${dayNumber},
  "title": "Brief title for the day",
  "activities": [
    {
      "name": "Activity name",
      "description": "Detailed description",
      "time": "Suggested time",
      "cost": estimated cost in USD
    }
  ]
}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel planner. Provide responses in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      return JSON.parse(content);
    } catch (error: any) {
      console.error('AI Day Regeneration Error:', error);
      throw new Error('Failed to regenerate day: ' + error.message);
    }
  }
}
