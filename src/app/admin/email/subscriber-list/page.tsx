import { redirect } from "next/navigation";
import React from "react";

export default function page() {
  redirect("/admin/email/all-subscribers");
  return <div>page</div>;
}
