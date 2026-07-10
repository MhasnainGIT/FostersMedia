import { RouterProvider } from "react-router";
import { router } from "./routes";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "./components/ui/sonner";
import { DataProvider } from "./context/DataContext";

export default function App() {
  return (
    <div className="dark">
      <QueryProvider>
        <DataProvider>
          <RouterProvider router={router} />
          <Toaster closeButton position="top-right" theme="dark" />
        </DataProvider>
      </QueryProvider>
    </div>
  );
}
