// @ts-check

/**
 * Test data used across specs. In a real project this might come from
 * a JSON file, a database, or an environment-specific fixture.
 */
const users = {
  standard:   { username: 'standard_user',      password: 'secret_sauce' },
  lockedOut:  { username: 'locked_out_user',    password: 'secret_sauce' },
  problem:    { username: 'problem_user',       password: 'secret_sauce' },
  performance:{ username: 'performance_glitch_user', password: 'secret_sauce' },
};

const invalidCredentials = [
  { username: '',                password: 'secret_sauce', error: 'Username is required' },
  { username: 'standard_user',   password: '',              error: 'Password is required' },
  { username: 'wrong_user',      password: 'wrong_pass',    error: 'do not match' },
];

const customer = {
  firstName: 'Utkarsh',
  lastName:  'Gupta',
  postalCode: '110001',
};

const products = {
  backpack:  'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  tshirt:    'Sauce Labs Bolt T-Shirt',
};

module.exports = { users, invalidCredentials, customer, products };
