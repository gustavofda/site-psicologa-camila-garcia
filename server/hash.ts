import bcrypt from 'bcryptjs';

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Uso: npm run hash -- "senha com 10 ou mais caracteres"');
  process.exit(1);
}
console.log(bcrypt.hashSync(pw, 12));
