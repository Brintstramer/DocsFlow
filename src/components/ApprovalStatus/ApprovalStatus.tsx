import classes from "./ApprovalStatus.module.css";
import type { FC } from "react";
import type { Document, Reviewer } from "../../types/types";

interface ApprovalStatusProps {
  document: Document;
  reviewers: Reviewer[];
}

const ApprovalStatus: FC<ApprovalStatusProps> = ({ document, reviewers }) => {
  if (!document.approvalWorkflow) {
    return null;
  }

  const getReviewerName = (reviewerId: string) => {
    const reviewer = reviewers.find((r) => r.id === reviewerId);
    return reviewer
      ? `${reviewer.name} ${reviewer.position}`
      : "Неизвестный рецензент";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "changes_requested":
        return "⚠️";
      default:
        return "⏳";
    }
  };

  return (
    <div className={classes.approvalStatus}>
      <h3>Статус утверждения</h3>

      <div className={classes.statusHeader}>
        <span className={classes[document.approvalStatus || "draft"]}>
          {document.approvalStatus === "approved" && "Утверждено"}
          {document.approvalStatus === "rejected" && "Отклонено"}
          {document.approvalStatus === "in_review" && "На рассмотрении"}
          {document.approvalStatus === "submitted" &&
            "Отправлено на утверждение"}
          {document.approvalStatus === "draft" && "Черновик"}
        </span>

        {document.dueDate && (
          <span className={classes.dueDate}>
            Deadline: {new Date(document.dueDate).toLocaleDateString("ru-RU")}
          </span>
        )}
      </div>

      <div className={classes.stepsTimeline}>
        {document.approvalWorkflow.steps.map((step) => (
          <div
            key={step.stepNumber}
            className={`${classes.step} ${classes[step.status]} ${
              document.currentStep === step.stepNumber ? classes.current : ""
            }`}
          >
            <div className={classes.stepNumber}>
              {getStatusIcon(step.status)} {step.stepNumber}
            </div>

            <div className={classes.stepInfo}>
              <div className={classes.reviewer}>
                {getReviewerName(step.reviewerId)}
              </div>

              <div className={classes.deadline}>
                До: {new Date(step.deadline).toLocaleDateString("ru-RU")}
              </div>

              {step.comments && (
                <div className={classes.comments}>
                  Комментарии: {step.comments}
                </div>
              )}

              {step.completedAt && (
                <div className={classes.completedAt}>
                  Завершено:{" "}
                  {new Date(step.completedAt).toLocaleDateString("ru-RU")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalStatus;
