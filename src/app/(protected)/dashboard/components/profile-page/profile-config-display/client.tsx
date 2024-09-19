import { ProfileConfig } from "@/lib/parsers/parseProfileConfigOutput";
import { FileJson } from "lucide-react";
import ProfileConfigDisplayStructure from "./structure";

interface ProfileConfigDisplayClientProps {
  profileConfig: ProfileConfig;
}

export default function ProfileConfigDisplayClient({
  profileConfig,
}: ProfileConfigDisplayClientProps) {
  return (
    <ProfileConfigDisplayStructure>
      <div className="flex items-center mb-4">
        <FileJson className="mr-2 h-4 w-4" />
        Profile Configuration
      </div>
      <pre className="whitespace-pre-wrap break-words bg-muted rounded-2xl p-4">
        {profileConfig.config}
      </pre>
    </ProfileConfigDisplayStructure>
  );
}
