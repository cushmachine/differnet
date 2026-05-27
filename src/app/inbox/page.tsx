import { readInbox } from "@/lib/readers";
import { InboxView } from "./inbox-view";

export const dynamic = "force-dynamic";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = params.status || "unread";
  const allMessages = await readInbox();

  return <InboxView messages={allMessages} activeStatus={activeStatus} />;
}
