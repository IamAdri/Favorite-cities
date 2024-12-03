import { DataSource } from "typeorm";
import { Favorite } from "./entity/Favorites";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    synchronize: true,
    logging: false,
    entities: [Favorite]
});
