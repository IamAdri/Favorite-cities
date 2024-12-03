import { AppDataSource } from "../../data-source";
import { Favorite } from "@/entity/Favorites";

export default async function handler(req, res) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    try {
      const favoriteRepo = AppDataSource.getRepository(Favorite);

      if (req.method === "POST") {
        const { cityName, country } = req.body;

        const existingFavorite = await favoriteRepo.findOneBy({
          cityName,
          country,
        });

        if (existingFavorite) {
          await favoriteRepo.remove(existingFavorite);
          return res.status(200).json(existingFavorite);
        } else {
          const newFavorite = favoriteRepo.create({ cityName, country });
          await favoriteRepo.save(newFavorite);
          return res.status(200).json(newFavorite);
        }
      }

      if (req.method === "GET") {
        const favorites = await favoriteRepo.find();
        console.log("Is getted")
        return res.status(200).send(favorites);
      }

      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
      console.error("Transaction error:", error);
      return res.status(500).json({ error: "Internal ServerError" });
    }
  } catch (error) {
    console.log(error);
  }
}
