import Login from "./Login";

export default function LoginCliente() {
  return (
    <Login
      title="Ingreso de clientes"
      subtitle="Accede para ver tu catálogo y pedidos"
      redirectTo="/catalogo"
    />
  );
}
