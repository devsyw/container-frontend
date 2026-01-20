import React from 'react';
import '../styles/ContainerCard.css';

const iconMap = {
  vscode: '💻',
  jupyter: '📓',
  streamlit: '📊',
  default: '📦'
};

function ContainerCard({ template, onLaunch, isLaunching }) {
  const icon = iconMap[template.icon] || iconMap.default;

  return (
    <div className="container-card">
      <div className="card-icon">{icon}</div>
      <h3>{template.name}</h3>
      <p>{template.description}</p>
      <div className="card-footer">
        <span className="port">Port: {template.port}</span>
        <button 
          className={`launch-btn ${isLaunching ? 'launching' : ''}`}
          onClick={() => onLaunch(template.id)}
          disabled={isLaunching}
        >
          {isLaunching ? '시작 중...' : '실행'}
        </button>
      </div>
    </div>
  );
}

export default ContainerCard;