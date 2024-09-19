import AlertMessage from "../../alert-message";
import ProfileConfigDisplayStructure from "./structure";

interface ProfileConfigDisplayAlertProps {
  message: string;
  type: "error" | "warning";
}

export default function ProfileConfigDisplayAlert({
  message,
  type,
}: ProfileConfigDisplayAlertProps) {
  return (
    <ProfileConfigDisplayStructure>
      <AlertMessage message={message} type={type} />
    </ProfileConfigDisplayStructure>
  );
}
