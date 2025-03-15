import fs from "fs";
import path from "path";

class Indexer {
    private indexFile: string;

    constructor(basePath: string) {
        this.indexFile = path.join(basePath, "index.json");
        if (!fs.existsSync(this.indexFile)) {
            fs.writeFileSync(this.indexFile, JSON.stringify({}));
        }
    }

    addIndex(collection: string, field: string, id: string, value: any) {
        const indexData = JSON.parse(fs.readFileSync(this.indexFile, 'utf8'));

        if (!indexData[collection]) {
            indexData[collection] = {};
        }
        if (!indexData[collection][field]) {
            indexData[collection][field] = {};
        }

        indexData[collection][field][value] = id;  // Store document ID by field value
        fs.writeFileSync(this.indexFile, JSON.stringify(indexData, null, 2), 'utf8');
    }

    queryIndex(collection: string, field: string, value: any) {
        const indexData = JSON.parse(fs.readFileSync(this.indexFile, 'utf8'));

        if (indexData[collection] && indexData[collection][field]) {
            return indexData[collection][field][value] || null;
        }
        return null;
    }

}

export default Indexer;
