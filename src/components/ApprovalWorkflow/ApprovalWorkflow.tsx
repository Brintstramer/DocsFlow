import classes from "./ApprovalWorkflow.module.css";
import { useCallback, useState, type FC } from "react";
import type {
  ApprovalStep,
  ApprovalWorkflow,
  // Reviewer,
} from "../../types/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

interface ApprovalWorkflowProps {
  workflow: ApprovalWorkflow;
  onWorkFlowChange: (workflow: ApprovalWorkflow) => void;
  // availableReviewers: Reviewer[];
}

const ApprovalWorkflowEditor: FC<ApprovalWorkflowProps> = ({
  workflow,
  onWorkFlowChange,
  // availableReviewers,
}) => {
  const { personal } = useSelector((state: RootState) => state.doc);
  const [name, setName] = useState<string>(workflow?.name || "");
  const [description, setDescription] = useState<string>(
    workflow?.description || "",
  );
  const [steps, setSteps] = useState<ApprovalStep[]>(workflow?.steps || []);

  const addStep = useCallback(() => {
    const newStep: ApprovalStep = {
      stepNumber: steps.length + 1,
      reviewerId: "",
      status: "pending",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 дней
      required: true,
    };
    setSteps([...steps, newStep]);
  }, [steps]);

  const removeStep = useCallback(
    (index: number) => {
      setSteps(steps.filter((_, i) => i !== index));
    },
    [steps],
  );

  const updateStep = useCallback(
    (index: number, field: keyof ApprovalStep, value: unknown) => {
      const updateSteps = steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step,
      );
      setSteps(updateSteps);
    },
    [steps],
  );

  const saveWorkflow = useCallback(() => {
    const newWorkflow: ApprovalWorkflow = {
      id: workflow?.id || `wf_${Date.now()}`,
      name,
      description,
      steps: steps.map((step, index) => ({
        ...step,
        stepNumber: index + 1,
      })),
      createdAt: workflow.createdAt || new Date().toISOString(),
      createdBy: "current-user-id", // В реальном приложении брать из auth
    };
    onWorkFlowChange(newWorkflow);
  }, [name, description, steps, workflow, onWorkFlowChange]);

  return (
    <div className={classes.workflowEditor}>
      <h3>Маршрут утверждения</h3>

      <div className={classes.workflowHeader}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название workflow"
          className={classes.workflowName}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание процесса утверждения"
          className={classes.workflowDescription}
        />
      </div>

      <div className={classes.stepsList}>
        <h4>Этапы утверждения:</h4>
        {steps.map((step, index) => (
          <div key={index} className={classes.stepItem}>
            <div className={classes.stepHeader}>
              <span className={classes.stepNumber}>Этап {step.stepNumber}</span>
              <button
                onClick={() => removeStep(index)}
                className={classes.removeStepBtn}
              >
                ×
              </button>
            </div>

            <select
              value={step.reviewerId}
              onChange={(e) => updateStep(index, "reviewerId", e.target.value)}
              className={classes.reviewerSelect}
            >
              <option value="">Выберите рецензента</option>
              {personal.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} - {person.position}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={step.deadline.slice(0, 16)}
              onChange={(e) =>
                updateStep(
                  index,
                  "deadline",
                  new Date(e.target.value).toISOString(),
                )
              }
              className={classes.deadlineInput}
            />

            <label className={classes.requiredLabel}>
              <input
                type="checkbox"
                checked={step.required}
                onChange={(e) =>
                  updateStep(index, "required", e.target.checked)
                }
              />
              Обязательный этап
            </label>
          </div>
        ))}
      </div>

      <div className={classes.workflowActions}>
        <button onClick={addStep} className={classes.addStepBtn}>
          + Добавить этап
        </button>
        <button onClick={saveWorkflow} className={classes.saveWorkflowBtn}>
          Сохранить маршрут
        </button>
      </div>
    </div>
  );
};

export default ApprovalWorkflowEditor;
