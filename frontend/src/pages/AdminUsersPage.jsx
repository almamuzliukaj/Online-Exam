import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importMode, setImportMode] = useState('single');

  const [formData, setFormData] = useState({
    email: '', fullName: '', role: 'Student', password: '', isActive: true
  });

  const [bulkData, setBulkData] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setUsers([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('/api/users', formData);
      setSuccess('User created successfully!');
      setFormData({ email: '', fullName: '', role: 'Student', password: '', isActive: true });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user.");
    } finally { setLoading(false); }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Procesojmë tekstin nga Excel/CSV
    const lines = bulkData.split('\n').filter(line => line.trim() !== '');
    const usersToImport = lines.map(line => {
      const parts = line.split(/[,;\t]/).map(item => item.trim()); // Ndajmë me presje, pikëpresje ose tab
      return {
        email: parts[0],
        fullName: parts[1],
        password: parts[2] || 'Student123!', // Password default nëse mungon
        role: 'Student',
        isActive: true
      };
    });

    try {
      // Ky është endpoint-i që do të krijojë Alma
      await axios.post('/api/users/bulk', usersToImport); 
      setSuccess(`${usersToImport.length} students imported successfully!`);
      setBulkData('');
      fetchUsers();
    } catch (err) {
      setError("Bulk import failed. Ensure format is: email, full name, password");
    } finally { setLoading(false); }
  };

  // --- STILE PROFESIONALE ---
  const styles = {
    container: { padding: '40px', maxWidth: '1100px', margin: '0 auto', fontFamily: '"Inter", sans-serif' },
    card: { background: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '30px', marginBottom: '30px', border: '1px solid #f0f0f0' },
    tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
    tabBtn: (active) => ({
      padding: '12px 25px', cursor: 'pointer', border: 'none', 
      background: active ? '#3182ce' : '#f7fafc', color: active ? '#fff' : '#4a5568',
      borderRadius: '10px', fontWeight: '700', transition: '0.3s', boxShadow: active ? '0 4px 12px rgba(49,130,206,0.3)' : 'none'
    }),
    textarea: { width: '100%', height: '180px', padding: '15px', borderRadius: '10px', border: '2px solid #edf2f7', marginBottom: '15px', fontSize: '14px', outline: 'none', backgroundColor: '#fdfdfd' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px', fontSize: '15px' },
    button: (color) => ({ width: '100%', padding: '14px', background: color, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }),
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { textAlign: 'left', padding: '15px', color: '#a0aec0', fontSize: '12px', textTransform: 'uppercase', borderBottom: '2px solid #f7fafc' },
    td: { padding: '15px', borderBottom: '1px solid #f7fafc', fontSize: '14px', color: '#2d3748' }
  };

  return (
    <div style={styles.container}>
      <header style={{ marginBottom: '40px', textAlign: 'left' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', margin: 0 }}>User Administration</h1>
        <p style={{ color: '#a0aec0', marginTop: '5px' }}>Add users manually or import them in bulk from Excel</p>
      </header>

      <div style={styles.tabContainer}>
        <button style={styles.tabBtn(importMode === 'single')} onClick={() => setImportMode('single')}>Individual Registration</button>
        <button style={styles.tabBtn(importMode === 'bulk')} onClick={() => setImportMode('bulk')}>Bulk Import (Excel/CSV)</button>
      </div>

      {success && <div style={{ background: '#38a169', color: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>✓ {success}</div>}
      {error && <div style={{ background: '#e53e3e', color: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>✕ {error}</div>}

      <div style={styles.card}>
        {importMode === 'single' ? (
          <form onSubmit={handleSingleSubmit}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Register New Staff/Student</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <input style={styles.input} type="text" placeholder="Full Name" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <input style={styles.input} type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <select style={styles.input} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
                <option value="Admin">Admin</option>
              </select>
              <input style={styles.input} type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <button style={styles.button('#3182ce')} type="submit" disabled={loading}>{loading ? 'Saving...' : 'CREATE ACCOUNT'}</button>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit}>
            <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>Fast Import from Excel</h2>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              Copy columns from Excel and paste here. Format: <b>Email, Full Name, Password</b>
            </p>
            <textarea 
              style={styles.textarea} 
              placeholder="student1@uni.edu, Albiona Krasniqi, Pass123&#10;student2@uni.edu, Filan Fisteku, Pass456"
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
            />
            <button style={styles.button('#38a169')} type="submit" disabled={loading}>
              {loading ? 'Processing List...' : 'IMPORT ALL STUDENTS'}
            </button>
          </form>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Current System Users</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.fullName}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}><span style={{ color: '#3182ce', fontWeight: '700' }}>{u.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;