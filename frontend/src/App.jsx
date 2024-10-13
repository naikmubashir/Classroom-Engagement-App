// frontend/src/App.js
import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:8000');
            console.log(response.data);
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Classroom Engagement App</h1>
        </div>
    );
}

export default App;
