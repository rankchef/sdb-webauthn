import { cpSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const serverRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(serverRoot, '../client/dist');
const destination = join(serverRoot, 'public');

if (!existsSync(source)) {
  throw new Error('client/dist is missing. Run the client build first.');
}

mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
console.log(`Copied client build to ${destination}`);
