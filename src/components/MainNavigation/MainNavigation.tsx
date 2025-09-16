import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

function MainNavigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logoutHandler() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Главная</NavLink>
          </li>
          <li>
            <NavLink to="/documents">Документы</NavLink>
          </li>
          <li>
            <NavLink to="/authorization">Войти</NavLink>
          </li>
          <li>
            {/* <NavLink to="/">Выйти</NavLink> */}
            <button onClick={logoutHandler}>Выйти</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
