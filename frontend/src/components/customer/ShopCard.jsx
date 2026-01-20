import React from "react";
import { Link } from "react-router-dom";
import "./ShopCard.css";

const ShopCard = ({ shop }) => {
  return (
    <div className="shop-card">
      <div className="shop-image-container">
        <img
          src={shop.image || "https://via.placeholder.com/300"}
          alt={shop.name}
          className="shop-image"
        />
        <div className="shop-badge">{shop.category}</div>
      </div>

      <div className="shop-info">
        <h3 className="shop-name">{shop.name}</h3>
        <p className="shop-description">
          {shop.address || "No description available"}
        </p>

        <div className="shop-details">
          <span className="rating">⭐ {shop.rating || 0}</span>
        </div>

        <div className="shop-footer">
          <div className="total-products">
            {(shop.products && shop.products.length) || 0} items available
          </div>
          <Link to={`/shop/${shop.id}`} className="view-shop-btn">
            Visit Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
