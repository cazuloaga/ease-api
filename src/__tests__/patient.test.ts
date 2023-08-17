import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import mongoose from "mongoose";
import {
  findAllPatients,
  createPatient,
  findAndUpdatePatient,
} from "../service/patient.service";
import { signJwt } from "../utils/jwt.utils";
import { array } from "zod";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const patientPayload = {
  user: userId,
  email: "testpatient1@test.com",
  name: "Tester Mc Testy",
};

export const updatePatientPayload = {
  user: userId,
  email: "testpatient1@test.com",
  name: "Tester Mc Testy",
  procedures: ["test1", "test2"],
};

export const userPayload = {
  _id: userId,
  email: "jane.doe@example.com",
  name: "Jane Doe",
};

const jwt = signJwt(userPayload);

describe("patient", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get all patient route", () => {
    it("should return a 200 status and all the patients", async () => {
      // @ts-ignore
      const patients = await findAllPatients();

      const { body, statusCode } = await supertest(app)
        .get(`/api/patients`)
        .set("Authorization", `Bearer ${jwt}`);

      expect(statusCode).toBe(200);
      expect(body).toEqual(patients);
    });
  });

  describe("get patient route", () => {
    describe("given the patient does not exist", () => {
      it("should return a 404", async () => {
        const patientId = "patient-123";

        await supertest(app)
          .get(`/api/patients/${patientId}`)
          .set("Authorization", `Bearer ${jwt}`)
          .expect(404);
      });
    });

    describe("given the patient does exist", () => {
      it("should return a 200 status and the patient", async () => {
        // @ts-ignore
        const patient = await createPatient(patientPayload);

        const { body, statusCode } = await supertest(app)
          .get(`/api/patients/${patient.patientId}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(200);

        expect(body.patientId).toBe(patient.patientId);
      });
    });
  });

  describe("create patient route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/patients");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 status and the patient", async () => {
        // @ts-ignore

        const { body, statusCode } = await supertest(app)
          .post(`/api/patients`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(patientPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
          patientId: expect.any(String),
          procedures: expect.any(Array),
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });

  describe("update patient route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/patients");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 status and the updated patient", async () => {
        // @ts-ignore

        const patient = await createPatient(patientPayload);

        const { body, statusCode } = await supertest(app)
          .put(`/api/patients/${patient.patientId}`)
          .set("Authorization", `Bearer ${jwt}`)
          .send(updatePatientPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          email: updatePatientPayload.email,
          name: updatePatientPayload.name,
          patientId: patient.patientId,
          procedures: updatePatientPayload.procedures,
          updatedAt: expect.any(String),
          user: userId,
        });
      });
    });
  });
});
