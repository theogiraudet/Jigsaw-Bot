import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class Invite {
    
    @PrimaryColumn()
    code: string

    @Column()
    name: string

    @Column()
    createdBy: string

    @Column({ nullable: true })
    description?: string
    
    @Column({ nullable: true })
    expirationDate?: Date

    @Column()
    creationDate: Date

    constructor(code: string, name: string, createdBy: string, creationDate: Date, expirationDate?: Date, description?: string) {
        this.code = code
        this.name = name
        this.createdBy = createdBy
        this.description = description
        this.expirationDate = expirationDate
        this.creationDate = creationDate
    }


}