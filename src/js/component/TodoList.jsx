import React, { useState, useEffect } from "react";

export const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([])
    const [hovered, setHovered] = useState(null);
    const host = 'https://playground.4geeks.com/todo'


    const addTodo = async () => {
        const dataToSend = {
            label: todo,
            is_done: false,
        }
        const uri = `${host}/todos/monisolines`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend),
        }

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return
        }
        setTodo('');
        getTodos();
        // setTodos([...todos, todo]);

    }

    const eliminarLi = async (id) => {
        const uri = `${host}/todos/${id}`;
        const options = {
            method: 'DELETE',
        }

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            return
        }

        getTodos();

        // setTodos(todos.filter((element, i) => i !== index));
    }

    const getTodos = async () => {
        const uri = `${host}/users/monisoline`;
        const options = {
            method: 'GET',
        }

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            if (response.status === 404) {
                // podriamos crear el usuario, llamando a funcion ej: createUser
            }
            return
        }

        const data = await response.json();
        console.log(data);

        setTodos(data.todos)

    }



    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="container">
            <h1 className="text-light m-3" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}> Todo List</h1>
            <div className="todo-list">
                <ul className="list-group" id="ul" style={{ listStyleType: 'none' }}>
                    <li className="list-group-item">
                        <input
                            type="text"
                            className="form-control"
                            id="inputTodo"
                            placeholder={todos.length !== 0 ? "Write to add another one" : "No tasks, add a task!"}
                            value={todo}
                            onChange={event => setTodo(event.target.value)}
                            onKeyDown={event => { if (event.key === 'Enter') { addTodo(); } }}
                            style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}
                        />
                    </li>
                    {todos.map((element, index) => (
                        <li
                            className="list-group-item"
                            key={element.id}
                            onMouseOver={() => setHovered(index)}
                            onMouseOut={() => setHovered(null)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}
                        >
                            <span> {element.label} </span>
                            {hovered === index && (
                                <i
                                    className="far fa-trash-alt d-flex justify-content-end text-end align-content-end"
                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                    onClick={() => eliminarLi(element.id)}
                                ></i>
                            )}
                        </li>
                    ))}
                    <li
                        className="list-group-item"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}
                    >
                        {todos.length} items left
                    </li>
                </ul>
            </div>
        </div>
    )
}

