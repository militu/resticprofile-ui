import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

export default function renderProfileSelectionPrompt() {
  return (
    <div className="flex-1 flex items-start justify-center pt-32">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-foreground/50" />
            Select a Profile
          </CardTitle>
          <CardDescription>
            Choose a profile to view its details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Please select a profile from the sidebar to view its configuration
            and snapshots.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
