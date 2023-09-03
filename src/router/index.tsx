import { createBrowserRouter } from "react-router-dom"
import Home from "../components/home/Home"
import About from "../components/about/About"

export default createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  }
])