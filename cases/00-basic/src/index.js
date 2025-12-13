import './styles.css';

console.log('Hello from webpack basic!');

const app = document.createElement('div');
app.id = 'app';
app.innerHTML = '<h1>Webpack 基础入门</h1><p>认识 mode、entry、output、module</p>';
document.body.appendChild(app);

