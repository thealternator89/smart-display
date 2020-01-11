var copyfiles = require('copyfiles');

copyfiles(['views/**/*', 'dist'], 0, () => undefined);