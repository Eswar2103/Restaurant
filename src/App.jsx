import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import ProtectedRoute from "./components/ProtectedRoute";
import { lazy, Suspense } from "react";
import Error from "./pages/Error";
import {
  AppLayoutSkeleton,
  AuthSkeletonCard,
  RootLayoutSkeleton,
  SkeletonCard,
} from "./components/LOader";
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const RootLayout = lazy(() => import("./pages/RootLayout"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const AllRestaurants = lazy(() => import("./pages/AllRestaurants"));
const MyRestaurants = lazy(() => import("./pages/MyRestaurants"));
const AddRestaurant = lazy(() => import("./pages/AddRestaurant"));
const RestaurantView = lazy(() => import("./pages/RestaurantView"));
const MyRestaurantView = lazy(() => import("./pages/MyRestaurantView"));

function RestaurantsLayout() {
  const { user, loading } = useAuth();
  if (loading) return <AppLayoutSkeleton />;
  return user ? (
    <Suspense fallback={<AppLayoutSkeleton />}>
      <AppLayout />
    </Suspense>
  ) : (
    <Suspense fallback={<RootLayoutSkeleton />}>
      <RootLayout />
    </Suspense>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<RootLayoutSkeleton />}>
          <RootLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/login",
          element: (
            <Suspense fallback={<AuthSkeletonCard />}>
              <Login />
            </Suspense>
          ),
        },
        {
          path: "/register",
          element: (
            <Suspense fallback={<AuthSkeletonCard />}>
              <Register />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: <RestaurantsLayout />,
      children: [
        {
          path: "/restaurants",
          element: (
            <Suspense fallback={<SkeletonCard />}>
              <AllRestaurants />
            </Suspense>
          ),
        },
        {
          path: "/restaurants/:id",
          element: (
            <Suspense fallback={<SkeletonCard />}>
              <RestaurantView />
            </Suspense>
          ),
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<AppLayoutSkeleton />}>
          <AppLayout />
        </Suspense>
      ),
      children: [
        {
          path: "/my-restaurants",
          element: (
            <Suspense fallback={<SkeletonCard />}>
              <ProtectedRoute allowedRole="owner">
                <MyRestaurants />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/my-restaurants/:id",
          element: (
            <Suspense fallback={<SkeletonCard />}>
              <ProtectedRoute allowedRole="owner">
                <MyRestaurantView />
              </ProtectedRoute>
            </Suspense>
          ),
        },
        {
          path: "/my-restaurants/add",
          element: (
            <Suspense fallback={<SkeletonCard />}>
              <ProtectedRoute allowedRole="owner">
                <AddRestaurant />
              </ProtectedRoute>
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
