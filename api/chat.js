import {config} from "dotenv";
config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getMenuTool, placeOrderTool } from '../tools/getMenuTool.js';

// Initialize the LLM
const model = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash", // Changed to a more powerful model for better performance
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
});

// Define the prompt with a clear system message
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful restaurant assistant. You can provide the menu for breakfast, lunch, dinner, dessert, and beverages, and also help users place an order. Use the provided tools to answer questions. If you cannot find the right tool for the user query, provide a helpful and friendly response."],
    ["human", "{input}"],
    ["ai", "{agent_scratchpad}"]
]);

// Create the agent with multiple tools
const agent = createToolCallingAgent({
    llm: model,
    tools: [getMenuTool, placeOrderTool],
    prompt: prompt,
});

// Create the agent executor
const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools: [getMenuTool, placeOrderTool],
    verbose: true,
    maxIterations: 1, // Increased max iterations for more complex queries
    returnIntermediateSteps:true,
});

export const handleChat = async (req, res) => {
   const userInput = req.body.input;
    console.log('userInput : ', userInput);
    try {
        const response = await executor.invoke({ input: userInput });
        console.log('Response : ', response);
        const data = response.intermediateSteps[0].observation;

        if (response.output && response.output != 'Agent stopped due to max iterations.') {
            return res.json({ output: response.output });
        }else if(data != null){
            return res.json({output:data});
        }
        res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
   
   
    } catch (err) {
        console.error(err);
        res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
    }
};

// app.post("/api/chat", async (req, res) => {
//     const userInput = req.body.input;
//     console.log('userInput : ', userInput);
//     try {
//         const response = await executor.invoke({ input: userInput });
//         console.log('Response : ', response);
//         const data = response.intermediateSteps[0].observation;

//         if (response.output && response.output != 'Agent stopped due to max iterations.') {
//             return res.json({ output: response.output });
//         }else if(data != null){
//             return res.json({output:data});
//         }
//         res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
   
   
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
//     }
// });

//   const userInput = req.body.input;
//     try {
//         const response = await executor.invoke({ input: userInput });
//         if (response.output) {
//             return res.json({ output: response.output });
//         }
//         res.status(500).json({ output: "Sorry, I couldn't process that request." });
//     } catch (err) {
//         console.error('Error during chat invocation:', err);
//         res.status(500).json({ output: "Sorry, something went wrong. Please try again." });
//     }