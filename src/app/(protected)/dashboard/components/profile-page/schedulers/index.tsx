import { fetchSchedulerStatus } from "@/actions/fetchSchedulerStatus";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ServerConfig } from "@/types";
import AlertMessage from "../../alert-message";
import SchedulerStatusCard from "./scheduler-status-card";

interface ProfileSchedulersProps {
  serverConfig: ServerConfig;
  profileName: string;
}

export default async function ProfileSchedulers({
  serverConfig,
  profileName,
}: ProfileSchedulersProps) {
  const schedulerTypes = ["backup", "check", "prune"] as const;

  const actionResponses = {
    backup: await fetchSchedulerStatus(serverConfig, profileName, "backup"),
    check: await fetchSchedulerStatus(serverConfig, profileName, "check"),
    prune: await fetchSchedulerStatus(serverConfig, profileName, "prune"),
  };

  const hasErrors = Object.values(actionResponses).some(
    (response) =>
      response.success &&
      response.data?.errors &&
      response.data.errors.length > 0
  );

  if (Object.values(actionResponses).every((response) => !response.success)) {
    return (
      <AlertMessage message="Failed to fetch scheduler data" type="error" />
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {schedulerTypes.map((type) => (
        <AccordionItem key={type} value={type}>
          <AccordionTrigger>
            {type.charAt(0).toUpperCase() + type.slice(1)} Scheduler
          </AccordionTrigger>
          <AccordionContent>
            <SchedulerStatusCard
              actionResponse={actionResponses[type]}
              title={type}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
