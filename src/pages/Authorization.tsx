// import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";

type FormData = { name: string; email: string };

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Данные:", data);
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
      <button type="submit">Отправить</button>
    </form>
  );
}

export default Authorization;
