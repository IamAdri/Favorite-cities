import User from "@/entity/User";
import { DataSource } from "typeorm";


const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: false,
  entities: [User],
});


  
  export default AppDataSource