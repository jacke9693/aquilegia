import { auth } from "@/app/(auth)/auth";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    return null;
  }
  return <LandingPage />;
}
