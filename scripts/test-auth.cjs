const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync('admin123', 10);
console.log('Generated hash for admin123:', hash);
console.log('Validation test:', bcrypt.compareSync('admin123', hash));
