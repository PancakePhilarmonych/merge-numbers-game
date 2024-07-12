import './assets/main.sass';
import GameManager from './modules/GameManager';

const loading = document.createElement('div');
loading.style.position = 'absolute';
loading.style.top = '0';
loading.style.left = '0';
loading.style.width = '100%';
loading.style.height = '100%';
loading.style.backgroundColor = '#000';
loading.style.display = 'flex';
loading.style.justifyContent = 'center';
loading.style.alignItems = 'center';
loading.style.zIndex = '1000';
loading.innerHTML = '<h1 style="color: #fff">Loading...</h1>';
document.body.appendChild(loading);

setTimeout(() => {
  new GameManager();
  document.body.removeChild(loading);
}, 1500);
