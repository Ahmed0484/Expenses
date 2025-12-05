import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Expense } from "../types/expense";
import type { Budget } from "../types/budget";
const apiUrl = import.meta.env.VITE_API_URL;
export default function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [budget, setBudget] = useState<Budget | null>(null);
  const navigate = useNavigate();
  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current) {
      fetch(`${apiUrl}/expenses`).then(res => {
        return res.json();
      }).then(data => {
        setExpenses(data);
      });
      fetched.current = true;
    }
  }, []);
  useEffect(() => {
    const sum: number = expenses.reduce((acc, ex) => acc + Number(ex.price), 0);
    setTotal(sum);
  }, [expenses]);

  
  useEffect(() => {
    fetch(`${apiUrl}/budget`).then(res => {
      return res.json();
    }).then(data => {
      setBudget(data);
    });

  }, []);
  async function deleteExpense(expense: Expense) {
    try {
      const response = await fetch(`${apiUrl}/expenses/${expense.id}`, {
        method: 'DELETE'
      });
      if (!response.ok)
        throw new Error('Request failed: ' + response.statusText);
      setExpenses(prevExpenses => prevExpenses.filter(ex => ex.id !== expense.id));
    } catch (error) {
      console.log(error);
    }
  }
  //Clear expenses
  async function clearExpenses() {
    try {
        const response = await fetch('http://localhost:3000/expenses');
        const expenses:Expense[] = await response.json();
        const expenseIds = expenses.map(expense => expense.id);

        for (const id of expenseIds) {
            await fetch(`http://localhost:3000/expenses/${id}`, {
                method: 'DELETE'
            });
            console.log(`Deleted expense with ID: ${id}`);
        }
        console.log('All expenses deleted successfully.');
        navigate("/");
    } catch (error) {
        console.error('Error deleting expenses:', error);
    }
}
  return (
    <>
      <h3 className="text-xl mb-2">
        <span className="font-bold mx-1 text-blue-700">Budget :{budget?.amount}</span> -
        <span className="font-bold mx-1 text-amber-600">Total : {total}</span> =
        <span className="font-bold mx-1 text-green-500">Rest: {budget && budget.amount - total}</span>
      </h3>
      <Link to='/expenses/create' className="btn">Create expense</Link> 
      <button onClick={clearExpenses} className="btn mx-3">Delete All Expenses</button>
      <ul className="flex flex-col gap-2 my-3">
        {expenses.sort((a, b) => b.id - a.id).map(expense => (

          <Link to={`/expenses/${expense.id}`} key={expense.id} className="flex cursor-pointer">
            <div className="p-2 bg-slate-300 rounded-r w-full flex justify-between">
              
              <span>{expense.name}</span>
              <span>{expense.price} £</span>
              <span>{`${new Date(expense.date).getDate()}/${new Date(expense.date).getMonth() + 1}/${new Date(expense.date).getFullYear()}`}</span>
              <span onClick={(e) => {
                e.preventDefault();
                deleteExpense(expense);
              }}
                className="bg-white px-1 cursor-pointer">X</span>
            </div>
          </Link>
        ))}
      </ul>


    </>
  )
}