//errors
//Result Type for CreateUser

export type PrismaResult<T, E> = { ok: true; value: T } | { ok: false; error: E };
