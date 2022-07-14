import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "data/database.sqlite",
    synchronize: true,
    logging: false,
    entities: ["src/**/entity/**/*.ts"],
    migrations: [],
    subscribers: [],
})
