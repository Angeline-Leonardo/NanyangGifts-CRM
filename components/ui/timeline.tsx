'use client';
import { TimelineRow } from '../../app/types';
import { EditableCell } from './editablecell';
import { Calendar } from 'lucide-react';
import { StatusBadge } from './statusbadge';

const TIMELINE_PROGRESS_COLORS: Record<string, string> = {
    'Done': '#00C875',
    'Started': '#00C2C7',
    'Not Started': '#8b81da'
};


export function TimelineSection({ rows, onUpdate }: {
    rows: TimelineRow[]; onUpdate: (rows: TimelineRow[]) => void;
}) {
    const updateRow = (id: string, field: keyof TimelineRow, val: string) =>
        onUpdate(rows.map(r => r.id === id ? { ...r, [field]: val } : r));

    const progressOpts = ['Not Started', 'Started', 'Done'];

    return (
        <div className="ml-8 mr-2 mb-2 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#9bd9e0] to-[#7BCBD5] px-3 py-1.5 flex items-center gap-2">
                <Calendar size={12} className="text-white" />
                <span className="text-white text-xs font-semibold">Project Timeline</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: 500 }}>
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {[
                                { label: 'Subitem', w: 60 }, { label: 'Person', w: 30 },
                                { label: 'Remarks', w: 160 }, { label: 'Sub-Progress', w: 100 },
                                { label: 'Timeline', w: 160 }, { label: 'Duration', w: 70 },
                                { label: 'Dependency', w: 120 }
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
                                        <StatusBadge
                                            value={row.subProgress || 'Not Started'}
                                            onChange={v => updateRow(row.id, 'subProgress', v)}
                                            options={progressOpts}
                                            colorMap={TIMELINE_PROGRESS_COLORS}
                                            small
                                        />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-100">
                                        {row.timelineStart && row.timelineEnd ? (
                                            <span className="text-xs text-gray-600 whitespace-nowrap">
                                                {new Date(row.timelineStart).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })}
                                                {' – '}
                                                {new Date(row.timelineEnd).toLocaleDateString('en-SG', { month: 'short', day: 'numeric' })}
                                            </span>
                                        ) : (
                                            <div className="flex gap-1">
                                                <input type="date" value={row.timelineStart}
                                                    onChange={e => updateRow(row.id, 'timelineStart', e.target.value)}
                                                    className="text-xs border-none outline-none bg-transparent w-20 cursor-pointer" />
                                                <input type="date" value={row.timelineEnd}
                                                    onChange={e => updateRow(row.id, 'timelineEnd', e.target.value)}
                                                    className="text-xs border-none outline-none bg-transparent w-20 cursor-pointer" />
                                            </div>
                                        )}
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