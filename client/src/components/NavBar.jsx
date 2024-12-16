import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <div>
        <span>
          <NavLink to="/">Authentication-system</NavLink>
        </span>
      </div>

      <div>
        <div>
          <NavLink to="/about">About</NavLink>
        </div>
        <div>
          <NavLink to="/about">profile</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
