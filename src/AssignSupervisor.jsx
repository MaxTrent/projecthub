import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AssignSupervisor() {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Users fetch failed - Status: ${response.status}, Response: ${text}`);
        }
        const data = await response.json();
        setStudents(data.filter(user => user.role === 'student'));
        setSupervisors(data.filter(user => user.role === 'supervisor'));
      } catch (err) {
        console.error('Error fetching users:', err);
        setMessage(err.message);
        navigate('/admin-dashboard');
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleAssignSupervisor = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedSupervisor) {
      setMessage('Please select both a student and a supervisor.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/admin/assign-supervisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: Number(selectedStudent),
          supervisorId: Number(selectedSupervisor),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Supervisor assigned successfully!');
        setSelectedStudent('');
        setSelectedSupervisor('');
      } else {
        setMessage(`Assignment failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error assigning supervisor:', err);
      setMessage('Error assigning supervisor.');
    }
  };

  return (
    <div className="assign-supervisor-page">
      <main className="assign-supervisor-content">
        <div className="assign-supervisor-card">
          <h2>Assign Supervisor to Student</h2>
          <form onSubmit={handleAssignSupervisor}>
            <div className="input-group">
              <label htmlFor="student">Student</label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="supervisor">Supervisor</label>
              <select
                id="supervisor"
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
              >
                <option value="">Select Supervisor</option>
                {supervisors.map(supervisor => (
                  <option key={supervisor.id} value={supervisor.id}>
                    {supervisor.fullName} ({supervisor.email})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="assign-button">
              Assign
            </button>
            {message && (
              <p className="message" style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
                {message}
              </p>
            )}
          </form>
          <div className="back-link">
            <Link to="/admin-dashboard">Back to Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AssignSupervisor;