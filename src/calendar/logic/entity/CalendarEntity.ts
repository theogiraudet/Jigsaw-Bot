import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class CalendarEntity {
    
    @PrimaryColumn()
    name: string

    @Column()
    url: string

    constructor(name: string, url: string) {
        this.name = name
        this.url = url
    }
}