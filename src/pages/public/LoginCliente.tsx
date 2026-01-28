import Login from "./Login";

export default function LoginCliente() {
  return (
    <Login
      title="Ingreso clientes"
      subtitle="Accede para ver tu catalogo y pedidos"
      redirectTo="/catalogo"
    />
  );
}
