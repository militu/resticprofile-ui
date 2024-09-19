import AlertMessage from "../../alert-message";
import SnapshotsDisplayStructure from "./structure";

interface SnapshotsDisplayAlertProps {
  message: string;
  type: "error" | "warning";
}

export default function SnapshotsDisplayAlert({
  message,
  type,
}: SnapshotsDisplayAlertProps) {
  return (
    <SnapshotsDisplayStructure>
      <AlertMessage message={message} type={type} />
    </SnapshotsDisplayStructure>
  );
}
