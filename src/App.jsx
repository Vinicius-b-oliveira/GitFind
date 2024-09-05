import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home'
import { UserDetails } from './pages/userDetails'

export function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/user/:userName",
            element: <UserDetails />
        },
    ])

    return (
        <RouterProvider router={router} />
    )
}
