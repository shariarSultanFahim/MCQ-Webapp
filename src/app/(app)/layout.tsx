import { getSession } from "@/lib/session";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  if (!user) {
    // If no user session, redirect to login
    redirect("/login", RedirectType.replace);
  }

  async function logout() {
    "use server";
    (await cookies()).delete("session");
    redirect("/login", RedirectType.replace);
  }

  return (
    <main className="bg-gradient-to-t  from-[#afe7ea] to-[#c8f8d4] min-h-screen w-screen overflow-y-auto overflow-x-hidden">
      <header className="grow">
        <AppBar
          sx={{
            background: "transparent",
          }}
          elevation={0}
          position="sticky"
        >
          <Toolbar>
            <Link href="/">
              <Avatar alt="Logo" src="/logo.svg" variant="rounded" />
            </Link>

            <div className="grow" />

            <div>
              <ListItem>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    width: 30,
                    height: 30,
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    borderColor: "primary.main",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    padding: 2,
                  }}
                >
                  {user.full_name
                    .split(" ")
                    .map((name: string) => name.charAt(0).toUpperCase())
                    .join("")}
                </Avatar>
                <ListItemText
                  primary={user.full_name}
                  secondary={user.email}
                  slotProps={{
                    root: {
                      sx: {
                        ml: 1.3,
                      },
                    },
                    primary: {
                      sx: {
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                        color: "primary.main",
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "text.secondary",
                      },
                    },
                  }}
                />
              </ListItem>
            </div>

            {/* Replace onClick with a server action form submit */}
            <form action={logout}>
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                sx={{ ml: 2 }}
              >
                Logout
              </Button>
            </form>
          </Toolbar>
        </AppBar>
      </header>
      <Container className="min-h-[calc(100vh-144px)] overflow-x-hidden">
        {children}
      </Container>
      <footer className="flex sm:hidden justify-center items-center py-4">
        <Typography variant="caption" color="primary">
          Examina © 2025
        </Typography>
      </footer>
      <footer className="hidden sm:flex justify-center items-center py-4">
        <Typography variant="caption" color="primary">
          © 2025 Examina. All rights reserved.
        </Typography>
        <Typography variant="body2" color="primary" className="px-2">
          |
        </Typography>
        <Typography variant="caption" color="primary">
          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
        </Typography>
      </footer>
    </main>
  );
}
