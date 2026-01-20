import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerCard from '../components/ContainerCard';
import RunningInstances from '../components/RunningInstances';
import AddTemplateModal from '../components/AddTemplateModal';
import '../styles/Dashboard.css';

const API_BASE = process.env.REACT_APP_API_BASE || '/api/containers';

function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launchingId, setLaunchingId] = useState(null); // 실행 중인 템플릿 ID
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = async () => {
    try {
      const [templatesRes, instancesRes] = await Promise.all([
        axios.get(`${API_BASE}/templates`),
        axios.get(`${API_BASE}/instances?userId=default-user`)
      ]);
      setTemplates(templatesRes.data);
      setInstances(instancesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pod Ready 상태 폴링
  const waitForReady = async (instanceId, accessUrl, maxRetries = 30) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.get(`${API_BASE}/instances/${instanceId}/status`);
        if (response.data.status === 'READY') {
          return true;
        }
      } catch (error) {
        console.log(`Waiting for pod... (${i + 1}/${maxRetries})`);
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
    }
    return false;
  };

  const handleLaunch = async (templateId) => {
    setLaunchingId(templateId);
    try {
      const response = await axios.post(
        `${API_BASE}/instances?templateId=${templateId}&userId=default-user`
      );
      
      const newInstance = response.data;
      setInstances([...instances, newInstance]);
      
      // Pod Ready 대기
      if (newInstance.accessUrl && newInstance.id) {
        const isReady = await waitForReady(newInstance.id, newInstance.accessUrl);
        
        if (isReady) {
          window.open(newInstance.accessUrl, '_blank');
        } else {
          alert('컨테이너가 아직 준비 중입니다. 잠시 후 다시 시도해주세요.');
        }
      }
      
      // 인스턴스 목록 새로고침
      fetchData();
    } catch (error) {
      console.error('Failed to launch container:', error);
      alert('컨테이너 실행에 실패했습니다.');
    } finally {
      setLaunchingId(null);
    }
  };

  const handleStop = async (instanceId) => {
    try {
      await axios.delete(`${API_BASE}/instances/${instanceId}`);
      // 로컬 상태에서 즉시 제거
      setInstances(instances.filter(i => i.id !== instanceId));
    } catch (error) {
      console.error('Failed to stop container:', error);
      alert('컨테이너 중지에 실패했습니다.');
    }
  };

  const handleAddTemplate = async (template) => {
    try {
      const response = await axios.post(`${API_BASE}/templates`, template);
      setTemplates([...templates, response.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add template:', error);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🐳 Container Platform</h1>
        <p>개발 환경을 클릭 한 번으로 실행하세요</p>
      </header>

      <section className="templates-section">
        <div className="section-header">
          <h2>사용 가능한 환경</h2>
          <button 
            className="add-button"
            onClick={() => setShowAddModal(true)}
          >
            + 환경 추가
          </button>
        </div>
        
        <div className="card-grid">
          {templates.map(template => (
            <ContainerCard
              key={template.id}
              template={template}
              onLaunch={handleLaunch}
              isLaunching={launchingId === template.id}
            />
          ))}
        </div>
      </section>

      <section className="instances-section">
        <h2>실행 중인 환경</h2>
        <RunningInstances 
          instances={instances.filter(i => i.status === 'RUNNING' || i.status === 'PENDING')}
          onStop={handleStop}
        />
      </section>

      {showAddModal && (
        <AddTemplateModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddTemplate}
        />
      )}
    </div>
  );
}

export default Dashboard;