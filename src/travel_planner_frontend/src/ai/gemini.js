import { GoogleGenerativeAI } from "@google/generative-ai";

export const Ai = async (user) => {
  const prompt = `You are a travel expert. Answer the following question with detailed and helpful advice, providing recommendations, tips, and insights tailored to the context and preferences described. Be informative, engaging, and practical.${user}`;

  try {
    const ai = new GoogleGenerativeAI(
     process.env.VITE_API_KEY
      );
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response.text();

    if (!response) {
      throw new Error("No response from model");
    }
    const text = response.text();
    console.log(response,"tytyt")
    return text;
  } catch (error) {
    return "Sorry, I couldn't generate a response.";
  }
};
