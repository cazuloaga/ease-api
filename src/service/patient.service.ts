import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PatientnModel, { PatientDocument } from "../models/patient.model";

export async function createPatient(
  input: Omit<PatientDocument, "createdAt" | "updatedAt">
) {
  try {
    const result = await PatientnModel.create(input);
    return result;
  } catch (e) {
    throw e;
  }
}

export async function findPatient(
  query: FilterQuery<PatientDocument>,
  options: QueryOptions = { lean: true }
) {
  try {
    const result = await PatientnModel.findOne(query, {}, options);

    return result;
  } catch (e) {
    throw e;
  }
}

export async function findAllPatients(
  query: FilterQuery<PatientDocument>,
  options: QueryOptions = { lean: true }
) {
  try {
    const result = await PatientnModel.find(query, {}, options);

    return result;
  } catch (e) {
    throw e;
  }
}

export async function findAndUpdatePatient(
  query: FilterQuery<PatientDocument>,
  update: UpdateQuery<PatientDocument>,
  options: QueryOptions
) {
  try {
    const result = await PatientnModel.findOneAndUpdate(query, update, options);
    return result;
  } catch (e) {
    throw e;
  }
}
export async function deletePatient(query: FilterQuery<PatientDocument>) {
  try {
    const result = await PatientnModel.deleteOne(query);
    return result;
  } catch (e) {
    throw e;
  }
}
