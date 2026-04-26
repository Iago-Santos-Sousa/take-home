import { redirect } from "next/navigation";
import { headers } from "next/headers";
import EditExamClient from "./EditExamClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function isAdmin(): Promise<boolean> {
  const headerStore = await headers();
  return headerStore.get("x-user-role") === "admin";
}

export default async function EditExamPage({ params }: PageProps) {
  if (!(await isAdmin())) redirect("/exams");

  const { id } = await params;
  return <EditExamClient examId={Number(id)} />;
}
