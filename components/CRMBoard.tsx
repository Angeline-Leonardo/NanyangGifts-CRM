'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronDown, ChevronRight, Plus, Calendar, CreditCard, Trash2,
  Filter, ChevronsDown, ChevronsUp, FileText, X, Package, Activity
} from 'lucide-react';
import { Client, Subitem, TimelineRow, ClientStatus, ReplyStatus, SampleRow, ActivityEntry } from '../app/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger } from './ui/alert-dialog';
import { createClient } from '@/lib/supabase/client';
import { EditableCell } from './ui/editablecell';
import { StatusBadge } from './ui/statusbadge';
import { TimelineSection } from './ui/timeline';
import { PaymentsSection } from './ui/payments';
import { SamplesSection } from './ui/sample';
import { SubitemsTable } from './ui/subitems';

async function getCurrentActorName() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "Unknown user";

  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Unknown user"
  );
}


// ─── Constants ────────────────────────────────────────────────────────────────

const supabase = createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

export const EditableDate: React.FC = () => {
  const [date, setDate]= useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    if (isEditing && inputRef.current){
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      {date.toDateString()}
    </div>
  );
};

export const CLIENT_STATUSES: ClientStatus[] = [
  'New Lead', 'Contacted', 'Quoted', 'Failed', 'Overdue',
  'Follow Up', 'Shortlisted', 'Project Started', 'Project Done', 'Closed', 'Unqualified',
];

export const REPLY_STATUSES: ReplyStatus[] = [
  'Waiting...', 'Replied'
];

export const REPLY_STATUS_COLORS: Record<string, string> = {
  'Waiting...': '#c5b1ff',
  'Replied': '#00cdb6'
};

export const STATUS_COLORS: Record<string, string> = {
  'New Lead': '#abd2fa',
  'Contacted': '#7692ff',
  'Quoted': '#3d518c',
  'Failed': '#d4102d',
  'Overdue': '#1b2cc1',
  'Follow Up': '#9D4393',
  'Shortlisted': '#a159cf',
  'Project Started': '#CF6E93',
  'Project Done': '#dcb0ff',
  'Closed': '#0D1821',
  'Unqualified': '#561769',
};

export const IMPORTANCE_COLORS: Record<string, string> = {
  'High': '#e03131',
  'Medium': '#ff85a8',
  'Low': '#ffccd5'
};

export const CHANNEL_COLORS: Record<string, string> = {
  'Forms': '#82E1C2',
  'Email': '#0085FF',
  'Referral': '#00C875',
  'Direct': '#0077B5',
  'Whatsapp': '#07C160',
  'E-comm': '#008b74'
};


// ─── Client Rows ────────────────────────────────────────────────────────────────

function ClientRow({
  client, isSelected, onToggleSelect, onUpdate, onUpdateSubitem,
  onAddSubitem, onDeleteSubitem, onDelete, 
}: {
  client: Client;
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (u: Partial<Client>) => void;
  onUpdateSubitem: (subitemId: string, u: Partial<Subitem>) => void;
  onAddSubitem: () => void;
  onDeleteSubitem: (id: string) => void;
  onDelete: () => void;
}) {
  const importanceOpts = ['High', 'Medium', 'Low'];
  const channelOpts = ['Forms', 'Email', 'Referral', 'Whatsapp', 'E-comm', 'Direct'];
  const subitemCount = client.subitems.length;
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ClientStatus | null>(null);
  const [closeFiles, setCloseFiles] = useState<File[]>([]);
  const [closeConfirmed, setCloseConfirmed] = useState(false);

  const [showActivityLog, setShowActivityLog] = useState(false);

  function renderActivityText(entry: ActivityEntry) {
  if (entry.action === "field_changed") {
    return (
      <>
        changed <span className="font-medium">{entry.fieldName}</span> from{" "}
        <span className="text-gray-600">
          {String(entry.oldValue ?? "empty")}
        </span>{" "}
        to{" "}
        <span className="text-gray-600">
          {String(entry.newValue ?? "empty")}
        </span>
      </>
    );
  }

  if (entry.action === "subitem_added") {
    return <>added a subitem</>;
  }

  if (entry.action === "subitem_deleted") {
    return <>deleted a subitem</>;
  }

  return <>{entry.action}</>;
}

  return (
    <div className="mbs-3">
      <div className={`flex items-stretch border-b border-gray-100 hover:bg-gray-50 group transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>

        {/* Checkbox + expand */}
        <div className="flex items-center px-2 gap-1.5 flex-shrink-0 border-r border-gray-200" style={{ minWidth: 60, width: 60 }}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-3 h-3 rounded cursor-pointer accent-[#7BCBD5]"
          />
          <button
            onClick={() => onUpdate({ expanded: !client.expanded })}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            {client.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Client name */}
        <div className="flex items-center gap-1.5 px-1 py-2 border-r border-gray-200 flex-shrink-0" style={{height:30, minWidth: 180, width: 100 }}>
          
          <EditableCell
            value={client.name}
            onChange={v => onUpdate({ name: v })}
            placeholder="Client name"
            className="font-semibold text-gray-800"
          />
          {subitemCount > 0 && (
            <span className="text-xs text-[#7BCBD5] bg-[#e7fdff] rounded-full px-1.5 py-0.5 flex-shrink-0">{subitemCount}</span>
          )}
          <button 
          type="button"
          onClick={() => setShowActivityLog(true)}
          className= "px-2 py-1 text-[10px] font-medium text-cyan-500 hover:bg-gray-50 hover:text-cyan-600 transition transform active:scale-95 duration-150"
          > <Activity size={10} /> </button>
          {showActivityLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Activity Log
                    </h2>
                    <p className="text-xs text-gray-500">
                      {client.name}
                    </p>
                  </div>

        <button
          type="button"
          onClick={() => setShowActivityLog(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Close
        </button>
      </div>

      <div className="max-h-[420px] space-y-3 overflow-y-auto">
        {(client.activityLog?.length ?? 0) === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
            No activity yet.
          </div>
        ) : (
          [...(client.activityLog ?? [])]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">{entry.actorName}</span>{" "}
                      {renderActivityText(entry)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  </div>
)}
        </div>

        {/* People */}
        <div className="flex items-center px-2 border-r border-gray-200 flex-shrink-0" style={{ minWidth: 70, width: 70 }}>
          {client.people ? (
            <div className="flex gap-0.5 flex-wrap">
              {client.people.split(' ').map((p, i) => (
                <div key={i} className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: ['#845ec2', '#2c73d2', '#0081cf', '#0089ba'][i % 4] }}>
                  {p[0]}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-6 h-6 rounded-sm border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-400">
              <Plus size={9} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* Reply Status */}
        <div className="flex items-center px-2 border-r border-gray-200 transition transform active:scale-95 duration-150" style={{ minWidth: 90, width: 90 }}>
          <StatusBadge
            value={client.replyStatus}
            onChange={v => onUpdate({ replyStatus: v as ReplyStatus })}
            options={REPLY_STATUSES}
            colorMap={REPLY_STATUS_COLORS}
          />
        </div>

        {/* Follow Up */}
        <div className="flex items-center px-2 border-r border-gray-200 transition transform active:scale-95 duration-150" style={{ minWidth: 100, width: 100 }}>
          <input type="date" value={client.followUp} onChange={e => onUpdate({ followUp: e.target.value })}
            className="text-xs border-none outline-none bg-transparent cursor-pointer w-full" />
        </div>

        {/* Status */}
        <div className="flex items-center px-2 border-r border-gray-200 flex-shrink-0 transition transform active:scale-95 duration-150" style={{ minWidth: 115, width: 115 }}>
          <StatusBadge
            value={client.status}
            onChange={(v) => {
              const nextStatus = v as ClientStatus;

              if (nextStatus=="Closed"){
                setPendingStatus(nextStatus);
                setCloseFiles([]);
                setCloseConfirmed(false);
                setShowCloseDialog(true);
                return;
              }
              onUpdate({ status: nextStatus });
            }
            }
            options={CLIENT_STATUSES}
            colorMap={STATUS_COLORS}
          />
          <AlertDialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Close this client?</AlertDialogTitle>
      <AlertDialogDescription>
        Please upload the required files and confirm before marking this client as Closed.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <div className="space-y-4 py-2">
      <div>
        <label className="text-sm font-medium">Upload purchase order</label>
        <input
          type="file"
          multiple
          className="file:rounded-md file:border-0 file:font-semibold file:bg-[#7BCBD5] file:text-[#ffffff] hover:file:bg-[#6db6bf] file:mr-4 mt-2 block text-sm transition transform active:scale-95 duration-150"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setCloseFiles(files);
          }}
        />
        <br />
        <label className="text-sm font-medium">Upload signed quotation</label>
        <input
          type="file"
          multiple
          className="file:rounded-md file:border-0 file:font-semibold file:bg-[#7BCBD5] file:text-[#ffffff] hover:file:bg-[#6db6bf] file:mr-4 mt-2 block text-sm transition transform active:scale-95 duration-150"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setCloseFiles(files);
          }}
        />
        <br />
        <label className="text-sm font-medium">Upload proof of payment</label>
        <input
          type="file"
          multiple
          className="file:rounded-md file:border-0 file:font-semibold file:bg-[#7BCBD5] file:text-[#ffffff] hover:file:bg-[#6db6bf] file:mr-4 mt-2 block text-sm transition transform active:scale-95 duration-150"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setCloseFiles(files);
          }}
        />
        {closeFiles.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 font-semibold">
            {closeFiles.length} file(s) selected
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold transition transform active:scale-95 duration-150">
        <input
          type="checkbox"
          checked={closeConfirmed}
          onChange={(e) => setCloseConfirmed(e.target.checked)}
        />
        OCF signed?
      </label>
    </div>

    <AlertDialogFooter>
      <AlertDialogCancel
        onClick={() => {
          setPendingStatus(null);
          setCloseFiles([]);
          setCloseConfirmed(false);
        }}
      > 
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={(e) => {
          if (!closeFiles.length || !closeConfirmed || pendingStatus !== "Closed") {
            e.preventDefault();
            return;
          }

          onUpdate({
            status: "Closed",
            // future: store metadata too
            // closedFiles: closeFiles,
            // closedAt: new Date().toISOString(),
          });

          setShowCloseDialog(false);
          setPendingStatus(null);
          setCloseFiles([]);
          setCloseConfirmed(false);
        }}
      >
        Confirm Close
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </div>

        {/* Channel */}
        <div className="flex items-center px-2 border-r border-gray-200 flex-shrink-0 transition transform active:scale-95 duration-150" style={{ minWidth: 90, width: 90 }}>
          <StatusBadge value={client.channel} onChange={v => onUpdate({ channel: v })} options={channelOpts} colorMap={CHANNEL_COLORS} small />
        </div>

        {/* Importance */}
        <div className="flex items-center px-2 border-r border-gray-200 flex-shrink-0 transition transform active:scale-95 duration-150" style={{ minWidth: 80, width: 80 }}>
          <StatusBadge value={client.importance} onChange={v => onUpdate({ importance: v })} options={importanceOpts} colorMap={IMPORTANCE_COLORS} small />
        </div>

        {/* Company */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 170, width: 170 }}>
          <EditableCell value={client.company} onChange={v => onUpdate({ company: v })} placeholder="Company" />
        </div>

        {/* Email */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 180, width: 180 }}>
          <EditableCell value={client.email} onChange={v => onUpdate({ email: v })} placeholder="Email" />
        </div>

        {/* Phone */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 120, width: 120 }}>
          <EditableCell value={client.phone} onChange={v => onUpdate({ phone: v })} placeholder="Phone" />
        </div>

        {/* Requirements */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 160, width: 160 }}>
          <EditableCell value={client.requirements} onChange={v => onUpdate({ requirements: v })} placeholder="Requirements" />
        </div>

        {/* Qty */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 60, width: 60 }}>
          <EditableCell value={client.qty} onChange={v => onUpdate({ qty: v })} type="number" />
        </div>

        {/* NBD */}
        <div className="flex items-center px-2 border-r border-gray-200 transition transform active:scale-95 duration-150" style={{ minWidth: 100, width: 100 }}>
            <input type="date" value={client.followUp} onChange={e => onUpdate({ followUp: e.target.value })}
            className="text-xs border-none outline-none bg-transparent cursor-pointer w-full" />
        </div>

        {/* Total Price */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 90, width: 90 }}>
          <EditableCell value={client.totalPrice} onChange={v => onUpdate({ totalPrice: v })} />
        </div>

        {/* Company Address */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 115, width: 115 }}>
          <EditableCell value={client.companyAddress} onChange={v => onUpdate({ companyAddress: v })} />
        </div>
        
        {/* Billing Address */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 115, width: 115 }}>
          <EditableCell value={client.billingAddress} onChange={v => onUpdate({ billingAddress: v })} />
        </div>

        {/* Date Created */}
        <div className="flex items-center px-2 border-r border-gray-200" style={{ minWidth: 120, width: 120 }}>
          <EditableCell value={client.dateCreated} onChange={v => onUpdate({ dateCreated: v })} />
        </div>


        {/* Delete — always visible */}
        <div className="flex items-center px-2 flex-shrink-0" style={{ minWidth: 36, width: 36 }}>
          <button
            onClick={onDelete}
            title="Delete client"
            className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {client.expanded && (
        <SubitemsTable
          clientId={client.id}
          subitems={client.subitems}
          clientColor={'#7BCBD5'}
          onUpdateSubitem={onUpdateSubitem}
          onAddSubitem={onAddSubitem}
          onDeleteSubitem={onDeleteSubitem}
        />
      )}
    </div>
  );
}

// ─── CRMBoard ─────────────────────────────────────────────────────────────────

const CLIENT_HEADER_COLS = [
  { label: '', width: 60 },            // checkbox + expand
  { label: 'Client', width: 180 },
  { label: 'People', width: 70 },
  { label: 'Reply Status', width: 90 },
  { label: 'Follow Up', width: 100 },
  { label: 'Status', width: 115 },
  { label: 'Channel', width: 90 },
  { label: 'Importance', width: 80 },
  { label: 'Company', width: 170 },
  { label: 'Email', width: 180 },
  { label: 'Phone', width: 120 },
  { label: 'Requirements', width: 160 },
  { label: 'Qty', width: 60 },
  { label: 'NBD', width: 100 },
  { label: 'Total Price', width: 90 },
  { label: 'Company Address', width: 115 },
  { label: 'Billing Address', width: 120 },
  { label: 'Date Created', width: 90 },
  { label: '', width: 60 },            // delete button column
];

const TOTAL_MIN_WIDTH = CLIENT_HEADER_COLS.reduce((s, c) => s + c.width, 0);

interface CRMBoardProps {
  clients: Client[];
  onUpdateClients: (clients: Client[]) => void;
  search?: string;
}

export function CRMBoard({ clients, onUpdateClients, search='' }: CRMBoardProps) {
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'All'>('All');
  const [showFilter, setShowFilter] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null);

  const displayedClients = clients.filter((client) => {
    const matchesStatus =
      filterStatus === 'All' || client.status === filterStatus;

    const q = (search ?? '').trim().toLowerCase();
    const matchesSearch =
      !q ||
      client.name.toLowerCase().includes(q) ||
      client.people.toLowerCase().includes(q) ||
      client.company.toLowerCase().includes(q) ||
      client.subitems.some((subitem) =>
        (subitem.name ?? '').toLowerCase().includes(q)
      );

    return matchesStatus && matchesSearch;
  });
  const GROUP_ORDER = [
    "New Lead", 
    "Contacted",
    "Quoted",
    "Failed",
    "Overdue",
    "Follow Up",
    "Shortlisted",
    "Project Started",
    "Project Done",
    "Closed",
    "Unqualified"
  ];
  const groupedClients = GROUP_ORDER.map((status) => ({
    status,
    clients: displayedClients.filter((client) => client.status === status),
    })).filter((group) => group.clients.length > 0);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupStatus: string) => {
    setCollapsedGroups((prev) => ({
    ...prev,
    [groupStatus]: !prev[groupStatus],
  }));
};

  useEffect(() => {
    if (!showFilter) return;
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [showFilter]);

  const filteredClients = filterStatus === 'All'
    ? clients
    : clients.filter(c => c.status === filterStatus);

  // ── selection helpers ──
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const allFilteredSelected = filteredClients.length > 0 && filteredClients.every(c => selectedIds.has(c.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredClients.forEach(c => next.delete(c.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredClients.forEach(c => next.add(c.id));
        return next;
      });
    }
  };

  const deleteSelected = () => {
    onUpdateClients(clients.filter(c => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  };

  // ── client/subitem updates ──
  const updateClient = useCallback(async (clientId: string, updates: Partial<Client>) => {
    
    const actorName = await getCurrentActorName();

    onUpdateClients( 
    clients.map((client) => {
      if (client.id !== clientId) return client;

      const newEntries = Object.entries(updates)
        .filter(([field, newValue]) => client[field as keyof Client] !== newValue)
        .map(([field, newValue]) => ({
          id: crypto.randomUUID(),
          action: "field_changed",
          fieldName: field,
          oldValue: client[field as keyof Client],
          newValue,
          actorName,
          createdAt: new Date().toISOString(),
        }));

      return {
        ...client,
        ...updates,
        activityLog: [...(client.activityLog ?? []), ...newEntries],
      };
    })
  );
}, [clients, onUpdateClients]);

  const updateSubitem = useCallback((clientId: string, subitemId: string, updates: Partial<Subitem>) => {
    onUpdateClients(clients.map(c =>
      c.id !== clientId ? c
        : { ...c, subitems: c.subitems.map(s => s.id === subitemId ? { ...s, ...updates } : s) }
    ));
  }, [clients, onUpdateClients]);

  const addSubitem = useCallback((clientId: string) => {
    const now = Date.now();
    const timelineRows: TimelineRow[] = [
      { id: `tl-${now}-1`, name: 'Sample', person: '',  remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '',   status: '' },
      { id: `tl-${now}-2`, name: 'Production', person: '',  remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Sample',  status: '' },
      { id: `tl-${now}-3`, name: 'Check Production Status (+3 from production start)', person: '',   subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '',   status: '', remarks:'' },
      { id: `tl-${now}-4`, name: 'Local Shipping', person: '',  remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Production FS-1',   status: '' },
      { id: `tl-${now}-5`, name: 'Sea/Air Freight', person: '',  remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Local Shipping',   status: '' },
      { id: `tl-${now}-6`, name: 'Check Shipment Status (+3 from shipment start)', person: '',   subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '', remarks: '',  status: '' },
      { id: `tl-${now}-7`, name: 'NBD', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '',  status: '' },
    ];
    const sampleRows: SampleRow[] = [
      
    ];
    const newSubitem: Subitem = {
      id: `s-${now}`, name: 'New Item', people: '', status: '', qty: '', description: '',
      supplier: '', cost: '', manpower: '', ls: '', os: '', tc: '', uc: '', tcSgd: '', price: '', up: '',
      owner: '', shipper: '', paymentStatus: '', total: '', lsRmb: '', totalC: '',
      modeOfPayment: '', orderNumber: '', quantityProduced: '', sample: '', qtyFor: '',
      paymentAmount: '', difference: '', paymentRemarks: '', numOfCartons:'', cnTracking:'', sgTracking:'', localOverseas:'Local', remarks:'', sampleOrderStatus:'',
      timelineRows, showTimeline: false, showPayments: false, sampleRows, sampleStatus:'', sampleType:'', showSample: false,
    };
    onUpdateClients(clients.map(c => c.id === clientId ? { ...c, subitems: [...c.subitems, newSubitem] } : c));
  }, [clients, onUpdateClients]);

  const deleteSubitem = useCallback((clientId: string, subitemId: string) => {
    onUpdateClients(clients.map(c =>
      c.id === clientId ? { ...c, subitems: c.subitems.filter(s => s.id !== subitemId) } : c
    ));
  }, [clients, onUpdateClients]);

  const deleteClient = useCallback((clientId: string) => {
    onUpdateClients(clients.filter(c => c.id !== clientId));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(clientId); return n; });
  }, [clients, onUpdateClients]);

  const addClient = useCallback(() => {
    const colors = ['#845ec2', '#2c73d2', '#0081cf', '#0089ba', '#008e9b', '#008f7a', '#4e8397'];
    const newClient: Client = {
      id: `c-${Date.now()}`, name: 'New Client', people: '', replyStatus: '',
      followUp: '',  status: 'New Lead', channel: '', importance: '',
      company: '', email: '', phone: '', requirements: '', qty: '', nbd: '', totalPrice: '',
      companyAddress: '', billingAddress: '', dateCreated: '', expanded: true,
      color: colors[clients.length % colors.length], subitems: [],
    };
    onUpdateClients([...clients, newClient]);
  }, [clients, onUpdateClients]);

  const toggleExpandAll = () => {
    const next = !allExpanded;
    setAllExpanded(next);
    onUpdateClients(clients.map(c => ({ ...c, expanded: next })));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white flex-shrink-0">
          <button
          onClick={addClient}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7BCBD5] hover:bg-[#61a5ad] text-white rounded-md text-xs font-medium transition-colors"
          >
          <Plus size={13} />Add Client
        </button>
        <button
          onClick={toggleExpandAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7BCBD5] hover:bg-[#61a5ad] text-white rounded-md text-xs font-medium transition-colors"
        >
          {allExpanded ? <ChevronsUp size={14} /> : <ChevronsDown size={14} />}
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </button>

        {/* Filter */}
        <div ref={filterRef} className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7BCBD5] hover:bg-[#61a5ad] text-white rounded-md text-xs font-medium transition-colors"
          >
            <Filter size={13} />
            {filterStatus === 'All' ? 'Filter by Status' : filterStatus}
            <ChevronDown size={11} />
          </button>
          {showFilter && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-44 py-1 max-h-80 overflow-y-auto">
              <button
                onClick={() => { setFilterStatus('All'); setShowFilter(false); }}
                className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                <span className="w-2.5 h-2.5 rounded-sm bg-gray-300" />
                All Clients
                {filterStatus === 'All' && <span className="ml-auto text-blue-500">✓</span>}
              </button>
              <div className="border-t border-gray-100 my-1" />
              {CLIENT_STATUSES.map(st => (
                <button
                  key={st}
                  onClick={() => { setFilterStatus(st); setShowFilter(false); }}
                  className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                >
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: STATUS_COLORS[st] }} />
                  <span className="flex-1">{st}</span>
                  <span className="text-gray-400">{clients.filter(c => c.status === st).length}</span>
                  {filterStatus === st && <span className="text-blue-500 ml-1">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status pills beside filter by status */}
        <div className="flex items-center gap-1">
          {CLIENT_STATUSES.map(st => {
            const count = clients.filter(c => c.status === st).length;
            if (!count) return null;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(filterStatus === st ? 'All' : st)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-opacity transition transform active:scale-95 duration-150"
                style={{
                  background: STATUS_COLORS[st],
                  color: ['#FFCB00', '#BFCC94', '#abd2fa'].includes(STATUS_COLORS[st]) ? '#ffffff' : '#fff',
                  opacity: filterStatus !== 'All' && filterStatus !== st ? 0.35 : 1,
                }}>
                {st}<span className="bg-white/30 rounded-full px-1">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Bulk delete — visible when rows are selected */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-1.5">
            <span className="text-xs text-red-600 font-medium">{selectedIds.size} selected</span>
            <button
              onClick={deleteSelected}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-semibold transition-colors"
            >
              <Trash2 size={12} />Delete
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear selection"
            >
              <X size={13} />
            </button>
          </div>
        )}


      </div>

      {/* ── Board (header + rows share one scroll container) ── */}
      <div className="flex-1 overflow-auto text-gray-500 font-semibold">
        <div style={{ minWidth: TOTAL_MIN_WIDTH }}>

          {/* Sticky column header */}
          <div
            className="flex items-center flex-shrink-0 border-b border-gray-200 animated-background bg-gradient-to-r from-[#e7fdff] to-[#a3dfff] sticky top-0 z-10" // edit here 
            style={{ minWidth: TOTAL_MIN_WIDTH }}
          >
            {/* Select-all checkbox in first header cell */}
            <div className="flex items-center px-2 gap-1.5 flex-shrink-0 border-r border-gray-200" style={{ minWidth: 60, width: 60 }}>
              <input
                type="checkbox"
                checked={allFilteredSelected}
                onChange={toggleSelectAll}
                className="w-3 h-3 rounded cursor-pointer accent-[#7BCBD5]"
                title={allFilteredSelected ? 'Deselect all' : 'Select all'}
              />
            </div>
            {CLIENT_HEADER_COLS.slice(1).map((col, i) => (
              <div
                key={i}
                className="flex items-center px-2 py-1.5 border-r border-gray-200 last:border-r-0 text-xs font-semibold text-gray-500 whitespace-nowrap flex-shrink-0"
                style={{ minWidth: col.width, width: col.width }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Client group headers */}
          {groupedClients.map((group) => (
          <React.Fragment key={group.status}>
          <div className="flex items-center gap-2.5 px-2 py-0.4 text-sm bg-gray-50 border-y border-gray-100">
            <button
            onClick={() => toggleGroup(group.status)}
            className="text-sm text-gray-500"
          >
            {collapsedGroups[group.status] ? '▷' : '▼'}
            </button>
      <div className="h-5 w-1 rounded bg-[#7BCBD5]" />
      <div>
        <div className="font-semibold text-slate-700">{group.status}</div>
        <div className="text-xs italic font-normal text-slate-500">
          {group.clients.length} Clients
        </div>
      </div>
    </div>

    {!collapsedGroups[group.status] &&
      group.clients.map((client) => (
        <ClientRow
          key={client.id}
          client={client}
          isSelected={selectedIds.has(client.id)}
          onToggleSelect={() => toggleSelect(client.id)}
          onUpdate={(updates) => updateClient(client.id, updates)}
          onUpdateSubitem={(subitemId, updates) =>
            updateSubitem(client.id, subitemId, updates)
          }
          onAddSubitem={() => addSubitem(client.id)}
          onDeleteSubitem={(subitemId) => deleteSubitem(client.id, subitemId)}
          onDelete={() => deleteClient(client.id)}
          />
          ))}
        </React.Fragment> 
        ))}
        </div>
      </div>
    </div>
  );
}
