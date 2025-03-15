import fs from 'fs';
import path from 'path';
import logger from './Logger';

class NoSQLDatabase {
    private basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath, { recursive: true });
        }
    }

    private log(action: string, message: string) {
        logger.info(`${action}: ${message}`);
    }

    // Method to add a document to a collection
    addDocument(collection: string, id: string, data: any) {
        const collectionPath = path.join(this.basePath, `${collection}.json`);
        let collectionData = [];

        if (!fs.existsSync(collectionPath)) {
            this.log('CREATION', `Collection ${collection} has been created`);
            collectionData = [];
        } else {
            collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        }

        const document = { id, ...data };
        collectionData.push(document);

        fs.writeFileSync(collectionPath, JSON.stringify(collectionData, null, 2), 'utf8');
        this.log('ADD', `Document added to the collection ${collection} with ID: ${id}`);
    }

    // Method to get a document by its ID
    getDocument(collection: string, id: string) {
        const collectionPath = path.join(this.basePath, `${collection}.json`);
        if (!fs.existsSync(collectionPath)) {
            this.log('Error', `Collection ${collection} not found`);
            return null;
        }

        const collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        const document = collectionData.find((doc: any) => doc.id === id);

        if (document) {
            this.log('RETRIEVAL', `Document with ID ${id} found in the collection ${collection}`);
            return document;
        } else {
            this.log('Error', `Document with ID ${id} not found in the collection ${collection}`);
            return null;
        }
    }

    // Method to update a document by its ID
    updateDocument(collection: string, id: string, updates: Partial<any>) {
        const collectionPath = path.join(this.basePath, `${collection}.json`);
        if (!fs.existsSync(collectionPath)) {
            this.log('Error', `Collection ${collection} not found`);
            return false;
        }

        let collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        const documentIndex = collectionData.findIndex((doc: any) => doc.id === id);

        if (documentIndex === -1) {
            this.log('Error', `Document with ID ${id} not found in the collection ${collection}`);
            return false;
        }

        // Update the document
        collectionData[documentIndex] = { ...collectionData[documentIndex], ...updates };

        // Save the updated data
        fs.writeFileSync(collectionPath, JSON.stringify(collectionData, null, 2), 'utf8');
        this.log('UPDATE', `Document with ID ${id} updated in the collection ${collection}`);
        return true;
    }

    // Method to delete a document
    deleteDocument(collection: string, id: string) {
        const collectionPath = path.join(this.basePath, `${collection}.json`);
        if (!fs.existsSync(collectionPath)) {
            this.log('Error', `Collection ${collection} not found`);
            return false;
        }

        let collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        const documentIndex = collectionData.findIndex((doc: any) => doc.id === id);

        if (documentIndex === -1) {
            this.log('Error', `Document with ID ${id} not found in the collection ${collection}`);
            return false;
        }

        // Delete the document
        collectionData.splice(documentIndex, 1);

        // Save the data after deletion
        fs.writeFileSync(collectionPath, JSON.stringify(collectionData, null, 2), 'utf8');
        this.log('DELETE', `Document with ID ${id} deleted from the collection ${collection}`);
        return true;
    }

    // Method to get all documents from a collection
    getCollection(collection: string) {
        const collectionPath = path.join(this.basePath, `${collection}.json`);
        if (!fs.existsSync(collectionPath)) {
            this.log('Error', `Collection ${collection} not found`);
            return [];
        }

        const collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
        this.log('RETRIEVAL', `All documents retrieved from the collection ${collection}`);
        return collectionData;
    }
}

export default NoSQLDatabase;
