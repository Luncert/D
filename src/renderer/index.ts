import NAME from '../common/common';
import $ from 'jquery';

export function init() {
  document.write(`<h1>The name is 111222${NAME}</h1>`);
}

$(document).ready(() => {
  init();
});
