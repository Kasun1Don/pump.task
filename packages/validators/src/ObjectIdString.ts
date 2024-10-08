import { z } from "zod";

/**
 * A branded type representing a valid MongoDB ObjectId as a string.
 *
 * This branded type helps differentiate between a generic string and a string
 * that has been validated to be in the format of a 24-character hex ObjectId.
 * It provides extra type safety to ensure only valid ObjectIds are used in specific contexts.
 */
export type ObjectIdString = string & { __brand: "ObjectIdString" };

/**
 * Creates a Zod schema to validate a string as a valid MongoDB ObjectId.
 *
 * The schema enforces that the input string must be a 24-character hexadecimal string,
 * which corresponds to the format used by MongoDB ObjectIds. The function allows customization
 * of the field name and error message.
 *
 * @param {string} fieldName - The name of the field being validated (used in the error message).
 * @param {string} errorMessage - The custom error message to be displayed if validation fails.
 * @returns {z.ZodType} - A Zod schema that validates the input as a branded ObjectIdString.
 */
export const objectIdStringSchema = (
  fieldName = "ObjectId",
  errorMessage = `Invalid ${fieldName} format. Must be a 24-character hex string.`,
) =>
  z
    .string()
    .refine((id): id is ObjectIdString => /^[0-9a-fA-F]{24}$/.test(id), {
      message: errorMessage,
    });

/**
 * Validates an input value to ensure it is a valid MongoDB ObjectId string, and returns it as a branded type.
 *
 * This function uses the `objectIdStringSchema` to validate the input value and return it as a branded
 * `ObjectIdString` type. It throws an error if the input is not a valid 24-character hex string.
 * This provides both runtime validation and compile-time type safety for MongoDB ObjectIds.
 *
 * @param {unknown} id - The value to be validated as a valid ObjectId.
 * @param {string} fieldName - The name of the field being validated (used in the error message).
 * @returns {ObjectIdString} - A validated ObjectId as a branded type.
 * @throws {Error} - Throws a validation error if the input value is not a valid ObjectId string.
 */
export function validateObjectIdString(
  id: unknown,
  fieldName = "ObjectId",
): ObjectIdString {
  const schema = objectIdStringSchema(fieldName);
  return schema.parse(id);
}
