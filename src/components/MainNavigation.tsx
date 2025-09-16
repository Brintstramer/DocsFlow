import { NavLink } from "react-router-dom";

function MainNavigation() {
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
            <NavLink to="/">Выйти</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
