import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import pg from 'pg';
import { exit } from 'process';

import * as allSchema from './schema';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

(async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
  });
  let db: NodePgDatabase<typeof allSchema> | null = null;
  db = drizzle({
    client: pool,
    schema: {
      ...allSchema,
    },
  });

  // Look for migrations in the src/drizzle/migrations folder
  const migrationPath = path.join(process.cwd(), 'src/drizzle/migrations');

  // Run the migrations
  await migrate(db, { migrationsFolder: migrationPath });

  // Insert default roles
  for (const role of ['Super Admin', 'Admin', 'User', 'Guest']) {
    const existingUserRole = await db
      ?.select({
        name: allSchema.user_role.name,
      })
      .from(allSchema.user_role)
      .where(eq(allSchema.user_role.name, role));
    if (!existingUserRole[0]) {
      await db?.insert(allSchema.user_role).values({ name: role });
    }
  }
  console.log('Migration complete');
  exit(0);
})();