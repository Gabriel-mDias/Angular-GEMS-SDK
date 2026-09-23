import { readFileSync } from 'node:fs';

const rootPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const libraryPackage = JSON.parse(
  readFileSync(new URL('../projects/gems-sdk/package.json', import.meta.url), 'utf8'),
);
const tagIndex = process.argv.indexOf('--tag');
const tag = tagIndex >= 0 ? process.argv[tagIndex + 1] : undefined;

if (rootPackage.version !== libraryPackage.version) {
  throw new Error(
    `Versões divergentes: raiz=${rootPackage.version}, biblioteca=${libraryPackage.version}.`,
  );
}

if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(libraryPackage.version)) {
  throw new Error(`Versão SemVer inválida: ${libraryPackage.version}.`);
}

if (tag && tag !== `v${libraryPackage.version}`) {
  throw new Error(`Tag ${tag} não corresponde à versão v${libraryPackage.version}.`);
}

console.log(`Metadados de release válidos para ${libraryPackage.version}.`);
