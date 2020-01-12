import 'default-passive-events';
import $ from 'jquery';
import ShellPanel from './com/ShellPanel';
import Component from './com/Component';

function renderPanel(root: HTMLElement, panel: Component) {
  let elem = panel.init()
  $(elem).appendTo(root)
  panel.componentDidMount()
}

function init() {
  let root = document.getElementById('root')
  renderPanel(root, new ShellPanel())
}

$(document).ready(() => {
  init();
});
