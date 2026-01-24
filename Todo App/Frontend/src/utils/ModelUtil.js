export const todoItemToClientModel = (serverItem) => {
    return {
      id: serverItem._id,
      todoText: serverItem.task,
      todoDate: serverItem.date,
      todoTime: serverItem.time || '',
      completed: serverItem.completed
    }
  }