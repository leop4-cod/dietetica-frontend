import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  GridLegacy as Grid,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpaIcon from "@mui/icons-material/Spa";
import RateReviewIcon from "@mui/icons-material/RateReview";
import type { AxiosError } from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { listCategories } from "../../api/categories.service";
import { listProducts } from "../../api/products.service";
import { listNutritionPlans, type NutritionPlan } from "../../api/nutrition-plans.service";
import { listReviews, type Review } from "../../api/reviews.service";
import type { Category } from "../../types/category";
import type { Product } from "../../types/product";
import EmptyState from "../../components/EmptyState";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import PlanCard from "../../components/PlanCard";
import { useAuth } from "../../auth/AuthContext";
import { getImageUrl } from "../../utils/images";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categoriesUnavailable, setCategoriesUnavailable] = useState(false);
  const [productsUnavailable, setProductsUnavailable] = useState(false);
  const [plansUnavailable, setPlansUnavailable] = useState(false);
  const [reviewsUnavailable, setReviewsUnavailable] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, prods] = await Promise.all([
          listCategories({ page: 1, limit: 8 }),
          listProducts({ page: 1, limit: 12 }),
        ]);
        setCategories(cats.items ?? []);
        setProducts(prods.items ?? []);
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        setCategoriesUnavailable(status === 404);
        setProductsUnavailable(status === 404);
        setCategories([]);
        setProducts([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadPlans = async () => {
      if (!token) {
        setPlans([]);
        return;
      }
      try {
        const data = await listNutritionPlans();
        setPlans(Array.isArray(data) ? data : []);
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        setPlansUnavailable(status === 404);
        setPlans([]);
      }
    };
    loadPlans();
  }, [token]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await listReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        const status = (error as AxiosError)?.response?.status;
        setReviewsUnavailable(status === 404);
        setReviews([]);
      }
    };
    loadReviews();
  }, []);

  const visibleCategories = useMemo(() => categories.slice(0, 8), [categories]);
  const visibleProducts = useMemo(() => products.slice(0, 12), [products]);
  const visiblePlans = useMemo(() => plans.slice(0, 3), [plans]);
  const visibleReviews = useMemo(() => reviews.slice(0, 3), [reviews]);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          backgroundImage: `linear-gradient(120deg, rgba(12,60,50,0.85), rgba(12,60,50,0.25)), url(${getImageUrl(
            { id: "hero" },
            "hero"
          )})`,
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
              Descubre productos, planes nutricionales y un equipo listo para ayudarte a
              mejorar tus hábitos.
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
          {categoriesUnavailable ? (
            <EmptyState
              title="No disponible en API"
              description="El endpoint de categorías no está disponible."
            />
          ) : visibleCategories.length === 0 ? (
            <EmptyState
              title="No hay categorías publicadas"
              description="Cuando el backend tenga categorías activas aparecerán aquí."
              actionLabel="Crear una categoría"
              onAction={() => navigate("/app/admin/categorias")}
              icon={<AutoAwesomeIcon fontSize="inherit" />}
            />
          ) : (
            <Grid container spacing={3}>
              {visibleCategories.map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.id ?? category.nombre}>
                  <CategoryCard category={category} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Productos recomendados
          </Typography>
          {productsUnavailable ? (
            <EmptyState
              title="No disponible en API"
              description="El endpoint de productos no está disponible."
            />
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              title="No hay productos destacados"
              description="Agrega productos en el panel administrativo para verlos aquí."
              actionLabel="Ir al catálogo"
              onAction={() => navigate("/catalogo")}
            />
          ) : (
            <Grid container spacing={3}>
              {visibleProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id ?? product.nombre}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Planes nutricionales
          </Typography>
          {!token ? (
            <EmptyState
              title="Necesitas iniciar sesión"
              description="El backend protege los planes nutricionales con JWT."
              actionLabel="Iniciar sesión"
              onAction={() => navigate("/login/cliente")}
              icon={<SpaIcon fontSize="inherit" />}
            />
          ) : plansUnavailable ? (
            <EmptyState
              title="No disponible en API"
              description="El endpoint de planes nutricionales no está disponible."
              icon={<SpaIcon fontSize="inherit" />}
            />
          ) : visiblePlans.length === 0 ? (
            <EmptyState
              title="No hay planes disponibles"
              description="Crea planes desde el panel administrativo."
              actionLabel="Ver planes"
              onAction={() => navigate("/app/cliente/planes")}
              icon={<SpaIcon fontSize="inherit" />}
            />
          ) : (
            <Grid container spacing={3}>
              {visiblePlans.map((plan) => (
                <Grid item xs={12} md={4} key={plan._id ?? plan.id ?? plan.objetivo}>
                  <PlanCard plan={plan} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
            Testimonios y reseñas
          </Typography>
          {reviewsUnavailable ? (
            <EmptyState
              title="No disponible en API"
              description="El endpoint de reseñas no está disponible."
              icon={<RateReviewIcon fontSize="inherit" />}
            />
          ) : visibleReviews.length === 0 ? (
            <EmptyState
              title="Aún no hay reseñas publicadas"
              description="Invita a tus clientes a dejar su opinión."
              icon={<RateReviewIcon fontSize="inherit" />}
            />
          ) : (
            <Grid container spacing={3}>
              {visibleReviews.map((review) => (
                <Grid item xs={12} md={4} key={review._id ?? review.id}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(46, 125, 111, 0.12)",
                      backgroundColor: "background.paper",
                      boxShadow: "0 12px 24px rgba(46, 125, 111, 0.12)",
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(review, "review")}
                      alt="Reseña"
                      sx={{ width: "100%", height: 160, objectFit: "cover" }}
                    />
                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight={700}>Reseña</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {review.comentario || "Sin comentario"}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Calificación: {review.rating ?? "-"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
