import { useState, useEffect } from 'react';
import supabase from './supabase-client';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('TodoList')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log('Error fetching todos', error);
    } else {
      setTodoList(data);
    }
  };

  // Add todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from('TodoList')
      .insert([{ name: newTodo, isCompleted: false }])
      .select()
      .single();

    if (error) {
      console.log('Error adding todo', error);
    } else {
      setTodoList((prev) => [...prev, data]);
      setNewTodo('');
    }
  };

  // Step 2: Toggle complete / undo
  const toggleComplete = async (todo) => {
    const { data, error } = await supabase
      .from('TodoList')
      .update({ isCompleted: !todo.isCompleted })
      .eq('id', todo.id)
      .select()
      .single();

    if (error) {
      console.log('Error toggling todo', error);
    } else {
      setTodoList((prev) =>
        prev.map((item) =>
          item.id === todo.id ? data : item
        )
      );
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('TodoList')
      .delete()
      .eq('id', id);

    if (error) {
      console.log('Error deleting todo', error);
    } else {
      setTodoList((prev) =>
        prev.filter((todo) => todo.id !== id)
      );
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Todo List
        </h1>

        {/* Add Todo */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New Todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-2">
          {todoList.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded"
            >
              <span
                className={`flex-1 ${
                  todo.isCompleted
                    ? 'line-through text-gray-400'
                    : ''
                }`}
              >
                {todo.name}
              </span>

              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`px-3 py-1 rounded text-sm text-white ${
                    todo.isCompleted
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {todo.isCompleted ? 'Undo' : 'Done'}
                </button>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
