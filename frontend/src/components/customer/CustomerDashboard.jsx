import React, { useState, useEffect } from "react";
import ShopCard from "./ShopCard";
import "./CustomerDashboard.css";
import { useAuth } from "../../context/AuthContext";
// adjust path if needed

const CustomerDashboard = () => {
  const { token } = useAuth();

  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icons for categories
  const categoryIcons = {
    food: "🍔",
    grocery: "🛒",
    fashion: "👕",
    electronics: "📱",
    beauty: "💄",
  };

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/shops", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch shops");
        }

        const data = await res.json();
        setShops(data.shops || []);
        setFilteredShops(data.shops || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token]);

  // Filter logic
  useEffect(() => {
    let filtered = [...shops];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (shop) => shop.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop.name?.toLowerCase().includes(term) ||
          shop.address?.toLowerCase().includes(term) ||
          shop.phone?.toLowerCase().includes(term)
      );
    }

    setFilteredShops(filtered);
  }, [shops, selectedCategory, searchTerm]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
  };

  // Stats (safe)
  const totalProducts = shops.reduce(
    (total, shop) => total + (shop.products ? shop.products.length : 0),
    0
  );

  const averageRating =
    shops.length > 0
      ? (
          shops.reduce((total, shop) => total + (shop.rating || 0), 0) /
          shops.length
        ).toFixed(1)
      : "0.0";

  const apiCategories = [
    ...new Set(shops.map((shop) => shop.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className="loading-shops">
        <div className="spinner"></div>
        <p>Loading shops...</p>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div className="customer-dashboard">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1>POS Marketplace</h1>
          <p>Discover and order from local shops in your area</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{shops.length}</span>
              <span className="stat-label">Shops</span>
            </div>
            <div className="stat">
              <span className="stat-number">{totalProducts}</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">{averageRating}</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="dashboard-controls">
        <div className="search-container">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="category-buttons">
          <button
            className={`category-btn ${
              selectedCategory === "all" ? "active" : ""
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            🏪 ALL
          </button>

          {apiCategories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {categoryIcons[category?.toLowerCase()] || "🏪"}{" "}
              {category.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="dashboard-results">
        {filteredShops.length > 0 ? (
          <div className="shops-grid">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No shops found</h3>
            <button onClick={clearFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
