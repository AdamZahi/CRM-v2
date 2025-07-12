import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server";

export default function HomePage() {
  const { userId } = auth();
  console.log("user: "+userId); 
  if (userId) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
