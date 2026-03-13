/**
 * User model reference.
 * Better Auth stores users in MongoDB via its adapter.
 * Additional fields: isVerified, organisationDomain are configured in auth.js
 *
 * Schema:
 * - _id (MongoDB id, Better Auth uses "id" string)
 * - name
 * - email
 * - password (hashed, stored in account table by Better Auth)
 * - isVerified (boolean)
 * - organisationDomain (string)
 */

export const userSchema = {
  name: String,
  email: String,
  isVerified: Boolean,
  organisationDomain: String,
};
