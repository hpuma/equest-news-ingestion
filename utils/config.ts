import * as env from "dotenv";

const { EQUEST_API_KEY, ENCRYPTION_KEY, ENCRYPTION_SALT } = env.config()
  .parsed as any;

export const config = {
  EQUEST_API_KEY,
  ENCRYPTION_KEY,
  ENCRYPTION_SALT,
};
