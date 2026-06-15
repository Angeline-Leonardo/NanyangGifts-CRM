'use client';
import { useState } from "react";
import { CRMBoard } from "@/components/CRMBoard";
import "./mockData";
import { initialClients } from "./mockData";
export default function Home() {
  const [clients, setClients] = useState(initialClients);
  return <CRMBoard 
          clients={clients}
          onUpdateClients={setClients}
          search=""/>;
}
