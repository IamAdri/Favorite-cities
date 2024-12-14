import { EntitySchema } from "typeorm";

export const Rating = new EntitySchema({
    name:"Rating",
    columns: {
        id: {
            type:"int",
            primary: true,
            generated: true,
        },
        rating: {
            type: "varchar",
        },
        review: {
            type: "varchar"
        },
        cityName: {
            type: "varchar",
        },
        country: {
            type: "varchar"
        }
        
    }
})