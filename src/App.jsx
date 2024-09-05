import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home'

export function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        }
    ])

    return (
        <RouterProvider router={router} />
    )
}
