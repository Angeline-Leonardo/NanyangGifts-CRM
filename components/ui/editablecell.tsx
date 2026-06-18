"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';

export function EditableCell({
    value, onChange, type = 'text', placeholder = '–', className = '',
}: {
    value: string; onChange: (v: string) => void; type?: string;
    placeholder?: string; className?: string;
    readOnly?: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const [local, setLocal] = useState(value);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => { setLocal(value); }, [value]);
    useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

    const save = () => { onChange(local); setEditing(false); };

    if (editing) {
        return (
            <input
                ref={ref}
                type={type}
                value={local}
                onChange={e => setLocal(e.target.value)}
                onBlur={save}
                onKeyDown={e => {
                    if (e.key === 'Enter') save();
                    if (e.key === 'Escape') { setLocal(value); setEditing(false); }
                }}
                className={`w-full px-1 py-0.5 text-xs border border-blue-400 rounded outline-none bg-white ${className}`}
                style={{ minWidth: 40 }}
            />
        );
    }

    return (
        <div
            onClick={() => setEditing(true)}
            title={value}
            className={`w-full px-1 py-0.5 text-xs cursor-text hover:bg-blue-50 rounded truncate min-h-[22px] flex items-center ${className}`}
        >
            {value || <span className="text-gray-300 select-none">{placeholder}</span>}
        </div>
    );
}