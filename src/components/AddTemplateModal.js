import React, { useState } from 'react';
import '../styles/AddTemplateModal.css';

function AddTemplateModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    image: '',
    port: 8080,
    icon: 'default',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...form,
      envVariables: '{}',
      enabled: true
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) : value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>새 환경 추가</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="예: My Python"
              required
            />
          </div>
          <div className="form-group">
            <label>Docker 이미지</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="예: python:3.11-slim"
              required
            />
          </div>
          <div className="form-group">
            <label>포트</label>
            <input
              type="number"
              name="port"
              value={form.port}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>아이콘</label>
            <select name="icon" value={form.icon} onChange={handleChange}>
              <option value="default">📦 기본</option>
              <option value="vscode">💻 VS Code</option>
              <option value="jupyter">📓 Jupyter</option>
              <option value="jenkins">🔧 Jenkins</option>
              <option value="python">🐍 Python</option>
            </select>
          </div>
          <div className="form-group">
            <label>설명</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="환경에 대한 설명"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit">추가</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTemplateModal;