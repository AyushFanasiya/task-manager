import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { getTasksByEmployeeId } from '../../utils/localStorage';
import TaskCard from '../common/TaskCard';
import './EmployeeTaskTable.css';

const EmployeeTaskTable = ({ employeeStats, onRefreshNeeded }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  const toggleExpand = (employeeId) => {
    if (expandedEmployee === employeeId) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employeeId);
      setSelectedStatus(null);
    }
  };
  
  const renderExpandedTasks = (employeeId) => {
    const tasks = getTasksByEmployeeId(employeeId);
    const filteredTasks = selectedStatus
      ? tasks.filter(task => task.status === selectedStatus)
      : tasks;
      
    if (filteredTasks.length === 0) {
      return (
        <div className="no-tasks-message">
          {selectedStatus 
            ? `No ${selectedStatus} tasks for this employee.` 
            : 'No tasks assigned to this employee yet.'}
        </div>
      );
    }
    
    return (
      <div className="task-cards">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    );
  };
  
  const filteredEmployees = employeeStats.filter(stats => 
    stats.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="employee-task-table">
      <div className="table-header">
        <h2>Employee Task Overview</h2>
        
        <div className="search-container">
          <FiSearch />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>New Tasks</th>
              <th>Active Tasks</th>
              <th>Completed Tasks</th>
              <th>Failed Tasks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((stats) => (
              <tr key={stats.employee.id}>
                <td className="employee-cell">
                  <div className="employee-info">
                    {stats.employee.avatar ? (
                      <img 
                        src={stats.employee.avatar} 
                        alt={stats.employee.name} 
                        className="employee-avatar" 
                      />
                    ) : (
                      <div className="employee-avatar-placeholder">
                        {stats.employee.name.charAt(0)}
                      </div>
                    )}
                    <span>{stats.employee.name}</span>
                  </div>
                </td>
                <td 
                  className={`task-count ${stats.counts.new > 0 ? 'has-tasks' : ''}`}
                  onClick={() => {
                    if (stats.counts.new > 0) {
                      setExpandedEmployee(stats.employee.id);
                      setSelectedStatus('new');
                    }
                  }}
                >
                  {stats.counts.new}
                </td>
                <td 
                  className={`task-count ${stats.counts.active > 0 ? 'has-tasks' : ''}`}
                  onClick={() => {
                    if (stats.counts.active > 0) {
                      setExpandedEmployee(stats.employee.id);
                      setSelectedStatus('active');
                    }
                  }}
                >
                  {stats.counts.active}
                </td>
                <td 
                  className={`task-count ${stats.counts.completed > 0 ? 'has-tasks' : ''}`}
                  onClick={() => {
                    if (stats.counts.completed > 0) {
                      setExpandedEmployee(stats.employee.id);
                      setSelectedStatus('completed');
                    }
                  }}
                >
                  {stats.counts.completed}
                </td>
                <td 
                  className={`task-count ${stats.counts.failed > 0 ? 'has-tasks' : ''}`}
                  onClick={() => {
                    if (stats.counts.failed > 0) {
                      setExpandedEmployee(stats.employee.id);
                      setSelectedStatus('failed');
                    }
                  }}
                >
                  {stats.counts.failed}
                </td>
                <td>
                  <button 
                    className="expand-button"
                    onClick={() => toggleExpand(stats.employee.id)}
                  >
                    {expandedEmployee === stats.employee.id ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {expandedEmployee && (
        <div className="expanded-tasks">
          <div className="task-filter">
            <div className="task-filter-buttons">
              <button 
                className={selectedStatus === null ? 'active' : ''}
                onClick={() => setSelectedStatus(null)}
              >
                All Tasks
              </button>
              <button 
                className={selectedStatus === 'new' ? 'active' : ''}
                onClick={() => setSelectedStatus('new')}
              >
                New
              </button>
              <button 
                className={selectedStatus === 'active' ? 'active' : ''}
                onClick={() => setSelectedStatus('active')}
              >
                Active
              </button>
              <button 
                className={selectedStatus === 'completed' ? 'active' : ''}
                onClick={() => setSelectedStatus('completed')}
              >
                Completed
              </button>
              <button 
                className={selectedStatus === 'failed' ? 'active' : ''}
                onClick={() => setSelectedStatus('failed')}
              >
                Failed
              </button>
            </div>
          </div>
          
          {renderExpandedTasks(expandedEmployee)}
        </div>
      )}
    </div>
  );
};

export default EmployeeTaskTable;