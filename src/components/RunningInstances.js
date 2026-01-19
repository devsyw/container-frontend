import React from 'react';
import '../styles/RunningInstances.css';

function RunningInstances({ instances, onStop }) {
  if (instances.length === 0) {
    return (
      <div className="no-instances">
        실행 중인 환경이 없습니다.
      </div>
    );
  }

  return (
    <div className="instances-list">
      {instances.map(instance => (
        <div key={instance.id} className="instance-item">
          <div className="instance-info">
            <span className="instance-name">{instance.podName}</span>
            <span className="instance-status running">● 실행 중</span>
          </div>
          <div className="instance-actions">
            <a 
              href={instance.accessUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="access-button"
            >
              접속
            </a>
            <button 
              className="stop-button"
              onClick={() => onStop(instance.id)}
            >
              중지
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RunningInstances;