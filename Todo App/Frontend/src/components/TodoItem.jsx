import { TodoItemsContext } from "../store/TodoItemsContext";
import { todoItemToClientModel } from "../utils/ModelUtil";
import Button from "./Button";
import {useContext, useState} from "react";

const TodoItem = ({ id, todoText, todoDate, todoTime, completed }) => {

  const {deleteTodoItem} = useContext(TodoItemsContext);
  const [isComplete, setIsComplete] = useState(completed);

  const formattedDate = new Date(todoDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleComplete = () => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'PATCH',      
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({completed: !isComplete})
    })
    .then(res => res.json())
    .then(updatedItem => {
      console.log('updatedItem', updatedItem);
      const clientUpdatedItem = todoItemToClientModel(updatedItem);
      setIsComplete(clientUpdatedItem.completed);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const deleteHandler = () => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(deletedItem => {
      const clientDeletedItem = todoItemToClientModel(deletedItem);
      deleteTodoItem(clientDeletedItem.id);
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 mb-4">
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 w-full">
            <input
              type="checkbox"
              checked={isComplete}
              onChange={toggleComplete}
              className="w-4 h-4 mt-1 sm:mt-0 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
            />
            <div className={`flex-1 ${isComplete ? 'line-through text-gray-500' : ''}`}>
              <p className="text-gray-800 font-medium break-words">{todoText}</p>
              <p className="text-sm text-gray-500">{formattedDate} at {todoTime}</p>
            </div>
          </div>
          <div className="sm:ml-4">
            <Button btnType="danger" btnText="Delete" handler={deleteHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;