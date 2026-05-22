import * as React from "react";
import { Link } from "react-router-dom";
import Error404 from "@/components/Error404";

export function NotFoundCatch() {
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

export default NotFoundCatch;
