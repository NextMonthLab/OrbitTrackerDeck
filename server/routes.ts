import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // serve deck.json from public directory
  app.get("/deck.json", async (req, res) => {
    try {
      const deckPath = path.resolve(import.meta.dirname, "..", "public", "deck.json");
      const deckData = await fs.promises.readFile(deckPath, "utf-8");
      res.setHeader("Content-Type", "application/json");
      res.send(deckData);
    } catch (error) {
      res.status(404).json({ message: "Deck not found" });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
