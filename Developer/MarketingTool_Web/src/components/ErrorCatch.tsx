import * as React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import Error500 from "@/components/Error500";
import Error404 from "@/components/Error404";
import { Box, Typography, Button, Container, Stack } from "@mui/material";

export function ErrorCatch() {
  const error = useRouteError();

  React.useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <Error404
          heading="The page you are looking for does not exist."
          primaryBtn={{
            children: "Go to Home",
            component: Link,
            to: "/",
          }}
        />
      );
    }
  }

  const errorMessage =
    error instanceof Error ? error.message : String(error || "Unknown application error");

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Error500
        heading={errorMessage}
        primaryBtn={{
          children: "Try Again",
          onClick: () => window.location.reload(),
        }}
      />

      <Container maxWidth="md" sx={{ mt: -10, mb: 10, position: "relative", zIndex: 10 }}>
        <Stack
          spacing={2}
          sx={{
            p: 3,
            bgcolor: "rgba(255,0,0,0.05)",
            borderRadius: 2,
            border: "1px solid rgba(255,0,0,0.1)",
          }}
        >
          <Typography variant="h6" color="error">
            Technical Details
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              fontFamily: "monospace",
              p: 2,
              bgcolor: "background.paper",
              borderRadius: 1,
            }}
          >
            {errorMessage}
          </Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Hard Refresh
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default ErrorCatch;
