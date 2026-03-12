import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export { sql };

// Database helper functions
export async function query<T>(text: string, params?: any[]): Promise<T[]> {
  try {
    const result = await sql.query(text, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T>(text: string, params?: any[]): Promise<T | null> {
  const result = await query<T>(text, params);
  return result.length > 0 ? result[0] : null;
}
