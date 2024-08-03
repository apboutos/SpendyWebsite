export class Category {
    constructor(public uuid: string,
                public name: string,
                public type: string,
                public createdAt: Date,
                public lastUpdate: Date,
                public isDeleted: boolean,
                public isBeingEdited: boolean,) {
    }

    public static emptyCategory(): Category {
      return { uuid: '', type: '', name: '', createdAt: new Date(), lastUpdate: new Date(), isDeleted: false, isBeingEdited: false};
    }
}
