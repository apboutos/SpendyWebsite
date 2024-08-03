import {EntryType} from "../enums/EntryType";

export class Entry {
    constructor(public uuid: string,
                public type: EntryType,
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
        EntryType.EXPENSE,
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
