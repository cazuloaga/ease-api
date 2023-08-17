import { Response, Request } from "express";
import {
  CreatePatientInput,
  DeletePatientInput,
  GetPatientInput,
  UpdatePatientInput,
} from "../schema/patient.schema";
import {
  createPatient,
  deletePatient,
  findAllPatients,
  findAndUpdatePatient,
  findPatient,
} from "../service/patient.service";
import log from "../utils/logger";

export async function createPatientHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;
  const body = req.body;
  try {
    const patient = await createPatient({ ...body, user: userId });
    return res.send(patient);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e["message"]);
  }
}

export async function updatePatientHandler(
  req: Request<UpdatePatientInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const patientId = req.params.patientId;
  const update = req.body;
  const patient = await findPatient({ patientId });

  if (!patient) {
    return res.sendStatus(404);
  }

  if (String(patient.user) !== userId) {
    return res.sendStatus(403);
  }
  try {
    const updatedPatient = await findAndUpdatePatient(
      { patientId },
      update,
      {}
    );

    if (updatedPatient) {
      updatedPatient["procedures"] = update.procedures;
      return res.send(updatedPatient);
    }
  } catch (e: any) {
    log.error(e.message);
    return res.status(409).send(e.message);
  }
}

export async function getPatientHandler(
  req: Request<GetPatientInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const patientId = req.params.patientId;
  const patient = await findPatient({ patientId });

  if (!patient) {
    return res.sendStatus(404);
  }

  if (String(patient.user) !== userId) {
    return res.sendStatus(403);
  }

  return res.send(patient);
}

export async function getAllPatientsHandler(req: Request, res: Response) {
  const patients = await findAllPatients({});

  if (!patients) {
    return res.sendStatus(404);
  }

  return res.send(patients);
}

export async function deletePatientHandler(
  req: Request<DeletePatientInput["params"]>,
  res: Response
) {
  const userId = res.locals.user._id;
  const patientId = req.params.patientId;
  const patient = await findPatient({ patientId });

  if (!patient) {
    return res.sendStatus(404);
  }

  if (String(patient.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await deletePatient({ patientId });

  return res.sendStatus(200);
}
