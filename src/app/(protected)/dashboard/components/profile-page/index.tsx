import { ServerConfig } from "@/types";
import ProfileConfigDisplay from "./profile-config-display";
import ProfileSchedulers from "./schedulers";
import SnapshotsDisplay from "./snapshots";
import { ProfilePageStructure } from "./structure";

interface ProfilePageProps {
  serverConfig: ServerConfig;
  profileName: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  serverConfig,
  profileName,
}) => {
  return (
    <ProfilePageStructure
      tabContent={{
        snapshots: (
          <SnapshotsDisplay
            serverConfig={serverConfig}
            profileName={profileName}
          />
        ),
        schedulers: (
          <ProfileSchedulers
            serverConfig={serverConfig}
            profileName={profileName}
          />
        ),
        profileConfig: (
          <ProfileConfigDisplay
            serverConfig={serverConfig}
            profileName={profileName}
          />
        ),
      }}
    />
  );
};

// import { fetchProfileConfig } from "@/actions/fetchProfileConfig";
// import {
//   fetchSchedulerStatus,
//   SchedulerStatus,
// } from "@/actions/fetchSchedulerStatus";
// import { fetchSnapshots } from "@/actions/fetchSnapshots";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ActionResponse } from "@/types";
// import { AlertCircle } from "lucide-react";
// import { redirect } from "next/navigation";
// import { DataTableContainer } from "../table/data-table-container";
// import ProfileConfigDisplayClient from "./profile-config-display/client";
// import ProfileSchedulers from "./schedulers";
// import { SnapshotsTable } from "./snapshots";

// interface ProfilePageProps {
//   configSlug: string;
//   profileName: string;
// }

// const fetchAllSchedulerStatuses = async (
//   configSlug: string,
//   profileName: string
// ) => {
//   const types = ["backup", "check", "prune"] as const;
//   const responses = await Promise.all(
//     types.map((type) => fetchSchedulerStatus(configSlug, profileName, type))
//   );
//   return Object.fromEntries(
//     types.map((type, index) => [type, responses[index]])
//   ) as Record<(typeof types)[number], ActionResponse<SchedulerStatus>>;
// };

// export default async function ProfilePage({
//   configSlug,
//   profileName,
// }: ProfilePageProps) {
//   const [profileConfigResponse, snapshotsResponse, schedulerStatusResponses] =
//     await Promise.all([
//       fetchProfileConfig(configSlug, profileName),
//       fetchSnapshots(configSlug, profileName),
//       fetchAllSchedulerStatuses(configSlug, profileName),
//     ]);

//   const hasSchedulerErrors = Object.values(schedulerStatusResponses).some(
//     (response) =>
//       response.success &&
//       response.data?.errors &&
//       response.data.errors.length > 0
//   );

//   const handleRowClick = async (snapshotId: string) => {
//     "use server";
//     redirect(`/dashboard/${configSlug}/${profileName}/${snapshotId}`);
//   };

//   return (
//     <div>
//       <Tabs defaultValue="snapshots" className="w-full">
//         <TabsList className="w-full justify-start">
//           <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
//           <TabsTrigger value="schedulers" className="flex items-center">
//             Schedulers
//             {hasSchedulerErrors && (
//               <AlertCircle className="ml-2 h-4 w-4 text-destructive" />
//             )}
//           </TabsTrigger>
//           <TabsTrigger value="profile-config">Profile Config</TabsTrigger>
//         </TabsList>
//         <TabsContent value="snapshots">
//           <DataTableContainer
//             isLoading={false}
//             actionResponse={snapshotsResponse}
//             emptyMessage="There are no snapshots available for the selected profile."
//           >
//             {(data) => (
//               <SnapshotsTable data={data} onRowClick={handleRowClick} />
//             )}
//           </DataTableContainer>
//         </TabsContent>
//         <TabsContent value="schedulers">
//           <ProfileSchedulers actionResponses={schedulerStatusResponses} />
//         </TabsContent>
//         <TabsContent value="profile-config">
//           <ProfileConfigDisplayClient actionResponse={profileConfigResponse} />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
