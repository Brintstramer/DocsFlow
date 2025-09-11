import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Documents from "./pages/Documents";
import Authorization from "./pages/Authorization";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/http";
import DocumentEditor from "./components/DocumentEditor/DocumentEditor";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
        path: "documents/:documentId/versions",
        element: <DocumentEditor />,
      },
      {
        path: "authorization",
        element: <Authorization />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
