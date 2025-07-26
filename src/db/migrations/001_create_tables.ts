import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create recipes table
  await db.schema
    .createTable("recipes")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("category", "varchar", (col) => col.notNull())
    .addColumn("prep_time", "integer", (col) => col.notNull())
    .addColumn("cook_time", "integer", (col) => col.notNull())
    .addColumn("servings", "integer", (col) => col.notNull())
    .addColumn(
      "created_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  // Create ingredients table
  await db.schema
    .createTable("ingredients")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn(
      "recipe_id",
      "varchar",
      (col) => col.references("recipes.id").onDelete("cascade").notNull(),
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("amount", "varchar", (col) => col.notNull())
    .addColumn("unit", "varchar", (col) => col.notNull())
    .addColumn("order_index", "integer", (col) => col.notNull())
    .execute();

  // Create instructions table
  await db.schema
    .createTable("instructions")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn(
      "recipe_id",
      "varchar",
      (col) => col.references("recipes.id").onDelete("cascade").notNull(),
    )
    .addColumn("step_number", "integer", (col) => col.notNull())
    .addColumn("instruction", "text", (col) => col.notNull())
    .execute();

  // Create indexes for better performance
  await db.schema
    .createIndex("idx_recipes_category")
    .on("recipes")
    .column("category")
    .execute();

  await db.schema
    .createIndex("idx_ingredients_recipe_id")
    .on("ingredients")
    .column("recipe_id")
    .execute();

  await db.schema
    .createIndex("idx_instructions_recipe_id")
    .on("instructions")
    .column("recipe_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("instructions").execute();
  await db.schema.dropTable("ingredients").execute();
  await db.schema.dropTable("recipes").execute();
}
