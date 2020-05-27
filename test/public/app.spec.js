import test from 'ava';
import {setParam} from '../../src/public/app';

test('setParam adds a string query param', t => {
	const url = 'http://www.test.com/';
	t.is(setParam(url, 'string', 'bar'), `${url}?string=bar`);
});

test('setParam replaces an existing query param of string', t => {
	const url = 'http://www.test.com/';
	const param = '?string=bar';
	t.is(setParam(`${url}${param}`, 'string', 'baz'), `${url}?string=baz`);
});

test('setParam only replaces string query param', t => {
	const url = 'http://www.test.com/';
	const param = '?string=bar&foo=bar';
	t.is(
		setParam(`${url}${param}`, 'string', 'baz'),
		`${url}?string=baz&foo=bar`
	);
});
