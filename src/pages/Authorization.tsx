// import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
// import { authApi } from "../utils/authApi";
import { useNavigate } from "react-router-dom";
// import { tokenManager } from "../utils/tokenManager";
import type { AuthRequest } from "../types/authTypes";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { loginUser } from "../store/thunk";

// type FormData = { name: string; email: string };

function Authorization() {
  // const [form, setForm] = useState({ name: "", email: "" });
  // const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // function validate() {
  //   const errs: typeof errors = {};
  //   if (!form.name) {
  //     errs.name = "Имя обязательно";
  //   }
  //   if (!form.email.match(/\S+@\S+\.\S+/)) {
  //     errs.email = "Неверный email";
  //   }
  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // }

  // function handleSubmit(event: FormEvent) {
  //   event.preventDefault();
  //   if (validate()) {
  //     console.log("Данные", form);
  //   }
  // }

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { success, isAuth, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRequest>();

  useEffect(() => {
    if (isAuth && success) {
      console.log("Успешная авторизация!");
      navigate("/documents");
    }
  }, [isAuth, success, navigate]);

  // const handleLogin = async (credentials: { name: string; email: string }) => {
  //   try {
  //     const response = await authApi.login(credentials);

  //     if (response.success && response.token && response.user) {
  //       tokenManager.setToken(response.token);
  //       localStorage.setItem("user", JSON.stringify(response.user));
  //       console.log("Успешная авторизация!");
  //       navigate("/documents");
  //     } else {
  //       console.error("Ошибка авторизации:", response.message);
  //       alert(response.message || "Ошибка авторизации");
  //     }
  //   } catch (error) {
  //     console.error("Ошибка авторизации", error);
  //     alert("Ошибка подключения к серверу");
  //   }
  // };

  const onSubmit = async (data: AuthRequest) => {
    console.log("Данные для авторизации:", data);
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (error) {
      // Ошибка уже обработана в thunk и slice
      console.error("Ошибка авторизации:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          // value={form.name}
          // onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Имя"
          {...register("name", { required: "Имя обязательно" })}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
      </div>
      <div>
        <input
          // value={form.email}
          // onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
          {...register("email", {
            required: "Email обязателен",
            pattern: { value: /\S+@\S+\.\S+/, message: "Неверный email" },
          })}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {isSubmitting ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}

export default Authorization;
