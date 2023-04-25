const kue = require('kue');
const queue = kue.createQueue({
    redis: 'redis://red-cgsee89jvhtrd24irpgg:6379'
});
module.exports = queue;  