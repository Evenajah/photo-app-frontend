import React from "react";

const Header = (props) => {
  return (
    <div className="header p-grid">
      <div className="p-col">
        <img
          width="100px"
          alt="header-img"
          loading="lazy"
          src="https://image.flaticon.com/icons/png/512/2659/2659360.png"
        />
        <span class="header-text">Photo App</span>
      </div>
    </div>
  );
};

export default Header;
