import NoSQLDatabase from "./Database";

class QueryEngine {
    constructor(private db: NoSQLDatabase) { }

    where(collection: string, field: string, operator: string, value: any) {
        const documents = this.db.getCollection(collection);
        return Object.values(documents).filter((doc: any) => {
            switch (operator) {
                case ">": return doc[field] > value;
                case "<": return doc[field] < value;
                case "==": return doc[field] === value;
                default: return false;
            }
        });
    }
}

export default QueryEngine;
