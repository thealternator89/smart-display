export type BuildElemOptions = { content?: string, id?: string, className?: string };
export type BuildImgOptions = { src: string, id?: string, className?: string, width?: number, height?: number, alt?: string}

export function buildDiv(options: BuildElemOptions): HTMLElement {
    return buildElem('div', options);
}

export function buildSpan(options: BuildElemOptions): HTMLElement {
    return buildElem('span', options);
}

export function buildImg(options: BuildImgOptions): HTMLElement {
    const img = document.createElement('img');
    img.src = options.src;
    img.id = safeStr(options.id);
    img.className = safeStr(options.className);
    img.width = options.width || options.height;
    img.height = options.height || options.width;
    img.alt = safeStr(options.alt);
    return img;
}

export function leftPad(input: string|number, pad: string, minWidth: number) {
    let output = `${input}`;
    while (output.length < minWidth) {
        output = pad + input;
    }
    return output;
}

function buildElem(type: 'div'|'span', options: BuildElemOptions): HTMLElement {
    const elem = document.createElement(type);
    elem.id = safeStr(options.id);
    elem.className = safeStr(options.className);
    elem.innerHTML = safeStr(options.content);
    return elem;
}

const safeStr = (str) => str || '';