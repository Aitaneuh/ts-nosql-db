import axios from "axios";

const API_URL = "http://localhost:3000";
const COLLECTION = "cars";
const TEST_ID = "ID001";

interface CarData {
    brand: string;
    model: string;
    horsepower: number;
    country: string;
}

describe("NoSQL Database API", () => {
    let testCar: CarData;

    beforeAll(() => {
        testCar = {
            brand: "Citröen",
            model: "2 CV",
            horsepower: 2,
            country: "France"
        };
    });

    test("1️⃣ Should add a new document", async () => {
        const res = await axios.post(`${API_URL}/${COLLECTION}`, { id: TEST_ID, data: testCar });
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("message", "Successfully added");
    });

    test("2️⃣ Should retrieve the document", async () => {
        const res = await axios.get(`${API_URL}/${COLLECTION}/${TEST_ID}`);
        expect(res.status).toBe(200);
        expect(res.data).toMatchObject(testCar);
    });

    test("3️⃣ Should update the document", async () => {
        const updatedUser: CarData = { ...testCar, brand: "Citroën" };
        const res = await axios.put(`${API_URL}/${COLLECTION}/${TEST_ID}`, { id: TEST_ID, data: updatedUser });
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("message", "Successfully updated");
    });

    test("4️⃣ Should verify the updated document", async () => {
        const res = await axios.get(`${API_URL}/${COLLECTION}/${TEST_ID}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("brand", "Citroën");
    });

    test("5️⃣ Should delete the document", async () => {
        const res = await axios.delete(`${API_URL}/${COLLECTION}/${TEST_ID}`);
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("message", "Successfully deleted");
    });

    test("6️⃣ Should return 404 for deleted document", async () => {
        try {
            await axios.get(`${API_URL}/${COLLECTION}/${TEST_ID}`);
        } catch (error: any) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty("error");
        }
    });

    test("7️⃣ Should return 400 when adding a document without an ID", async () => {
        try {
            await axios.post(`${API_URL}/${COLLECTION}`, { data: { name: "Jane" } });
        } catch (error: any) {
            expect(error.response.status).toBe(400);
            expect(error.response.data).toHaveProperty("error", "Missing 'id' or 'data' in request body");
        }
    });
});
