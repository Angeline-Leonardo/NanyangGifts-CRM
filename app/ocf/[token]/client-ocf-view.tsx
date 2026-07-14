"use client";

import Image from "next/image";
import { useState } from "react";
import SignatureForm from "./signature-form";
import logo from "./nanyanggifts-gifts-and-merch.png";

type OcfItem = {
    id: string;
    qty: string | number | null;
    item_name: string | null;
    remarks: string | null;
    image_path: string | null;
    image_url: string | null;
};

type Ocf = {
    id: string;
    client_token: string;
    status: string | null;
    generated_at: string | null;
    estimated_delivery_notes: string | null;
    important_notes: string | null;
    client_name_snapshot: string | null;
    company_snapshot: string | null;
    delivery_address: string | null;
    client_contact_number: string | null;
    recipient_name: string | null;
    salesperson_name: string | null;
    salesperson_email: string | null;
    salesperson_contact_number: string | null;
    client_signed_at: string | null;
    client_submitted_at: string | null;
    client_ip: string | null;
    locked_at: string | null;
    remarks_for_delivery: string | null;
    restricted_area: string | null;
    same_address_for_all_items: boolean | null;
    order_confirmation_items: OcfItem[];
};

export default function ClientOcfView({ ocf }: { ocf: Ocf }) {
    const isLocked =
        ocf.status === "submitted" ||
        ocf.status === "locked" ||
        Boolean(ocf.locked_at);

    const [company, setCompany] = useState(ocf.company_snapshot ?? "");
    const [deliveryAddress, setDeliveryAddress] = useState(ocf.delivery_address ?? "");
    const [contactNumber, setContactNumber] = useState(ocf.client_contact_number ?? "");
    const [recipientName, setRecipientName] = useState(ocf.recipient_name ?? "");
    const [remarksForDelivery, setRemarksForDelivery] = useState(ocf.remarks_for_delivery ?? "");
    const [restrictedArea, setRestrictedArea] = useState(ocf.restricted_area ?? "No");
    const [sameAddressForAllItems, setSameAddressForAllItems] = useState(
        Boolean(ocf.same_address_for_all_items)
    );

    return (
        <main className="min-h-screen bg-[#f3f4f6] px-4 py-8">
            <div className="mx-auto max-w-5xl bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-black pb-4">
                    <div>
                        <Image src={logo} alt="Nanyang Gifts Logo" className="h-14 w-auto object-contain" />
                        <p className="mt-2 text-sm font-semibold text-gray-800">NANYANGGIFTS PTE. LTD.</p>
                    </div>

                    <div className="text-right text-sm text-black">
                        <h1 className="text-base font-bold tracking-wide">ORDER CONFIRMATION FORM</h1>
                        <p className="mt-3">
                            <span className="font-semibold">Date:</span>{" "}
                            {ocf.generated_at ? new Date(ocf.generated_at).toLocaleDateString() : "-"}
                        </p>
                    </div>
                </div>

                <div className="mb-4 bg-[#eef2ff] px-4 py-3">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            <tr>
                                <td className="w-[18%] py-1 font-semibold text-black">Project Name:</td>
                                <td className="w-[42%] py-1 text-black">{ocf.client_name_snapshot || "-"}</td>
                                <td className="w-[18%] py-1 font-semibold text-black">Account Manager:</td>
                                <td className="w-[22%] py-1 text-left text-black">{ocf.salesperson_name || "-"}</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-semibold text-black">Client&apos;s Company Name:</td>
                                <td className="py-1 text-black">{company || "-"}</td>
                                <td className="py-1 font-semibold text-black">Contact Number:</td>
                                <td className="py-1 text-left text-black">{ocf.salesperson_contact_number || "-"}</td>
                            </tr>
                            <tr>
                                <td className="py-1 font-semibold text-black"></td>
                                <td className="py-1 text-black"></td>
                                <td className="py-1 font-semibold text-black">Email:</td>
                                <td className="py-1 text-left text-black break-all">{ocf.salesperson_email || "-"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="w-full border border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="w-[18%] border border-black px-2 py-2 font-semibold">Item Name</th>
                            <th className="w-[12%] border border-black px-2 py-2 font-semibold">Quantity</th>
                            <th className="w-[45%] border border-black px-2 py-2 font-semibold">Product Details</th>
                            <th className="w-[25%] border border-black px-2 py-2 font-semibold">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ocf.order_confirmation_items.length > 0 ? (
                            ocf.order_confirmation_items.map((item) => (
                                <tr key={item.id} className="align-top">
                                    <td className="border border-black px-2 py-3">{item.item_name || "-"}</td>
                                    <td className="border border-black px-2 py-3">{item.qty || "-"}</td>
                                    <td className="border border-black px-2 py-3">
                                        <div className="space-y-3">
                                            <div>{item.remarks || "-"}</div>
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.item_name || "Uploaded item"}
                                                    className="max-h-72 w-auto rounded border border-gray-300 object-contain"
                                                />
                                            ) : (
                                                <div className="text-gray-400">No image uploaded</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="border border-black px-2 py-3">{item.remarks || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="border border-black px-3 py-4 text-center text-gray-500">
                                    No awarded items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <table className="mt-4 w-full border border-black text-sm">
                    <tbody>
                        <tr className="border-b border-black">
                            <td className="w-56 border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Client&apos;s Company Name:
                            </td>
                            <td className="px-3 py-2">
                                <input
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    disabled={isLocked}
                                    className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Recipient Name:
                            </td>
                            <td className="px-3 py-2">
                                <input
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    disabled={isLocked}
                                    className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold align-top">
                                Delivery Address:
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={sameAddressForAllItems}
                                            onChange={(e) => setSameAddressForAllItems(e.target.checked)}
                                            disabled={isLocked}
                                            className="h-4 w-4"
                                        />
                                        <span>Same address for all items?</span>
                                    </label>

                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        disabled={isLocked}
                                        rows={3}
                                        className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Contact Number For Delivery:
                            </td>
                            <td className="px-3 py-2">
                                <input
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    disabled={isLocked}
                                    className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Estimated Delivery:
                            </td>
                            <td className="px-3 py-2">
                                <div className="space-y-2">
                                    <input
                                        value={ocf.estimated_delivery_notes || ""}
                                        disabled
                                        className="w-full rounded border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700"
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Remarks For Delivery:
                            </td>
                            <td className="px-3 py-2">
                                <textarea
                                    value={remarksForDelivery}
                                    onChange={(e) => setRemarksForDelivery(e.target.value)}
                                    disabled={isLocked}
                                    rows={3}
                                    className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                />
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Restricted Area?
                            </td>
                            <td className="px-3 py-2">
                                <select
                                    value={restrictedArea}
                                    onChange={(e) => setRestrictedArea(e.target.value)}
                                    disabled={isLocked}
                                    className="w-full rounded border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes, additional fees apply. Please check with salesperson.">
                                        Yes, additional fees apply. Please check with salesperson.
                                    </option>
                                </select>
                            </td>
                        </tr>

                        <tr className="border-b border-black">
                            <td className="border-r border-black bg-[#eef2ff] px-3 py-2 font-semibold">
                                Important Notes:
                            </td>
                            <td className="px-3 py-2 whitespace-pre-wrap">{ocf.important_notes || "-"}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-6">
                    {isLocked ? (
                        <div className="space-y-2 text-sm text-gray-700">
                            <p>This form has already been submitted.</p>
                            <p>
                                <span className="font-semibold">Signed at:</span>{" "}
                                {ocf.client_signed_at ? new Date(ocf.client_signed_at).toLocaleString() : "-"}
                            </p>
                            <p>
                                <span className="font-semibold">Submitted at:</span>{" "}
                                {ocf.client_submitted_at ? new Date(ocf.client_submitted_at).toLocaleString() : "-"}
                            </p>
                            <p><span className="font-semibold">Client IP:</span> {ocf.client_ip || "-"}</p>
                        </div>
                    ) : (
                        <SignatureForm
                            ocfId={ocf.id}
                            clientToken={ocf.client_token}
                            company={company}
                            recipientName={recipientName}
                            deliveryAddress={deliveryAddress}
                            contactNumber={contactNumber}
                            remarksForDelivery={remarksForDelivery}
                            restrictedArea={restrictedArea}
                            sameAddressForAllItems={sameAddressForAllItems}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}