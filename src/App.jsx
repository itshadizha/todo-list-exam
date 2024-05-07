import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

const url = "https://6af8aede42622af5.mokky.dev/todos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState("");
  const [editTodo, setEditTodo] = useState("");
  const [edit, setEdit] = useState(null);

  const getTodos = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const postTodos = async (e) => {
    e.preventDefault();
    if (!value.trim()) {
      return;
    }
    const newData = {
      text: value,
      completed: false,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setValue(""); // Clear the input
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const patchTodos = async (id, updatedData) => {
    try {
      await fetch(`${url}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      getTodos();
      if (edit === id) setEdit(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id, text) => {
    setEdit(id);
    setEditTodo(text);
  };

  const handleToggleComplete = async (id, completed) => {
    const updatedData = {
      completed: !completed,
    };
    patchTodos(id, updatedData);
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <Wrapper>
        <StyledForm onSubmit={postTodos}>
          <StyledInput
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit">Add Task</Button>
        </StyledForm>
        {todos.map((item) => (
          <TaskItem key={item.id} completed={item.completed}>
            {edit === item.id ? (
              <StyledInput
                type="text"
                value={editTodo}
                onChange={(e) => setEditTodo(e.target.value)}
              />
            ) : (
              <h4>{item.text}</h4>
            )}
            {edit === item.id ? (
              <>
                <Button onClick={() => patchTodos(item.id, { text: editTodo })}>
                  Save
                </Button>
                <Button onClick={() => handleEdit(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <Button onClick={() => handleEdit(item.id, item.text)}>
                  Edit
                </Button>
                <Button onClick={() => deleteTodo(item.id)}>
                  {edit === item.id ? "Cancel" : "Delete"}
                </Button>
                {edit === item.id ? null : (
                  <Button
                    onClick={() =>
                      handleToggleComplete(item.id, item.completed)
                    }
                  >
                    {item.completed ? "Uncomplete" : "Complete"}
                  </Button>
                )}
              </>
            )}
          </TaskItem>
        ))}
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  width: 600px;
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  padding: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  height: 35px;
  width: 500px;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const TaskItem = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;

  h4 {
    flex: 1;
    margin: 0;
    text-decoration: ${(props) => (props.completed ? "line-through" : "none")};
  }

  button {
    margin-left: auto;
    margin-right: 5px;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  border: none;
  background-color: purple;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: purple;
  }
`;

export default App;
