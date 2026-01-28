import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";

export default function App() {
  return (
    <>
      <Loader />
      <AppRoutes />
    </>
  );
}
