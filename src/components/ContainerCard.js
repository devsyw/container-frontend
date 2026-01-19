import React from 'react';
import '../styles/ContainerCard.css';

const icons = {
  vscode: '💻',
  jupyter: '📓',
  jenkins: '🔧',
  python: '🐍',
  default: '📦'
};

function ContainerCard({ template, onLaunch }) {
  const icon = icons[template.icon] || icons.default;

  return (
    <div className="container-card">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{template.name}</h3>
      <p className="card-description">{template.description}</p>
      <div className="card-info">
        <span className="card-image">{template.image}</span>
        <span className="card-port">Port: {template.port}</span>
      </div>
      <button 
        className="launch-button"
        onClick={() => onLaunch(template.id)}
      >
        ▶ 실행
      </button>
    </div>
  );
}

export default ContainerCard;