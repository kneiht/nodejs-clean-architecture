import { z, ZodType } from 'zod';

export class ZodValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZodValidationError';
  }
}

export function zodParse(
  zodSchema: ZodType,
  dataInput: z.infer<typeof zodSchema>,
) {
  const result = zodSchema.safeParse(dataInput);
  if (!result.success) {
    throw new ZodValidationError(
      result.error.issues.map((iss) => iss.message).join(', '),
    );
  }
  return result.data;
}
