import { useState, type FormEvent } from "react";

function Authorization() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function validate() {
    const errs: typeof errors = {};
    if (!form.name) {
      errs.name = "Имя обязательно";
    }
    if (!form.email.match(/\S+@\S+\.\S+/)) {
      errs.email = "Неверный email";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (validate()) {
      console.log("Данные", form);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Имя"
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>
      <div>
        <input
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>
      <button type="submit">Отправить</button>
    </form>
  );
}

export default Authorization;
