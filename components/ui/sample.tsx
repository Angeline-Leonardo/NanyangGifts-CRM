"use client";
import { Package } from "lucide-react";
import { Subitem } from "../../app/types";
import { StatusBadge } from "./statusbadge";
import { SAMPLE_ORDER_STATUS_COLORS, SAMPLE_STATUS_COLORS, SAMPLE_TYPE_COLORS } from "../CRMBoard";

export function SamplesSection({ subitem, onUpdate }: { subitem: Subitem; onUpdate: (u: Partial<Subitem>) => void }) {
    const sampleOrderStatusOpts = ['Pending', 'To order', 'Ordered', 'Delivered', 'Paid', 'Shipped', 'Failed']
    const sampleStatusOpts = ['Ready to collect', 'Return arranged', 'Extended', 'Chased', 'Must return', 'Request to not return', 'No return needed', 'Failed', 'Returned'];
    const sampleTypeOpts = ['Product sample', 'Pre-production sample'];

    const cols = [
        'Order Status', 'Return Status', 'Type', 'Return By Date', 'Sent Date', 'Returned Date',
    ];

    return (
        <div className="ml-8 mr-2 mb-2 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="bg-gradient-to-r from-[#d5a5ec] to-[#ac7ec2] px-3 py-1.5 flex items-center gap-2">
                <Package size={12} className="text-white" />
                <span className="text-white text-xs font-semibold">Sample Details — {subitem.name}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse" style={{ minWidth: 60 }}>
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {cols.map(col => (
                                <th key={col} style={{ minWidth: ['Status', 'Type'].includes(col) ? 60 : 50 }}
                                    className="text-left px-2 py-1 text-xs font-semibold text-gray-500 whitespace-nowrap border-r border-gray-100 last:border-r-0">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-2 py-1 border-r border-gray-100">
                                <StatusBadge value={subitem.sampleOrderStatus} onChange={v => onUpdate({ sampleOrderStatus: v })} options={sampleOrderStatusOpts} colorMap={SAMPLE_ORDER_STATUS_COLORS} small />
                            </td>
                            <td className="px-2 py-1 border-r border-gray-100">
                                <StatusBadge value={subitem.sampleStatus} onChange={v => onUpdate({ sampleStatus: v })} options={sampleStatusOpts} colorMap={SAMPLE_STATUS_COLORS} small />
                            </td>
                            <td className="px-2 py-1 border-r border-gray-100">
                                <StatusBadge value={subitem.sampleType} onChange={v => onUpdate({ sampleType: v })} options={sampleTypeOpts} colorMap={SAMPLE_TYPE_COLORS} small />
                            </td>
                            <td className="px-2 py-1 border-r border-gray-100">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}