import React, { useState, useEffect } from "react";

export const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([])
    const [hovered, setHovered] = useState(null);
    const host = 'https://playground.4geeks.com/todo'
    const randomUserId = Math.floor(Math.random() * 1000) + 1;
    const [username, setUsername] = useState('')
    const [alertVisible, setAlertVisible] = useState(false);


    // este agrega un todo al usuario que ingreses arriba
    const addTodo = async () => {
        if (!username) {
            setAlertVisible(true);
            return;
        }

        await getTodos(username);

        const dataToSend = {
            label: todo,
            is_done: false,
        }
        const uri = `${host}/todos/${username}`;
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
        getTodos(username);
        // setTodos([...todos, todo]);

    }


    //elimina todo del usuario en el que estes
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

        getTodos(username);

        // setTodos(todos.filter((element, i) => i !== index));
    }

    //trae los todos del usuario
    const getTodos = async (username) => {
        const uri = `${host}/users/${username}`;
        const options = {
            method: 'GET',
        }

        const response = await fetch(uri, options);

        if (!response.ok) {
            console.log('Error:', response.status, response.statusText);
            if (response.status === 404) {
                createUser(username);
                return;
            }
        }
        const data = await response.json();

        setTodos(data.todos)

    }

    // crea o cambia entre usuarios
    const createUser = async (username) => {
        const dataToSend = {
            name: username,
            id: randomUserId,
        }
        await getTodos(username);
        const uri = `${host}/users/${username}`;
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

        getTodos(username);
        setAlertVisible(false);
    }

    // useEffect(() => {
    //     getTodos();
    // }, []);

    return (
        <div className="container">
            <h1 className="text-light m-3" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}> Todo List</h1>
            <div className="alert alert-danger" role="alert" style={{ visibility: alertVisible ? 'visible' : 'hidden' }}>
                User doesn't exist! You need to enter a username(can be new or already existing)
            </div>
            <div className="todo-list">
                <ul className="list-group" id="ul" style={{ listStyleType: 'none' }}>
                    <li className="list-group-item">
                        <form>
                            <input
                                type="text"
                                className="form-control m-2"
                                id="inputUsername"
                                placeholder="Enter Username"
                                value={username}
                                onChange={event => setUsername(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        getTodos(username);
                                    }
                                }}
                                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}
                            />
                            <input
                                type="text"
                                className="form-control m-2"
                                id="inputTodo"
                                placeholder={todos && todos.length !== 0 ? "Write to add another one" : "No tasks, add a task!"}
                                value={todo}
                                onChange={event => setTodo(event.target.value)}
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        addTodo();
                                    }
                                }}
                                style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}
                            />
                        </form>
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

