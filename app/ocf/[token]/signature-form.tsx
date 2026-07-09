"use client";

import { useRef, useState } from "react";

type Props = {
    ocfId: string;
    clientToken: string;
    company: string;
    recipientName: string;
    deliveryAddress: string;
    contactNumber: string;
    remarksForDelivery: string;
    restrictedArea: string;
    sameAddressForAllItems: boolean;
};

export default function SignatureForm({
    ocfId,
    clientToken,
    company,
    recipientName,
    deliveryAddress,
    contactNumber,
    remarksForDelivery,
    restrictedArea,
    sameAddressForAllItems
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function getCtx() {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.getContext("2d");
    }

    function startDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setDrawing(true);
    }

    function draw(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#111827";
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDrawing() {
        setDrawing(false);
    }

    function clearSignature() {
        const canvas = canvasRef.current;
        const ctx = getCtx();
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setError(null);
    }

    async function submitSignature() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const signatureDataUrl = canvas.toDataURL("image/png");

        if (signatureDataUrl.length < 2000) {
            setError("Please provide a signature before submitting.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch("/api/order-confirmations/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ocfId,
                    clientToken,
                    signatureDataUrl,
                    company,
                    recipientName,
                    deliveryAddress,
                    contactNumber,
                    remarksForDelivery,
                    restrictedArea,
                    sameAddressForAllItems
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.error || "Failed to submit form");
            }

            setDone(true);
        } catch (err: any) {
            setError(err.message || "Failed to submit form");
        } finally {
            setSubmitting(false);
        }
    }

    if (done) {
        return (
            <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Signature submitted successfully. This form is now locked.
            </div>
        );
    }

    return (
        <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                Client signature
            </label>

            <canvas
                ref={canvasRef}
                width={520}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full rounded-lg border border-gray-300 bg-white"
            />

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-3 flex gap-3">
                <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Clear
                </button>

                <button
                    type="button"
                    onClick={submitSignature}
                    disabled={submitting}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    );
}