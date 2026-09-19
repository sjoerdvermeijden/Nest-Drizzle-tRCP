# NestJS + Drizzle setup

## Om het project draaiende te krijgen

- Maak een `.env` bestand aan met de database gegevens

```env
DB_CONTAINER_NAME=restaurant_postgres
DB_NAME=restaurant_db
DB_USER=postgres
DB_PASSWORD=local
DB_PORT=5432
DATABASE_URL=postgres://postgres:local@localhost:5432/restaurant_db
```

Initialiseer het project:
```
npm install
```

Gevolgd door:
```
docker compose up
npm run start
```

## Een resource toevoegen en de data ervan fetchen

Geneer een nieuwe resource met de CLi
- nest g resource {{resource}}

### 1. Voeg imports toe aan de {{resource}}.service.ts

```ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
```

### 2. Voeg de volgende constructor toe aan de class in {{resource}}.service.ts

```ts
constructor(
  @Inject(DrizzleAsyncProvider)
  private db: NodePgDatabase<typeof schema>,
) {}
```

### 3. Voeg de drizzle module in de resource module, {{resource}}.module.ts

```ts
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
```

### 4. Fetch data van de resource in {{resource}}.service.ts

```ts
async findAll() {
  const allCars = await this.db.select().from(schema.cars);
  return allCars;
}
```
