import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfilePageStructure } from "./structure";

const SkeletonItem = () => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-6 w-[250px]" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-[300px] mb-2" />
      <Skeleton className="h-4 w-[250px]" />
    </CardContent>
  </Card>
);

export const ProfilePageSkeleton: React.FC = () => {
  const skeletonContent = (
    <>
      <Skeleton className="h-8 w-[200px] mb-4" />
      {[...Array(3)].map((_, index) => (
        <SkeletonItem key={`item-${index}`} />
      ))}
    </>
  );

  return (
    <ProfilePageStructure
      tabContent={{
        snapshots: skeletonContent,
        schedulers: (
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-[200px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ),
        profileConfig: skeletonContent,
      }}
    />
  );
};
