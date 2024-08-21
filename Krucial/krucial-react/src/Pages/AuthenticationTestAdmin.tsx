import React from "react";
import { withAdminAuth } from "../HOC";

function AuthenticationTestAdmin() {
  return <div>Admin only.</div>;
}

export default withAdminAuth(AuthenticationTestAdmin);
