import { EntitySchema } from "typeorm";

export const Favorite = new EntitySchema({
    name:"Favorite",
    columns: {
        id: {
            type:"int",
            primary: true,
            generated: true,
        },
        cityName: {
            type: "varchar",
        },
        country: {
            type: "varchar",
        }
    }
})