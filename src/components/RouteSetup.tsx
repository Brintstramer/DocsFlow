import type { FC } from "react";
import type { Person, ReviewerStep } from "../types/types";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setRoute } from "../store/thunk";
import type { AppDispatch } from "../store/store";
import { useWebSocket } from "../hooks/useWebSocket";

// interface ReviewerStepForm {
//   userId: string;
//   deadlind: string;
// }

interface RouteForm {
  reviewers: ReviewerStep[];
}

interface RouteSetupProps {
  documentId: string;
  users: Person[];
  onClose?: () => void;
}

const RouteSetup: FC<RouteSetupProps> = ({ documentId, users, onClose }) => {
  const { register, control, handleSubmit } = useForm<RouteForm>({
    defaultValues: { reviewers: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reviewers",
  });
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = (data: RouteForm) => {
    dispatch(setRoute({ documentId, reviewers: data.reviewers }));
    onClose?.();
  };

  const token = localStorage.getItem("accessToken");
  useWebSocket("ws://localhost:3001/ws", token || undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 16 }}>
      <h3>Маршрут согласования</h3>
      {fields.map((field, index) => (
        <div key={field.id} style={{ marginBottom: 12 }}>
          <select {...register(`reviewers.${index}.userId`)}>
            <option value="">-- выберите рецензента --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.position})
              </option>
            ))}
          </select>
          <input type="date" {...register(`reviewers.${index}.deadline`)} />
          <button type="button" onClick={() => remove(index)}>
            Удалить
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({
            userId: "",
            order: fields.length + 1,
            deadline: "",
            status: "pending",
          })
        }
      >
        Добавить рецензента
      </button>
      {/* <button type="submit">Сохранить маршрут</button> */}
      <div style={{ marginTop: 16 }}>
        <button type="submit">Сохранить маршрут</button>
        {onClose && (
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default RouteSetup;
