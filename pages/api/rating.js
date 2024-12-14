import { AppDataSource } from "../../data-source";

import { Rating } from "@/entity/Rating";

export default async function handler(req, res) {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    try {
      const ratingRepo = AppDataSource.getRepository(Rating);

      if (req.method === "POST") {
        const { rating, review, cityName, country } = req.body;
        const existingRating = await ratingRepo.findOneBy({
          cityName,
          country,
        });

        if (existingRating) {
          await ratingRepo.remove(existingRating);
          return res.status(200).json(existingRating);
        } else {
          const newRating = ratingRepo.create({ rating, review, cityName, country });
          await ratingRepo.save(newRating);
          return res.status(200).json(newRating);
        }
        }
      

      if (req.method === "GET") {
        const ratings = await ratingRepo.find();
        console.log("Is getted")
        return res.status(200).send(ratings);
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
export const config = {
  api: {
    externalResolver: true,
  },
}