// ItemList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap
import TaskTable from './TaskTable';

function ItemList() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [time, setTime] = useState('');
    const [decoration, setDecoration] = useState(false);
    const [catering, setCatering] = useState(false);

    // Fetch location pricing data
    useEffect(() => {
        axios.get('http://localhost:5000/api/location_pricing')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                setError('Failed to fetch data');
                console.error(error);
            });
    }, []);

    // Fetch events data
    useEffect(() => {
        axios.get('http://localhost:5000/api/events')
            .then(response => setTasks(response.data))
            .catch(error => {
                setError('Failed to fetch events');
                console.error(error);
            });
    }, []);

    // Function to add a new task/event
    function addTask() {
        // Simple validation
        if (!text || !date || !time || !location) {
            setError('Please fill in all fields');
            return;
        }

        const newTask = { text, date, time, location, decoration, catering };

        axios.post('http://localhost:5000/api/events', newTask)
            .then(response => {
                setTasks([...tasks, response.data]);
                setText('');
                setDate('');
                setLocation('');
                setTime('');
                setDecoration(false);
                setCatering(false);
                setError(null); // Clear any previous error
            })
            .catch(error => {
                setError('Failed to add task');
                console.error(error);
            });
    }

    // Function to delete a task/event
    function deleteTask(id) {
        axios.delete(`http://localhost:5000/api/events/${id}`)
            .then(() => {
                setTasks(tasks.filter((task) => task._id !== id));
            })
            .catch(error => {
                setError('Failed to delete task');
                console.error(error);
            });
    }

    // Function to get the status of a task/event
    function getStatus(date, time) {
        const taskDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        return now > taskDateTime ? 'Completed' : 'Pending';
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Location Pricing</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            {items.length > 0 ? (
                <div className="table-responsive">
                    {/* Location Pricing Table */}
                    <table className="table table-bordered table-hover table-striped mx-auto" style={{ maxWidth: '600px' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>Location</th>
                                <th>Base Price</th>
                                <th>Decoration Price</th>
                                <th>Catering Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item._id}>
                                    <td>{item.location}</td>
                                    <td>${item.basePrice}</td>
                                    <td>${item.decorationPrice}</td>
                                    <td>${item.cateringPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Task/Event Management Section */}
                    <div className="todo-list container mt-4">
                        <div className="add-task-form mb-4">
                            <input
                                type="text"
                                placeholder="Task"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="form-control mb-2"
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="form-control mb-2"
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="form-control mb-2"
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="form-control mb-2"
                            />
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    checked={decoration}
                                    onChange={(e) => setDecoration(e.target.checked)}
                                    className="form-check-input"
                                    id="decorationCheckbox"
                                />
                                <label className="form-check-label" htmlFor="decorationCheckbox">
                                    Decoration
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    checked={catering}
                                    onChange={(e) => setCatering(e.target.checked)}
                                    className="form-check-input"
                                    id="cateringCheckbox"
                                />
                                <label className="form-check-label" htmlFor="cateringCheckbox">
                                    Catering
                                </label>
                            </div>
                            <button onClick={addTask} className="btn btn-primary mt-2">
                                Add Task
                            </button>
                        </div>
                        <TaskTable tasks={tasks} deleteTask={deleteTask} getStatus={getStatus} />
                    </div>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
}

export default ItemList;
