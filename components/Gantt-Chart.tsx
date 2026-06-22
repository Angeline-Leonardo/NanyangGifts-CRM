"use client";

import React, { useState } from "react";
import { TsGantt } from "ts-gantt";

interface TsGanttTaskModel {
    id: string; // to avoid incorrect behaviour please use unique ids within array
    parentId: string | null | undefined; // use if you need tree-like structure

    name: string;
    progress: number; // percentage from 0 to 100. higher or lower values will be truncated

    datePlannedStart: Date | null | undefined;
    datePlannedEnd: Date | null | undefined;
    dateActualStart: Date | null | undefined;
    dateActualEnd: Date | null | undefined;

    localizedNames: { [key: string]: string } | null | undefined; // eg {"en": "Name", "uk": "Ім'я", "ru": "Имя"}
}

export function TsGanttTaskModel() {
    const chart = new TsGantt('#container-selector');
    
    return (
        <div> 
            
        </div>

)
};



