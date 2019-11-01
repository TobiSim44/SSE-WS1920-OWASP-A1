const c = require('crypto')

const secret = 'congratzForLevel1';
const hash = c.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');

console.log(hash);
