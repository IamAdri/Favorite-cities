import { EntitySchema } from "typeorm";

const User = new EntitySchema({
  name: "User",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
    },
    age: {
      type: "int",
    },
  },
});

export default  User