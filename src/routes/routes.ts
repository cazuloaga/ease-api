import { Express, Request, Response } from "express";
import { createUserHandler } from "../controller/user.controller";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import { createSessionSchema } from "../schema/session.schema";
import {
  createSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "../controller/session.controller";
import requireUser from "../middleware/requireUser";
import {
  createPatientSchema,
  deletePatientSchema,
  getPatientSchema,
  updatePatientSchema,
} from "../schema/patient.schema";
import {
  createPatientHandler,
  deletePatientHandler,
  getAllPatientsHandler,
  getPatientHandler,
  updatePatientHandler,
} from "../controller/patient.controller";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createSessionHandler
  );
  app.get("/api/sessions", requireUser, getUserSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteSessionHandler);
  app.get("/api/patients", requireUser, getAllPatientsHandler);
  app.post(
    "/api/patients",
    [requireUser, validateResource(createPatientSchema)],
    createPatientHandler
  );
  app.put(
    "/api/patients/:patientId",
    [requireUser, validateResource(updatePatientSchema)],
    updatePatientHandler
  );
  app.get(
    "/api/patients/:patientId",
    [requireUser, validateResource(getPatientSchema)],
    getPatientHandler
  );
  app.delete(
    "/api/patients/:patientId",
    [requireUser, validateResource(deletePatientSchema)],
    deletePatientHandler
  );
}

export default routes;
