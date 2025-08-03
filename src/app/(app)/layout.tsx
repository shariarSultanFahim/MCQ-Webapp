import {
  AppBar,
  Avatar,
  Container,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-gradient-to-t from-[#afe7ea] to-[#c8f8d4] min-h-screen w-screen overflow-y-auto overflow-x-hidden">
      <header className="grow">
        <AppBar
          sx={{
            background: "transparent",
          }}
          elevation={0}
          position="sticky"
        >
          <Toolbar>
            <Avatar alt="Logo" src="/logo.svg" variant="rounded" />

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
                  IST
                </Avatar>
                <ListItemText
                  primary={"Ibrahim Sadik Tamim"}
                  secondary={"01521579148"}
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
          </Toolbar>
        </AppBar>
      </header>
      <Container className="min-h-[87vh]">{children}</Container>
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
