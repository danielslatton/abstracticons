import {createHash} from 'crypto';
import {comp, html, render} from 'hypersimple';
import generateName from 'project-name-generator';
import queryString from 'query-string';
import {abstracticon} from '../lib/abstracticon';
import * as _ from './styles.css';

const generate = (hash, shape) => {
	const opts = {
		shape
	};
	return abstracticon(hash, opts);
};

const createSha256 = string => {
	return createHash('sha256')
		.update(string)
		.digest('hex');
};

export const setParam = (url, key, value) => {
	const nURL = new URL(url);
	const params = nURL.searchParams;
	params.set(key, value);
	nURL.search = params.toString();
	return nURL.toString();
};

const Button = comp(
	model => html`
		<button
			class="btn-${model.variant} ${model.rounded ? 'rounded' : ''} w-full"
			onclick=${model.onclick}
			value=${model.text}
		>
			${model.text}
		</button>
	`
);

const LinkButton = comp(
	model => html`
		<a href=${model.href} download=${model.fileName}>
			<button
				class="btn-${model.variant} ${model.rounded ? 'rounded' : ''} w-full"
			>
				${model.text}
			</button>
		</a>
	`
);

const ButtonGroup = comp(
	model => html`
		<div class="flex justify-between px-4">
			${model.options.map(option =>
				Button({
					text: option,
					onclick: model.onShapeClick,
					variant: option === model.selectedShape ? 'primary' : 'secondary'
				})
			)}
		</div>
	`
);

const Input = comp(
	model => html`
  <input 
    class="bg-white focus:outline-none focus:shadow-outline border border-black rounded-lg py-2 px-4 block appearance-none leading-normal lg:w-full" 
    placeholder=${model.placeholder}
    onInput=${model.onInput}
    type=search
    value=${model.value}>
  </input>`
);

const Canvas = comp(
	model => html`
		<div id="art">
			${{html: model.art}}
		</div>
	`
);

const Heading = comp(
	model => html`
		<h1>
			${model.text}
		</h1>
	`
);

const Footer = comp(
	model => html`
		<p>
			made by
			<a class="no-underline" href="https://www.danielslatton.com"
				>daniel slatton
			</a>
		</p>
		<p>
			source available on
			<a class="no-underline" href=${model.source}>github</a>
		</p>
	`
);

const App = comp(
	model => html`
  <div class="flex flex-col min-h-screen">
    <nav class="w-full max-w-5xl container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-2 lg:py-6">
      ${Heading(model.heading)}
      <div class=max-w-sm>
        ${Button(model.randomButton)}
        </div>
    </nav>
    <div class="w-full mb-auto container mx-auto flex flex-col flex-wrap items-center justify-between mt-0 px-2 py-2 lg:py-6">
      <div class="my-4">
        ${ButtonGroup(model.canvas)}
      </div>
      ${Canvas(model.canvas)}
      <div class="flex w-2/5 items-center justify-around mt-4">
          <div class=lg:w-3/5>
            ${Input(model.stringInput)}
          </div>
          <div class="ml-2">
            ${LinkButton(model.downloadLink)}
          </div>
      </div>
    </div>
    <div class="flex h-full bg-gray-300 flex-col w-full justify-around mt-8 text-black italic items-center p-4">
    ${Footer(model.footer)}
    </div>
  </div>
`
);

const handleArtGeneration = model => {
	model.canvas.art = generate(
		createSha256(model.stringInput.value.trim()),
		model.canvas.selectedShape
	);
	model.downloadLink.href = `data:image/svg+xml;base64,${btoa(
		document.querySelector('#art svg').outerHTML
	)}`;
	model.downloadLink.fileName = `${model.stringInput.value}-${model.canvas.selectedShape}.svg`;
};

const setURL = value => {
	window.history.pushState(
		{},
		'',
		setParam(window.location.href, 'input', value)
	);
};

const createModel = () => {
	let initialWord = generateName({words: 3}).dashed;

	const params = queryString.parse(location.search);

	if (params.input && params.input !== '') {
		initialWord = params.input.slice(0, 100);
	}

	setURL(initialWord);
	const initialArt = generate(createSha256(initialWord), 'square');
	const initialHref = `data:image/svg+xml;base64,${btoa(initialArt)}`;

	const model = {
		downloadLink: {
			text: 'download',
			href: initialHref,
			variant: 'primary',
			rounded: true,
			fileName: `${initialWord}.svg`
		},
		stringInput: {
			value: initialWord,
			placeholder: 'input a string!',
			onInput(e) {
				model.stringInput.value = e.target.value;
				setURL(model.stringInput.value);
				handleArtGeneration(model);
			}
		},
		heading: {
			text: 'abstracticons'
		},
		canvas: {
			art: initialArt,
			options: ['square', 'circle', 'octagon', 'triangle'],
			selectedShape: 'square',
			onShapeClick(e) {
				model.canvas.selectedShape = e.target.value;
				handleArtGeneration(model);
			}
		},
		randomButton: {
			text: 'random',
			onclick() {
				model.stringInput.value = generateName({words: 3}).dashed;
				setURL(model.stringInput.value);
				handleArtGeneration(model);
			},
			variant: 'primary',
			rounded: true
		},
		footer: {
			source: 'https://github.com/danielslatton/abstracticons'
		}
	};

	return model;
};

render(document.body, () => App(createModel()));
