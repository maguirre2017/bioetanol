'use strict';
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('#main-nav');
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}));

const filters=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('.photo-card')];
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  const selected=btn.dataset.filter;
  cards.forEach(card=>{card.hidden=selected!=='all'&&card.dataset.category!==selected;});
}));

const dialog=document.querySelector('#photo-dialog');
const dialogImage=document.querySelector('#dialog-image');
const dialogCaption=document.querySelector('#dialog-caption');
let opener=null;
cards.forEach(card=>{
  const button=card.querySelector('button');
  button?.addEventListener('click',()=>{
    opener=button;
    dialogImage.src=button.dataset.full;
    dialogImage.alt=button.querySelector('img')?.alt||'';
    dialogCaption.textContent=card.querySelector('figcaption')?.innerText.replace(/\n/g,' · ')||'';
    dialog.showModal();
  });
});
document.querySelector('.dialog-close')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog?.addEventListener('close',()=>opener?.focus());
