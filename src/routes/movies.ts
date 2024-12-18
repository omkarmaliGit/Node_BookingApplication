import express, { Request, Response } from "express";
import { readData, writeData } from "../helper/fileHelpers";
import jwtAuth from "../middleware/basicAuth";
import adminAuth from "../middleware/roleAuth";
import permit from "../middleware/permit";
import authorize from "../middleware/authorize";

const router = express.Router();
const MOVIES_FILE = "./src/storage/movies.json";

interface Movie {
  movie_id: number;
  title: string;
  genre: [];
  duration: number;
  language: string;
  rating: number;
}

//User route
router.get("/", jwtAuth, async (req: Request, res: Response): Promise<any> => {
  const movies = readData<Movie[]>(MOVIES_FILE);
  if (!movies) {
    return res.status(500).json({ message: "Error loading posts" });
  }
  res.json(movies);
});

// Admin-only route
router.post(
  "/add",
  permit(["admin"]),
  async (req: Request, res: Response): Promise<any> => {
    const { title, genre, duration, language, rating } = req.body;
    const movies = readData<Movie[]>(MOVIES_FILE);

    // Find the highest post ID
    const lastMovieId =
      movies.length > 0
        ? Math.max(...movies.map((movie) => movie.movie_id))
        : 0;

    const newMovie: Movie = {
      movie_id: lastMovieId + 1,
      title,
      genre,
      duration,
      language,
      rating,
    };

    movies.push(newMovie);
    writeData(MOVIES_FILE, movies);

    console.log("New movie added:", newMovie); // Debug log
    res.status(201).json(newMovie);
  }
);

router.delete(
  "/:movie_id/delete",
  jwtAuth,
  adminAuth,
  async (req: Request, res: Response): Promise<any> => {
    const { movie_id } = req.params;
    const movies: Movie[] = readData<Movie[]>(MOVIES_FILE);

    const movieIndex = movies.findIndex(
      (m) => m.movie_id === parseInt(movie_id)
    );
    if (movieIndex === -1) {
      console.log("Movie not found for delete:", movie_id); // Debug log
      return res.status(404).json({ message: "Movie not found" });
    }

    const deletedMovie = movies.splice(movieIndex, 1);
    writeData(MOVIES_FILE, movies);

    console.log("Movie deleted:", deletedMovie[0]); // Debug log
    res.json({
      message: "Movie deleted successfully",
      post: deletedMovie[0],
    });
  }
);

export default router;
