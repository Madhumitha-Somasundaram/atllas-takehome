import concurrently from 'concurrently';

concurrently([
  {
    cwd: './packages/back-end',
    name: 'API',
    command: 'npm run start:dev',
    prefixColor: 'green',
  },
  {
    cwd: './packages/front-end',
    name: 'WEB',
    command: 'npm run start:dev',
    prefixColor: 'yellow',
  },
]);