import express, { Request, Response } from "express";
import { readData, writeData } from "../helper/fileHelpers";
import jwtAuth from "../middleware/basicAuth";
import adminAuth from "../middleware/roleAuth";

const router = express.Router();
const THEATERS_FILE = "./src/storage/theaters.json";

interface Theater {
  theater_id: number;
  name: string;
  location: string;
  capacity: number;
  shows: string[]; // Array of show IDs
}

// User route - Retrieve all theaters
router.get("/", jwtAuth, async (req: Request, res: Response): Promise<any> => {
  const theaters = readData<Theater[]>(THEATERS_FILE);
  if (!theaters) {
    return res.status(500).json({ message: "Error loading theaters" });
  }
  res.json(theaters);
});

// Admin-only route - Add a new theater
router.post(
  "/add",
  jwtAuth,
  adminAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { name, location, capacity, shows } = req.body;

    const theaters = readData<Theater[]>(THEATERS_FILE);

    // Find the highest theater ID
    const lastTheaterId =
      theaters.length > 0
        ? Math.max(...theaters.map((theater) => theater.theater_id))
        : 0;

    const newTheater: Theater = {
      theater_id: lastTheaterId + 1,
      name,
      location,
      capacity,
      shows: shows || [], // Default to empty array if no shows provided
    };

    theaters.push(newTheater);
    writeData(THEATERS_FILE, theaters);

    // console.log("New theater added:", newTheater); // Debug log
    res.status(201).json(newTheater);
  }
);

// Admin-only route - Delete a theater by ID
router.delete(
  "/:theater_id/delete",
  jwtAuth,
  adminAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { theater_id } = req.params;

    const theaters: Theater[] = readData<Theater[]>(THEATERS_FILE);

    const theaterIndex = theaters.findIndex(
      (t) => t.theater_id === parseInt(theater_id)
    );

    if (theaterIndex === -1) {
      console.log("Theater not found for delete:", theater_id); // Debug log
      return res.status(404).json({ message: "Theater not found" });
    }

    const deletedTheater = theaters.splice(theaterIndex, 1);
    writeData(THEATERS_FILE, theaters);

    // console.log("Theater deleted:", deletedTheater[0]); // Debug log
    res.json({
      message: "Theater deleted successfully",
      theater: deletedTheater[0],
    });
  }
);

export default router;
