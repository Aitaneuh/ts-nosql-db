# NoSQL Database API

![No SQL](https://raw.githubusercontent.com/Aitaneuh/ts-nosql-db/refs/heads/main/public/android-chrome-192x192.png)

This is a simple API built using Node.js and Express to manage a NoSQL database. It provides CRUD operations for data and the ability to log server activity.

## Features

- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on data stored in collections.
- **Log Management**: Fetch the latest logs and automatically clean old log files.
- **Request Validation**: Ensures that the `id` and `data` fields are present in POST and PUT requests.
- **Periodic Tasks**: Logs server uptime and cleans old log files at regular intervals.

## Technologies

- **Node.js**: JavaScript runtime for the server-side logic.
- **Express**: Web framework for building the API.
- **NoSQLDatabase**: Custom NoSQL database class (implemented in `core/Database`).
- **Logger**: Custom logging utility (implemented in `core/Logger`).
- **Utils**: Utility functions for server uptime, log management, etc.

## Setup

### Prerequisites

- Node.js installed on your machine.
- A basic understanding of Node.js and Express.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Aitaneuh/ts-nosql-db.git
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm run dev
   ```

   This will start the server on port 3000 by default.

## Endpoints

### `/logs` (GET)
Fetch the latest logs from the log directory.
- Returns: JSON object with the log file name and its content.

### `/:collection` (GET)
Fetch all documents from the specified collection.
- Params: `collection` (name of the collection).
- Returns: Array of documents in the collection.

### `/:collection/:id` (GET)
Fetch a specific document by its ID from the collection.
- Params: `collection` (name of the collection), `id` (document ID).
- Returns: The document object if found, or an error message if not.

### `/:collection` (POST)
Create a new document in the specified collection.
- Params: `collection` (name of the collection).
- Request body: `{ id: string, data: object }`
- Returns: A success message with the document ID if added successfully.

### `/:collection/:id` (PUT)
Update a specific document by its ID in the collection.
- Params: `collection` (name of the collection), `id` (document ID).
- Request body: `{ data: object }`
- Returns: A success message if updated successfully, or an error if the document is not found.

### `/:collection/:id` (DELETE)
Delete a specific document by its ID from the collection.
- Params: `collection` (name of the collection), `id` (document ID).
- Returns: A success message if deleted successfully, or an error if the document is not found.

## Error Handling

- 400: Bad request (e.g., missing `id` or `data`).
- 404: Not found (e.g., document not found in the specified collection).
- 500: Internal server error (e.g., failure to read log files).

## Periodic Tasks

- Every 5 minutes: Logs the server's uptime.
- Every 24 hours: Cleans old log files.

## Contributions

Contributions are welcome! Feel free to submit pull requests to improve the project or add new features.