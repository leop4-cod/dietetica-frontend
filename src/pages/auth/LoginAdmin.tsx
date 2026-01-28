import LoginForm from "./LoginForm";

export default function LoginAdmin() {
  return (
    <LoginForm
      mode="admin"
      title="Iniciar sesión administrativa"
      subtitle="Solo roles autorizados pueden ingresar."
    />
  );
}
