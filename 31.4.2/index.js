const { sql, createPool } = require("slonik");

main()
  .then(() => {
    console.log("Got no timeout error.");
    process.exit(1);
  })
  .catch((error) => {
    if (error.message.includes("timeout")) {
      console.log("Got timeout error as expected.");
      process.exit(0);
    } else {
      console.error(error);
      process.exit(1);
    }
  });

async function main() {
  const connectionString = buildConnectionString();
  const pool = await createPool(connectionString, {
    maximumPoolSize: 1,
    connectionTimeout: 2000,
  });

  await Promise.all([
    // Slow query.
    pool.transaction(async (transaction) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return transaction.oneFirst(sql`SELECT NOW()`);
    }),

    // Fast query.
    pool.oneFirst(sql`SELECT NOW()`),
  ]);
}

function buildConnectionString() {
  const opts = {
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  };

  return `postgresql://${opts.username}:${opts.password}@${opts.host}:${opts.port}/${opts.database}`;
}
