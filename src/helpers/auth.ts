import { auth } from "@/lib/server/auth";
import { redirect } from "next/navigation";

export async function isAdmin() {
  const session = await auth()

  if (!session?.user?.isAdmin) return redirect('/')

  return session
}