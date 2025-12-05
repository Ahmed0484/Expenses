import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ExpensesList from './components/ExpensesList.tsx';
import ExDetail from './components/ExDetail.tsx';
import ExpenseForm from './components/ExpenseForm.tsx';
import Amount from './components/Amount.tsx';
const router = createBrowserRouter([{
  path:'/',
  element:<App />,
  children:[
    {index:true,element:<Navigate replace to='/expenses'/>},
    {path:'/expenses',element:<ExpensesList/>},
    {path:'/expenses/:id',element:<ExDetail/>},
    {path:'/expenses/create',element:<ExpenseForm/>},
    {path:'/budget/edit',element:<Amount/>}
  ]
}]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
