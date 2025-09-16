import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Documents from "./pages/Documents";
import Authorization from "./pages/Authorization";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "authorization",
        element: <Authorization />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
