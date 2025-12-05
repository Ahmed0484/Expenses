import { Link, Outlet } from "react-router-dom";

function App() {

  return (
    <>
      <h1 className="text-4xl text-slate-700 font-bold text-center">Expenses</h1>
      <h2 className="text-2xl text-blue-700 font-bold mt-2 text-center"><Link to="/budget/edit">[Edit budget]</Link></h2>
      <div className="mt-5 max-w-5xl mx-auto flex justify-between gap-6">
        <div className="flex-1"><Outlet /></div>
      </div>
    </>
  )
}

export default App
