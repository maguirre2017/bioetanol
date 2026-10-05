'use strict';
const cards = [...document.querySelectorAll('.photo-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
const dialog = document.querySelector('#photo-dialog');
const dialogImage = document.querySelector('#dialog-image');
const caption = document.querySelector('#dialog-caption');
let activeCard = null;
let opener = null;
function visibleCards() { return cards.filter(card => !card.hidden); }
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  document.querySelector('#photo-count').textContent = visibleCards().length + ' fotografías';
}));
function showPhoto(card) {
  activeCard = card;
  dialogImage.src = card.querySelector('button').dataset.full;
  dialogImage.alt = card.querySelector('img').alt;
  caption.textContent = card.querySelector('h3').textContent + ' · ' + card.querySelector('time').textContent;
}
cards.forEach(card => card.querySelector('button').addEventListener('click', event => {
  opener = event.currentTarget;
  showPhoto(card);
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
function movePhoto(direction) {
  const visible = visibleCards();
  showPhoto(visible[(visible.indexOf(activeCard) + direction + visible.length) % visible.length]);
}
document.querySelector('#photo-prev').addEventListener('click', () => movePhoto(-1));
document.querySelector('#photo-next').addEventListener('click', () => movePhoto(1));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') {event.preventDefault();movePhoto(-1);} if (event.key === 'ArrowRight') {event.preventDefault();movePhoto(1);} });
dialog.addEventListener('close', () => {document.body.classList.remove('modal-open');if(opener) opener.focus();});

// Navegación accesible de los gráficos del protocolo.
const workflowTabs = [...document.querySelectorAll('[data-workflow]')];
const workflowPanels = [...document.querySelectorAll('[data-workflow-panel]')];
document.querySelector('.workflow-tabs').setAttribute('role', 'tablist');
workflowTabs.forEach(tab => {
  tab.setAttribute('role', 'tab');
  tab.setAttribute('aria-controls', 'panel-' + tab.dataset.workflow);
});
workflowPanels.forEach(panel => {
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
});
function selectWorkflow(tab, focus = false) {
  workflowTabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  workflowPanels.forEach(panel => {panel.hidden = panel.dataset.workflowPanel !== tab.dataset.workflow;});
  if (focus) tab.focus();
}
selectWorkflow(workflowTabs[0]);
workflowTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectWorkflow(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % workflowTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + workflowTabs.length) % workflowTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = workflowTabs.length - 1;
    if (next !== undefined) {event.preventDefault();selectWorkflow(workflowTabs[next], true);}
  });
});
const workflowDialog = document.querySelector('#workflow-dialog');
const workflowImage = document.querySelector('#workflow-dialog-image');
const workflowZoom = document.querySelector('#workflow-zoom');
const workflowScroll = document.querySelector('.workflow-image-scroll');
let workflowOpener;
document.querySelectorAll('.workflow-open').forEach(button => button.addEventListener('click', () => {
  workflowOpener = button;
  const img = button.querySelector('img');
  workflowImage.src = img.src;
  workflowImage.alt = img.alt;
  document.querySelector('#workflow-dialog-title').textContent = button.dataset.title;
  workflowScroll.classList.remove('detail');
  workflowZoom.setAttribute('aria-pressed', 'false');
  workflowZoom.textContent = 'Ver detalle';
  workflowDialog.showModal();
  workflowScroll.scrollTop = workflowScroll.scrollLeft = 0;
  document.body.classList.add('modal-open');
}));
workflowZoom.addEventListener('click', () => {
  const detail = workflowScroll.classList.toggle('detail');
  workflowZoom.setAttribute('aria-pressed', String(detail));
  workflowZoom.textContent = detail ? 'Ajustar al ancho' : 'Ver detalle';
});
document.querySelector('#workflow-close').addEventListener('click', () => workflowDialog.close());
workflowDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (workflowOpener) workflowOpener.focus();
});
workflowDialog.addEventListener('click', event => {
  if (event.target === workflowDialog) {
    const r = workflowDialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) workflowDialog.close();
  }
});
