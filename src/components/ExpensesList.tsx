import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Expense } from "../types/expense";
const apiUrl = import.meta.env.VITE_API_URL;
export default function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [total, setTotal] = useState<number>(0);
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
    const sum:number=expenses.reduce((acc,ex)=>acc+Number(ex.price),0);
    setTotal(sum);
  }, [expenses]);

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

  return (
    <>
      <h3 className="text-xl mb-2">Total : {total}</h3>
      <Link to='/expenses/create' className="btn">Create expense</Link>
      <ul className="flex flex-col gap-2 my-3">
        {expenses.map(expense => (
        
          <Link to={`/expenses/${expense.id}`} key={expense.id} className="flex cursor-pointer">
            <span className="bg-slate-700 text-white rounded-l p-2">{expense.id}</span>
            <div className="p-2 bg-slate-300 rounded-r w-full flex justify-between">
              <span>{expense.name}</span>
              <span>{expense.price}</span>
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