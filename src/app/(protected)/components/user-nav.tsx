import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { loginRoute } from "@/routes";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: loginRoute, redirect: true });
}

export default async function UserNav() {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 bg-primary ring-2 ring-foreground">
            <AvatarFallback className="bg-foreground text-secondary">
              {session?.user?.name?.charAt(0).toUpperCase() || (
                <User className="h-6 w-6" />
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email || "No email provided"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="w-full text-left flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
