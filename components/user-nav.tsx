import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

async function getCurrentUser() {
  try {
    return await auth()
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function UserNav() {
  const session = await getCurrentUser()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={(session?.user?.image as string) || "/placeholder.svg"}
              alt={session?.user?.name as string}
            />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings/general">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.11a2.22 2.22 0 0 1-2.44 2.07 2 2 0 0 0-2.79-.91 2 2 0 0 0-1 2.22 2.21 2.21 0 0 1-.08 4 2 2 0 0 0 1.51 2 2 2 0 0 0 1.48-1.11h.44a2 2 0 0 0 2-2v-.11a2.22 2.22 0 0 1 2.44-2.07 2 2 0 0 0 2.79.91 2 2 0 0 0 1-2.22 2.21 2.21 0 0 1 .08-4 2 2 0 0 0-1.51-2 2 2 0 0 0-1.48 1.11z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/logout">Log out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
