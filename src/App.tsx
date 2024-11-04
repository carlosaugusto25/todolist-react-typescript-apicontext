import { useEffect, useState } from "react";
import './App.css'
import { useTheme } from "./Context/Theme";

interface TodoListProps {
  id: string;
  text: string;
  completed: boolean;
}

function App() {

  const {theme, toggleTheme} = useTheme();

  const [todo, setTodo] = useState<TodoListProps[]>([])
  const [newTodo, setNewTodo] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const adicionarTarefa = ():void => {
    if(newTodo !== '') {
      const newId = crypto.randomUUID()
      const newTodoItem: TodoListProps = {
        id: newId,
        text: newTodo,
        completed: false
      }
      setTodo([...todo, newTodoItem])
      setNewTodo('')
    }
  }

  const taskCompleted = (id:string):void => {
    const updatedTodo = todo.map((item) => {
      if(item.id === id) {
        return {...item, completed: !item.completed}
      }
      return item
    })
    setTodo(updatedTodo)
  }

  const removerTarefa = (id:string):void => {
    const filteredTodo = todo.filter((item) => item.id !== id)
    setTodo(filteredTodo)
  }

  const tasksCompleted = ():TodoListProps[] => {
    return todo.filter((item) => item.completed)
  }

  useEffect(()=>{
    if(isLoaded){
      localStorage.setItem('todo', JSON.stringify(todo))
    }
  },[todo, isLoaded])

  useEffect(()=>{
    const storedTodo = localStorage.getItem('todo')
    if(storedTodo){
      setTodo(JSON.parse(storedTodo))
    }
    setIsLoaded(true)
  },[])

  return (
    <div className={`app ${theme}`}>
      <div className={`container ${theme}`}>
        <h1>Lista de Tarefas - {tasksCompleted().length} / {todo?.length}</h1>
        <div className="input-container">
          <input type="text" value={newTodo} name="" id="" onChange={(e) => setNewTodo(e.target.value)} />
          <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
        </div>
        <ol>
          {
            todo.map((item) => (
              <li key={item.id}>
                <input type="checkbox" checked={item.completed} onChange={()=>taskCompleted(item.id)} name="" id="" />
                <span style={{textDecoration: item.completed ? 'line-through' : 'none'}}>{item.text}</span>
                <button onClick={() => removerTarefa(item.id)}>Remover</button>
              </li>
            ))
          }
        </ol>
        <button onClick={toggleTheme}>
          Alterar tema para {theme === 'light' ? 'Claro' : 'Escuro'}
        </button>
      </div>
    </div>
  )
}

export default App
