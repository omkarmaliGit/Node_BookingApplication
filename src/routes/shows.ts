import express, { Request, Response } from "express";
import { readData, writeData } from "../helper/fileHelpers";
import jwtAuth from "../middleware/basicAuth";
import adminAuth from "../middleware/roleAuth";

const router = express.Router();
const SHOWS_FILE = "./src/storage/shows.json";

interface BookedSeat {
  seat_number: string;
  user_id: string;
}

interface Show {
  show_id: number;
  movie_id: number;
  theater_id: number;
  date: string;
  time: string;
  available_seats: number;
  booked_seats: BookedSeat[];
}

// User route - Retrieve all shows
router.get("/", jwtAuth, async (req: Request, res: Response): Promise<any> => {
  const shows = readData<Show[]>(SHOWS_FILE);
  if (!shows) {
    return res.status(500).json({ message: "Error loading shows" });
  }
  res.json(shows);
});

// Admin-only route - Add a new show
router.post(
  "/add",
  jwtAuth,
  adminAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { movie_id, theater_id, date, time, available_seats, booked_seats } =
      req.body;

    const shows = readData<Show[]>(SHOWS_FILE);

    // Find the highest show ID
    const lastShowId =
      shows.length > 0 ? Math.max(...shows.map((show) => show.show_id)) : 0;

    const newShow: Show = {
      show_id: lastShowId + 1,
      movie_id: parseInt(movie_id),
      theater_id: parseInt(theater_id),
      date,
      time,
      available_seats: parseInt(available_seats),
      booked_seats: booked_seats || [],
    };

    shows.push(newShow);
    writeData(SHOWS_FILE, shows);

    console.log("New show added:", newShow); // Debug log
    res.status(201).json(newShow);
  }
);

// Admin-only route - Delete a show by ID
router.delete(
  "/:show_id/delete",
  jwtAuth,
  adminAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { show_id } = req.params;

    const shows: Show[] = readData<Show[]>(SHOWS_FILE);

    const showIndex = shows.findIndex((s) => s.show_id === parseInt(show_id));

    if (showIndex === -1) {
      console.log("Show not found for delete:", show_id); // Debug log
      return res.status(404).json({ message: "Show not found" });
    }

    const deletedShow = shows.splice(showIndex, 1);
    writeData(SHOWS_FILE, shows);

    console.log("Show deleted:", deletedShow[0]); // Debug log
    res.json({
      message: "Show deleted successfully",
      show: deletedShow[0],
    });
  }
);

export default router;
