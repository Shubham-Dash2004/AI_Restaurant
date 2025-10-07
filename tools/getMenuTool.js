import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from 'zod';
import Menu from '../models/Menu.js'; // Import the Menu model

export const getMenuTool = new DynamicStructuredTool({
    name: "getMenu",
    description: "Returns the menu for a specific meal category (e.g., breakfast, lunch, dinner).",
    schema: z.object({
        category: z.string().describe("The meal category requested by the user. Example: breakfast, lunch, dinner, dessert, beverages"),
    }),
    func: async ({ category }) => {
        try {
            const menuItems = await Menu.find({ category: category.toLowerCase() });
            if (menuItems.length === 0) {
                return `No menu found for the ${category} category.`;
            }
            const menuString = menuItems.map(item => `${item.item} (${item.price} INR) - ${item.description}`).join(' | ');
            return `Here is the ${category} menu: ${menuString}`;
        } catch (error) {
            console.error('Error fetching menu from DB:', error);
            return "There was a problem fetching the menu. Please try again later.";
        }
    },
});

export const placeOrderTool = new DynamicStructuredTool({
    name: "placeOrder",
    description: "Places an order for the user. Use this tool only when the user explicitly asks to order a specific item from the menu. It confirms the order and its total cost.",
    schema: z.object({
        item: z.string().describe("The food or drink item the user wants to order."),
        quantity: z.number().optional().describe("The number of units of the item to order, defaults to 1 if not specified."),
    }),
    func: async ({ item, quantity = 1 }) => {
        try {
            const menuItem = await Menu.findOne({ item: { $regex: new RegExp(item, 'i') } });
            if (!menuItem) {
                return `Sorry, we don't have "${item}" on our menu. Please check the menu for available items.`;
            }
            const totalCost = menuItem.price * quantity;
            return `Your order for ${quantity} x ${menuItem.item} has been placed successfully! Your total is ${totalCost} INR. Enjoy your meal!`;
        } catch (error) {
            console.error('Error placing order:', error);
            return "There was a problem processing your order. Please try again later.";
        }
    },
});