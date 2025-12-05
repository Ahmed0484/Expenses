import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Budget } from "../types/budget";

const apiUrl = import.meta.env.VITE_API_URL;
export default function Amount() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState<Budget|null>(null);
  const [error, setError] = useState("");
  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current) {
      fetch(`${apiUrl}/budget`).then(res => {
        return res.json();
      }).then(data => {
        setBudget(data);
      });
      fetched.current = true;
    }
  }, []);
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = Number(formData.get("amount"));
        if (amount <= 0) {
            setError("Budget must be greater than 0");
            return;
        }
        setError("");
    console.log(`form data ${formData.get('amount')}`);
    const url = `${apiUrl}/budget`;
    const method = 'PUT';
    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({
          amount: amount
        })
      });
      if (!response.ok)
        throw new Error('Request failed: ' + response.statusText);
      const data = await response.json();
      console.log(">>>>>>>>>>>"+data.amount);
      setBudget(data);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="mt-3">
      <h3 className="text-2xl">Edit budget</h3>
      <form onSubmit={onSubmit}>
       
        <div className="flex gap-3">
          <input required type="number" step="any" name='amount'
            className="border border-gray-300 rounded-lg p-2 w-1/4"
            defaultValue={budget?.amount}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <button type="submit" className="btn">Update</button> | <Link className="btn" to="/">Home</Link>
      </form>
    </div>
  )
}