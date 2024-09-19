import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function renderErrorCard(
  title: string,
  description: string,
  content: React.ReactNode
) {
  return (
    <div className="flex-1 flex items-start justify-center pt-32">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </div>
  );
}
