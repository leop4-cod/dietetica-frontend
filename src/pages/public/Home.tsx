import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import { listNutritionPlans, type NutritionPlan } from "../../api/nutrition-plans.service";
import { listReviews, type Review } from "../../api/reviews.service";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";

const heroImage =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80";

const productImages = [
  "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
];

const categoryImages = [
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506086679525-9b114e1ca7dc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
];

const planImages = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, prods] = await Promise.all([
          listCategories({ page: 1, limit: 4 }),
          listProducts({ page: 1, limit: 6 }),
        ]);
        setCategories(cats.items ?? []);
        setProducts(prods.items ?? []);
      } catch {
        setCategories([]);
        setProducts([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPlans = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setPlans([]);
        return;
      }
      try {
        const data = await listNutritionPlans();
        setPlans(Array.isArray(data) ? data : []);
      } catch {
        setPlans([]);
      }
    };
    loadPlans();
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await listReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch {
        setReviews([]);
      }
    };
    loadReviews();
  }, []);

  const visibleCategories = useMemo(() => categories.slice(0, 4), [categories]);
  const visibleProducts = useMemo(() => products.slice(0, 6), [products]);
  const visiblePlans = useMemo(() => plans.slice(0, 3), [plans]);
  const visibleReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundImage: `linear-gradient(120deg, rgba(24,63,54,0.7), rgba(24,63,54,0.2)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "common.white",
          mb: 6,
        }}
      >
        <Container sx={{ py: { xs: 6, md: 10 } }}>
          <Stack spacing={3} maxWidth={520}>
            <Typography variant="h3" fontWeight={800}>
              Nutrivida para una vida más saludable
            </Typography>
            <Typography>
              Descubre productos, planes nutricionales y un equipo listo para ayudarte a mejorar tus hábitos.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button variant="contained" component={NavLink} to="/catalogo">
                Ver catálogo
              </Button>
              <Button variant="outlined" color="inherit" component={NavLink} to="/registro">
                Registrarme
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Stack spacing={6}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Categorías destacadas
          </Typography>
          {visibleCategories.length === 0 ? (
            <Typography color="text.secondary">No hay categorías para mostrar.</Typography>
          ) : (
            <Grid container spacing={3}>
              {visibleCategories.map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={category.id ?? category.nombre ?? index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={categoryImages[index % categoryImages.length]}
                      alt={category.nombre}
                    />
                    <CardContent>
                      <Typography fontWeight={700}>{category.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.descripcion || "Sin descripción"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Productos recomendados
          </Typography>
          {visibleProducts.length === 0 ? (
            <Typography color="text.secondary">No hay productos para mostrar.</Typography>
          ) : (
            <Grid container spacing={3}>
              {visibleProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={product.id ?? product.nombre ?? index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="160"
                      image={productImages[index % productImages.length]}
                      alt={product.nombre}
                    />
                    <CardContent>
                      <Typography fontWeight={700}>{product.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.descripcion || "Sin descripción"}
                      </Typography>
                      <Typography sx={{ mt: 1 }} fontWeight={700}>
                        {product.precio ? `$${product.precio}` : "Precio a consultar"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Planes nutricionales
          </Typography>
          {visiblePlans.length === 0 ? (
            <Typography color="text.secondary">No hay planes para mostrar.</Typography>
          ) : (
            <Grid container spacing={3}>
              {visiblePlans.map((plan, index) => (
                <Grid item xs={12} md={4} key={plan.id ?? plan.nombre ?? index}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="160"
                      image={planImages[index % planImages.length]}
                      alt={plan.nombre}
                    />
                    <CardContent>
                      <Typography fontWeight={700}>
                        {plan.nombre ?? plan.objetivo ?? "Plan nutricional"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.descripcion ?? plan.objetivo ?? "Sin descripción"}
                      </Typography>
                      {plan.calorias_diarias !== undefined && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Calorías diarias: {plan.calorias_diarias}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Testimonios y reseñas
          </Typography>
          {visibleReviews.length === 0 ? (
            <Typography color="text.secondary">Aún no hay reseñas publicadas.</Typography>
          ) : (
            <Grid container spacing={3}>
              {visibleReviews.map((review, index) => (
                <Grid item xs={12} md={4} key={(review as any)._id ?? review.id ?? index}>
                  <Card>
                    <CardContent>
                      <Typography fontWeight={700}>Reseña</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {review.comentario || "Sin comentario"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Calificación: {review.calificacion ?? review.rating ?? "-"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
