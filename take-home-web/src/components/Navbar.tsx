"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiActivity, FiLogOut } from "react-icons/fi";
import { useLogout } from "@/hooks/useAuth";

interface NavbarProps {
  userName: string;
  userRole: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const isAdmin = userRole === "admin";

  const linkClass = (href: string) =>
    pathname.startsWith(href)
      ? "rounded-md bg-white/20 px-3 py-1.5 text-white font-semibold"
      : "rounded-md px-3 py-1.5 text-white/85 hover:bg-white/10";

  return (
    <header className="bg-linear-to-r from-blue-800 to-blue-600 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white">
            <FiActivity size={18} />
            <span className="text-lg font-extrabold tracking-tight">
              ExamPortal
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/exams" className={linkClass("/exams")}>
              Exames
            </Link>
            <Link href="/appointments" className={linkClass("/appointments")}>
              Agendamentos
            </Link>
            {isAdmin && (
              <Link href="/create-exams" className={linkClass("/create-exams")}>
                Criar Exame
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className={linkClass("/admin")}>
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/95">
              {userName}
            </span>
            {isAdmin && (
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-white">
                ADMIN
              </span>
            )}
          </div>
          <button
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/40 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-60"
          >
            <FiLogOut size={14} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
