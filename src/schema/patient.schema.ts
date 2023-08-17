import { array, object, string, TypeOf } from "zod";
const createPayload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
};

const updatePayLoad = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    procedures: array(
      string({
        required_error: "Procedure is required",
      })
    ),
  }),
};

const params = {
  params: object({
    patientId: string({
      required_error: "patientId is required",
    }),
  }),
};

export const createPatientSchema = object({
  ...createPayload,
});

export const updatePatientSchema = object({
  ...updatePayLoad,
  ...params,
});

export const deletePatientSchema = object({
  ...params,
});

export const getPatientSchema = object({
  ...params,
});

export type CreatePatientInput = TypeOf<typeof createPatientSchema>;
export type UpdatePatientInput = TypeOf<typeof updatePatientSchema>;
export type DeletePatientInput = TypeOf<typeof deletePatientSchema>;
export type GetPatientInput = TypeOf<typeof getPatientSchema>;
