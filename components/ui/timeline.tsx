'use client';
import { TimelineRow } from '../../app/types';
import { EditableCell } from './editablecell';
import { Calendar } from 'lucide-react';
import { StatusBadge } from './statusbadge';

const TIMELINE_PROGRESS_COLORS: Record<string, string> = {
    'Done': '#00C875',
    'Started': '#24e2e8',
    'Pending': '#e3d4ff',
    'Overdue':'#d44858',
};

export const DEFAULT_TIMELINE_ROWS = [
    {
        id: 'sample',
        name: 'Sample',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: '',
    },
    {
        id: 'production',
        name: 'Production 📦',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: 'Sample',
    },
    {
        id: 'productionstatus',
        name: 'Check Production Status  (+3 from production start)',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: '',
    },
    {
        id: 'localshipping',
        name: 'Local Shipping 🚚',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: 'Production 📦',
    },
    {
        id: 'seaairfreight',
        name: 'Sea/Air Freight ⛵✈️',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: 'Local Shipping 🚚',
    },
    {
        id: 'shipmentstatus',
        name: 'Check Shipment Status (+3 from shipment start)',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: '',
    },
    {
        id: 'nbd',
        name: 'NBD',
        person: '',
        remarks: '',
        numOfCartons: '',
        subProgress: 'Pending',
        timelineStart: '',
        timelineEnd: '',
        duration: '',
        dependency: '',
    },
];
export function TimelineSection({ rows, onUpdate }: {
    rows: TimelineRow[]; onUpdate: (rows: TimelineRow[]) => void;
}) {
    const updateRow = (id: string, field: keyof TimelineRow, val: string) =>
        onUpdate(rows.map(r => r.id === id ? { ...r, [field]: val } : r));

    const progressOpts = ['Pending', 'Started', 'Done', 'Overdue'];

    return (
        <div className="ml-8 mr-2 mb-2 w-fit max-w-[1500px] overflow-hidden border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#9bd9e0] to-[#7BCBD5] px-3 py-1.5 flex items-center gap-2">
                <Calendar size={12} className="text-white" />
                <span className="text-white text-xs font-semibold">Project Timeline</span>
            </div>
            <div className="max-w-full overflow-x-auto">
                <table className="table-fixed border-collapse" style={{ minWidth: 200, maxWidth:500 }}>
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {[
                                { label: 'Subitem', w: 300 }, { label: 'Person', w: 30 },
                                { label: 'Remarks', w: 200 },{ label: 'No. of Cartons', w: 30 }, { label: 'Sub-Progress', w: 100 },
                                { label: 'Timeline', w: 100 }, { label: 'Duration', w: 70 },
                                { label: 'Dependency', w: 100 }
                            ].map(col => (
                                <th key={col.label} style={{ minWidth: col.w }}
                                    className="text-left px-2 py-1 text-xs font-semibold text-gray-500 whitespace-nowrap border-r border-gray-100 last:border-r-0">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => {
                            const progColor = TIMELINE_PROGRESS_COLORS[row.subProgress] || '#e5e7eb';
                            const textColor = row.subProgress === 'Done' || row.subProgress === 'Started' ? '#fff' : '#333';
                            return (
                                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <span className="text-xs text-gray-700">{row.name}</span>
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <EditableCell value={row.person} onChange={v => updateRow(row.id, 'person', v)} />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <EditableCell value={row.remarks} onChange={v => updateRow(row.id, 'remarks', v)} />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <EditableCell value={row.numOfCartons ?? ''} onChange={v => updateRow(row.id, 'numOfCartons', v)} type='Number' />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <StatusBadge
                                            value={row.subProgress || 'Pending'}
                                            onChange={v => updateRow(row.id, 'subProgress', v)}
                                            options={progressOpts}
                                            colorMap={TIMELINE_PROGRESS_COLORS}
                                            small
                                        />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <div className="flex gap-1">
                                            <input
                                                type="date"
                                                value={row.timelineStart || ''}
                                                onChange={e => updateRow(row.id, 'timelineStart', e.target.value)}
                                                className="text-xs border border-gray-200 rounded px-1 py-1 bg-white w-32 cursor-pointer"
                                            />
                                            <input
                                                type="date"
                                                value={row.timelineEnd || ''}
                                                onChange={e => updateRow(row.id, 'timelineEnd', e.target.value)}
                                                className="text-xs border border-gray-200 rounded px-1 py-1 bg-white w-32 cursor-pointer"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <EditableCell value={row.duration} onChange={v => updateRow(row.id, 'duration', v)} />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        <EditableCell value={row.dependency} onChange={v => updateRow(row.id, 'dependency', v)} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}