import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Expense } from "../types/expense";

type Props = {
    expense?: Expense;
    setExpense?: (expense: Expense) => void;
}
const apiUrl = import.meta.env.VITE_API_URL;
export default function ExpenseForm({ expense, setExpense }: Props) {
    const navigate = useNavigate();
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const url = expense ? `${apiUrl}/expenses/${expense.id}` : `${apiUrl}/expenses`;
        const method = expense ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify({
                    name: formData.get('name'),
                    price: Number(formData.get('price')),
                    date: new Date(formData.get('date') as string)
                })
            });
            if (!response.ok)
                throw new Error('Request failed: ' + response.statusText);
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expense && setExpense ?
                setExpense(data)
                : navigate('/expenses');
            navigate('/expenses');
        } catch (error) {
            console.log(error);
        }
    }
    const toDateInputValue = (date: Date | string | number | null | undefined): string => {
        if (!date) return '';               // empty field if nothing
        const d = new Date(date);           // works for Date, ISO string, timestamp
        if (Number.isNaN(d.getTime())) return '';
        return d.toISOString().split('T')[0]; // "2025-04-01"
    };
    return (
        <div className="mt-3">
            <h3 className="text-2xl">
                {expense ? 'Edit expense' : 'Create expense'}
            </h3>
            <form onSubmit={onSubmit}>
                <label>Name</label>
                <div className="flex gap-3">
                    <input type="text" name='name' placeholder="name"
                        className="border border-gray-300 rounded-lg p-2 w-1/4"
                        defaultValue={expense?.name || ''}
                    />
                </div>
                <div className="flex gap-3">
                    <input type="number" name='price' placeholder="price"
                        className="border border-gray-300 rounded-lg p-2 w-1/4"
                        defaultValue={expense?.price || 0}
                    />
                </div>
                <div className="flex gap-3">
                    <input type="date" name='date'
                        className="border border-gray-300 rounded-lg p-2 w-1/4"
                        defaultValue={toDateInputValue(expense?.date)|| toDateInputValue(new Date())}
                    />
                </div>
                <button type="submit" className="btn">
                    {expense ? 'Update' : 'Create'}
                </button> | <Link className="btn" to="/">Home</Link>
            </form>
        </div>
    )
}