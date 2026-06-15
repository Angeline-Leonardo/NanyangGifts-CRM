'use client';
import { useState } from "react";
import { CRMBoard } from "@/components/CRMBoard";
import "./mockData";
import { initialClients } from "./mockData";
import { TopBar } from "@/components/TopBar";
import { SidePanel } from "@/components/Sidebar";
import { EmailPanel } from "@/components/EmailPanel";
import { ReportsPanel } from "@/components/ReportsPanel";
export default function Home() {
  const [clients, setClients] = useState(initialClients);
  return <CRMBoard 
          clients={clients}
          onUpdateClients={setClients}
          search=""/>;
}
