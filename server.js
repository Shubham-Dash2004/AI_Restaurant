import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/connect.js';
import { handleChat } from './api/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", handleChat);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



















































































// import express from 'express';
// import dotenv from 'dotenv';
// dotenv.config();

// import path from 'path';
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
// import { DynamicStructuredTool } from "@langchain/core/tools";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { z } from 'zod';


// const app = express();
// let PORT = 3000;

// // static file path 
// const __dirname = path.resolve();
// //middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// //model
// const model = new ChatGoogleGenerativeAI({
//     model: "models/gemini-2.5-flash", // Free-tier model - use pro
//     maxOutputTokens: 2048,
//     temperature: 0.7,
//     apiKey: process.env.GOOGLE_API_KEY,
// });

// //tool
// const getMenuTool = new DynamicStructuredTool({
//     name: "getMenu",
//     description: "Returns the final answer for today's menu for the given category (breakfast, lunch, or dinner). Use this tool to answer the user's menu question directly.",
//     schema: z.object({
//         category: z.string().describe("Type of food. Example: breakfast, lunch, dinner"),
//     }),
//     func: async ({ category }) => {
//         const menus = {
//             breakfast: "Aloo Paratha, Poha, Masala Chai",
//             lunch: "Paneer Butter Masala, Dal Fry, Jeera Rice, Roti",
//             dinner: "Veg Biryani, Raita, Salad, Gulab Jamun",
//         };
//         return menus[category.toLowerCase()] || "No menu found for that category.";
//     },
// });

// //prompt 
// const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You are a helpful assistant that uses tools when needed."],
//     ["human", "{input}"],
//     ["ai", "{agent_scratchpad}"]
// ]);

// //agent 
// const agent = new createToolCallingAgent({
//     llm: model,
//     tools: [getMenuTool],
//     prompt: prompt,
// })

// //executor 
// const executor = await AgentExecutor.fromAgentAndTools({
//     agent,
//     tools: [getMenuTool],
//     verbose: true,
//     maxIterations: 1,
//     returnIntermediateSteps: true,
// })

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
// })

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


// app.listen(PORT, () => {
//     console.log(`listening at the port ${PORT}`);
// })
