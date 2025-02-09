import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { TimerProvider } from "./context/TimerContext";
import TimersView from "./views/TimersView";
import AddTimer from "./views/AddTimer";
import HistoryView from './views/HistoryView';
import { ErrorPage } from "./views/ErrorPageView";
import { Layout } from "./components/layout/layout";
import {
  ThemeProvider
} from "styled-components";
import { theme } from './components/generic/styles/theme';



const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <TimerProvider>
        <ErrorBoundary FallbackComponent={ErrorPage}>
          <Layout>
            <Outlet />
          </Layout>
        </ErrorBoundary>
      </TimerProvider>
    ),
    children: [
      {
        index: true,
        element: <TimersView />,
      },
      {
        path: "/add",
        element: <AddTimer />,
      },
      {
        path: "/history",
        element: <HistoryView />,
      }
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>

  </StrictMode>
);
