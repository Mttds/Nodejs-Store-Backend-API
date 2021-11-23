import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const {
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWD,
    DATABASE_TEST_NAME,
    ENV,
} = process.env;

let dbclient: unknown;
console.log(ENV)

if(ENV === 'test') {
    dbclient = new Pool({
    host: DATABASE_HOST,
    database: DATABASE_TEST_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWD,
  })
}

if(ENV === 'dev') {
    dbclient = new Pool({
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASSWD,
  })
}

export default (dbclient as Pool);
