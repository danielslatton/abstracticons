const {Document} = require('basichtml');

global.document = new Document();
global.btoa = data => {
	Buffer.from(data).toString('base64');
};
