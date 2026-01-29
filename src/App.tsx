import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <>
      <Loader />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}
