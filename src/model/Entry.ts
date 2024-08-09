import {Type} from "../enums/Type";

export class Entry {
    constructor(public uuid: string,
                public type: Type,
                public category: string,
                public description: string,
                public price: number,
                public createdAt: Date,
                public lastUpdate: Date,
                public isDeleted: boolean,
                public isBeingEdited: boolean) {

    }

    public static emptyEntry() {
      return new Entry(
        '',
        Type.EXPENSE,
        '',
        '',
        0,
        new Date(),
        new Date(),
        false,
        false
      )
    }
}
