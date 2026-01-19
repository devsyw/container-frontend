import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContainerCard from '../components/ContainerCard';
import RunningInstances from '../components/RunningInstances';
import AddTemplateModal from '../components/AddTemplateModal';
import '../styles/Dashboard.css';

const API_BASE = 'http://localhost:8080/api/containers';

function Dashboard() {
  const [templates, setTemplates] = useState([]);
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleLaunch = async (templateId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/instances?templateId=${templateId}&userId=default-user`
      );
      setInstances([...instances, response.data]);
      
      if (response.data.accessUrl) {
        window.open(response.data.accessUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to launch container:', error);
      alert('컨테이너 실행에 실패했습니다.');
    }
  };

  const handleStop = async (instanceId) => {
    try {
      await axios.delete(`${API_BASE}/instances/${instanceId}`);
      fetchData();
    } catch (error) {
      console.error('Failed to stop container:', error);
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
            />
          ))}
        </div>
      </section>

      <section className="instances-section">
        <h2>실행 중인 환경</h2>
        <RunningInstances 
          instances={instances.filter(i => i.status === 'RUNNING')}
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