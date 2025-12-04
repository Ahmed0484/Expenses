import { useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import type { Expense } from "../types/expense";
import ExpenseForm from "./ExpenseForm";

const apiUrl = import.meta.env.VITE_API_URL;
export default function ExDetail() {
  const [expense, setExpense] = useState<Expense| null>(null);
  const params = useParams();
  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current) {
      fetch(`${apiUrl}/expenses/${params.id}`).then(res => {
        return res.json();
      }).then(data => {
        setExpense(data);
      });
      fetched.current = true;
    }
  }, [params.id]);

  if (!expense) return null;
 

  return (
    <>
      <h2 className="text-2xl">Detail</h2>
      <div><span className="font-bold">ID:</span>{expense.id}</div>
      <div className="space-x-2">
        <span className="font-bold">Name:</span>
        <span className="uppercase">{expense.name}</span>
      </div>
      <div className="space-x-2">
        <span className="font-bold">Price:</span>
        <span className="uppercase">{expense.price}</span>
      </div>
      <div className="flex flex-col gap-2 mt-3 border-t">
       <ExpenseForm expense={expense} setExpense={setExpense}/>
      </div>
    </>
  )
}
