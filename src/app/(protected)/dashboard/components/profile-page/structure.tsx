import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { ReactNode } from "react";

interface TabContent {
  snapshots: ReactNode;
  schedulers: ReactNode;
  profileConfig: ReactNode;
}

interface ProfilePageStructureProps {
  tabContent: TabContent;
}

export const ProfilePageStructure: React.FC<ProfilePageStructureProps> = ({
  tabContent,
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="snapshots" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="snapshots">Snapshots</TabsTrigger>
          <TabsTrigger value="schedulers">Schedulers</TabsTrigger>
          <TabsTrigger value="profileConfig">Profile Config</TabsTrigger>
        </TabsList>

        <TabsContent value="snapshots" className="mt-4">
          {tabContent.snapshots}
        </TabsContent>

        <TabsContent value="schedulers" className="mt-4">
          {tabContent.schedulers}
        </TabsContent>

        <TabsContent value="profileConfig" className="mt-4">
          {tabContent.profileConfig}
        </TabsContent>
      </Tabs>
    </div>
  );
};
