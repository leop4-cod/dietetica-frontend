import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";

export default function LoginCliente() {
  const location = useLocation();
  const initialMessage = (location.state as any)?.registered ? "Registro exitoso." : undefined;

  return (
    <LoginForm
      mode="cliente"
      title="Iniciar sesión como cliente"
      subtitle="Accede a tu cuenta para ver productos y planes."
      showRegister
      initialMessage={initialMessage}
    />
  );
}
