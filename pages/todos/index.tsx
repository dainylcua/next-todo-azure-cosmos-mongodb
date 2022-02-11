import { Todo } from "../../utils/types"
import { useRouter } from "next/router"
import { useState } from "react"

interface ShowProps {
  todo: Todo
  url: string
}

function Show(props: ShowProps) {
  const router = useRouter()
  const [todo, setTodo] = useState<Todo>(props.todo)
  const handleComplete = async () => {
    // If todo is not completed
    if(!todo.completed) {
      const newTodo: Todo = { ...todo, completed: true }
      await fetch(`${props.url}/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/JSON"
        },
        body: JSON.stringify(newTodo)
      })
      setTodo(newTodo)
    }
  }

  const handleDelete = async () => {
    await fetch(`${props.url}/${todo._id}`, {
      method: "DELETE"
    })
    router.push("/")
  }

  return (
    <div>
      <h1>{todo.item}</h1>
      <h2>{todo.completed ? "completed" : "incomplete"}</h2>
      <button onClick={handleComplete}>Complete</button>
      <button onClick={handleDelete}>Delete</button>
      <button
        onClick={() => {
          router.push("/")
        }}
      >
        Go Back
      </button>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // fetch the todo, the param was received via context.query.id
  const res = await fetch(process.env.API_URL + "/" + context.query.id)
  const todo = await res.json()

  //return the serverSideProps the todo and the url from out env variables for frontend api calls
  return { props: { todo, url: process.env.API_URL } }
}

// export component
export default Show