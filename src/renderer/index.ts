import $ from 'jquery';
import ShellPanel from './com/ShellPanel';
import Panel from './com/Panel';

function renderPanel(root: HTMLElement, panel: Panel) {
  let elem = panel.init()
  $(elem.root).appendTo(root)
  $(elem.style).appendTo(root)
  panel.componentDidMount()
}

function init() {
  let root = document.getElementById('root')
  renderPanel(root, new ShellPanel())
}

$(document).ready(() => {
  init();
});
