import { z } from "zod";

export const ObjectIdString = (
  fieldName = "ObjectId",
  errorMessage = `Invalid ${fieldName} format. Must be a 24-character hex string.`,
) =>
  z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
    message: errorMessage,
  });
