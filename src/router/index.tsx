import { createBrowserRouter } from "react-router-dom"
import Home from "../components/home/Home"
import About from "../components/about/About"

export default createBrowserRouter([
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: 'main',
        element: <Home.Main />
      },
      {
        path: 'about',
        element: <Home.About />
      },
      {
        path: 'store',
        element: <Home.Store />
      },
    ]
  },
  {
    path: '/about',
    element: <About />
  }
])