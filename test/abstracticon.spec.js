import crypto, {createHash} from 'crypto';
import test from 'ava';
import {abstracticon} from '../src/lib/abstracticon';

test('given a hash, an svg is generated', t => {
	const hash = createHash('sha256')
		.update(crypto.randomBytes(20).toString('hex'))
		.digest('hex');
	t.is(abstracticon(hash), '');
});
