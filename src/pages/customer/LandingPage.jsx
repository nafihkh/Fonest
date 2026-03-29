import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import HomeMobileView from "../../components/customer/Mobile/Home";
import HomeDesktopView from "../../components/customer/Desktop/LandingPage";
import {
  fetchHomeProducts,
  selectFeaturedProducts,
  selectLatestProducts,
  selectProductsLoadingHome,
  selectProductsErrorHome,
} from "../../store/slices/productSlice";

function formatPrice(value) {
  const num = Number(value || 0);
  return `$${num}`;
}

function mapFeaturedToDeals(products = []) {
  return products.map((p) => {
    const price = Number(p.price || 0);
    const compareAtPrice = Number(p.compareAtPrice || 0);

    let discountLabel = "";
    if (compareAtPrice > price && compareAtPrice > 0) {
      const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
      discountLabel = `-${discount}%`;
    }

    return {
      id: p._id,
      _id: p._id,
      title: p.name,
      subtitle: p.brand || p.category || "Top deal available now",
      badge: discountLabel || "Top Deal",
      category: p.category || "",
      brand: p.brand || "",
      price: formatPrice(price),
      oldPrice: compareAtPrice > 0 ? formatPrice(compareAtPrice) : "",
      discountLabel,
      image: p.image || "",
      rawPrice: price,
      rawCompareAtPrice: compareAtPrice,
      slug: p.slug || "",
      stock: p.stock || 0,
      isFeatured: !!p.isFeatured,
    };
  });
}

function mapLatestToArrivals(products = []) {
  return products.map((p) => ({
    id: p._id,
    _id: p._id,
    title: p.name,
    name: p.name,
    category: p.category || "",
    brand: p.brand || "",
    price: formatPrice(p.price),
    image: p.image || "",
    isNew: true,
    rawPrice: Number(p.price || 0),
    rawCompareAtPrice: Number(p.compareAtPrice || 0),
    compareAtPrice: Number(p.compareAtPrice || 0),
    slug: p.slug || "",
    stock: p.stock || 0,
  }));
}

function mapLatestToRecommended(products = []) {
  return products.map((p) => ({
    id: p._id,
    _id: p._id,
    title: p.name,
    name: p.name,
    brand: p.brand || "",
    category: p.category || "",
    price: Number(p.price || 0),
    compareAtPrice: Number(p.compareAtPrice || 0),
    oldPrice: Number(p.compareAtPrice || 0) || null,
    image: p.image || "",
    rating: 4.8, // temporary static until backend has rating
    reviews: 120, // temporary static until backend has reviews
    tag: p.isFeatured ? "Bestseller" : "",
    slug: p.slug || "",
    stock: p.stock || 0,
  }));
}

export default function HomePage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const featuredProducts = useSelector(selectFeaturedProducts);
  const latestProducts = useSelector(selectLatestProducts);
  const loading = useSelector(selectProductsLoadingHome);
  const error = useSelector(selectProductsErrorHome);

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);

  const deals = useMemo(() => mapFeaturedToDeals(featuredProducts), [featuredProducts]);
  const arrivals = useMemo(() => mapLatestToArrivals(latestProducts), [latestProducts]);
  const recommendedProducts = useMemo(
    () => mapLatestToRecommended(latestProducts),
    [latestProducts]
  );

  const sharedProps = {
    featuredProducts,
    latestProducts,
    deals,
    arrivals,
    recommendedProducts,
    loading,
    error,
  };

  return isMobile ? (
    <Navigate to="/home" replace />
  ) : (
    <HomeDesktopView {...sharedProps} />
  );
}