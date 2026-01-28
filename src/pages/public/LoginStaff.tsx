import Login from "./Login";

export default function LoginStaff() {
  return (
    <Login
      title="Ingreso staff"
      subtitle="Acceso para trabajadores y administradores"
      redirectTo="/admin"
    />
  );
}
