// TaskTable.js
import React from 'react';
import './TaskTable.css'; // Assuming you have custom CSS

function TaskTable({ tasks, deleteTask, getStatus }) {
    return (
        <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped mx-auto" style={{ maxWidth: '1000px' }}>
                <thead className="thead-dark">
                    <tr>
                        <th>Task</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Decoration</th>
                        <th>Catering</th>
                        <th>Budget</th> {/* New Budget Column */}
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id}>
                            <td>{task.text}</td>
                            <td>{task.date}</td>
                            <td>{task.time}</td>
                            <td>{task.location}</td>
                            <td>{task.decoration ? 'Yes' : 'No'}</td>
                            <td>{task.catering ? 'Yes' : 'No'}</td>
                            <td>${task.budget}</td> {/* Display Budget */}
                            <td>{getStatus(task.date, task.time)}</td>
                            <td>
                                <button onClick={() => deleteTask(task._id)} className="btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TaskTable;
