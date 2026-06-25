// fetches clients with nested subitems
// map db rows to client
// map client/subitem updates back into db column names
// expose crud functions
import { createClient } from '@/lib/supabase/client';
import type { Client, Subitem } from '@/app/types';

const supabase = createClient();

type Subitems = {
    id: string;
    client_id: string;
    name: string | null;
    people: string | null;
    status: string | null;
    local_overseas: string | null;
    qty: string | null;
    description: string | null;
    remarks: string | null;
    shipper: string | null;
    supplier: string | null;
    cost: string | null;
    manpower: string | null;
    ls: string | null;
    os: string | null;
    tc: string | null;
    uc: string | null;
    tc_sgd: string | null;
    price: string | null;
    up: string | null;
    num_of_cartons: string | null;
    cn_tracking: string | null;
    sg_tracking: string | null;
    owner: string | null;
    payment_status: string | null;
    total: string | null;
    ls_rmb: string | null;
    total_c: string | null;
    mode_of_payment: string | null;
    order_number: string | null;
    quantity_produced: string | null;
    sample: string | null;
    qty_for: string | null;
    payment_amount: string | null;
    difference: string | null;
    payment_remarks: string | null;
    timeline_rows: any[] | null;
    show_timeline: boolean | null;
    show_payments: boolean | null;
    show_sample: boolean | null;
    sample_rows: any[] | null;
    sample_order_status: string | null;
    sample_status: string | null;
    sample_type: string | null;
};

type Clients = {
    id: string;
    name: string | null;
    people: string | null;
    reply_status: string | null;
    follow_up: string | null;
    status: string | null;
    channel: string | null;
    importance: string | null;
    company: string | null;
    email: string | null;
    phone: string | null;
    requirements: string | null;
    qty: string | null;
    nbd: string | null;
    total_price: string | null;
    company_address: string | null;
    billing_address: string | null;
    date_created: string | null;
    expanded: boolean | null;
    color: string | null;
    activity_log: any[] | null;
    subitems?: Subitems[];
};

function mapSubitems(row: Subitems): Subitem {
    return {
        id: row.id,
        name: row.name ?? '',
        people: row.people ?? '',
        status: row.status ?? '',
        localOverseas: row.local_overseas ?? 'Local',
        qty: row.qty ?? '',
        description: row.description ?? '',
        remarks: row.remarks ?? '',
        shipper: row.shipper ?? '',
        supplier: row.supplier ?? '',
        cost: row.cost ?? '',
        manpower: row.manpower ?? '',
        ls: row.ls ?? '',
        os: row.os ?? '',
        tc: row.tc ?? '',
        uc: row.uc ?? '',
        tcSgd: row.tc_sgd ?? '',
        price: row.price ?? '',
        up: row.up ?? '',
        numOfCartons: row.num_of_cartons ?? '',
        cnTracking: row.cn_tracking ?? '',
        sgTracking: row.sg_tracking ?? '',
        owner: row.owner ?? '',
        paymentStatus: row.payment_status ?? '',
        total: row.total ?? '',
        lsRmb: row.ls_rmb ?? '',
        totalC: row.total_c ?? '',
        modeOfPayment: row.mode_of_payment ?? '',
        orderNumber: row.order_number ?? '',
        quantityProduced: row.quantity_produced ?? '',
        sample: row.sample ?? '',
        qtyFor: row.qty_for ?? '',
        paymentAmount: row.payment_amount ?? '',
        difference: row.difference ?? '',
        paymentRemarks: row.payment_remarks ?? '',
        timelineRows: row.timeline_rows ?? [],
        showTimeline: row.show_timeline ?? false,
        showPayments: row.show_payments ?? false,
        showSample: row.show_sample ?? false,
        sampleRows: row.sample_rows ?? [],
        sampleOrderStatus: row.sample_order_status ?? '',
        sampleStatus: row.sample_status ?? '',
        sampleType: row.sample_type ?? '',
    };
}

function mapClients(row: Clients): Client {
    return {
        id: row.id,
        name: row.name ?? '',
        people: row.people ?? '',
        replyStatus: row.reply_status ?? '',
        followUp: row.follow_up ?? '',
        status: (row.status as Client['status']) ?? 'New Lead',
        channel: row.channel ?? '',
        importance: row.importance ?? '',
        company: row.company ?? '',
        email: row.email ?? '',
        phone: row.phone ?? '',
        requirements: row.requirements ?? '',
        qty: row.qty ?? '',
        nbd: row.nbd ?? '',
        totalPrice: row.total_price ?? '',
        companyAddress: row.company_address ?? '',
        billingAddress: row.billing_address ?? '',
        dateCreated: row.date_created ?? '',
        expanded: row.expanded ?? false,
        color: row.color ?? '#7BCBD5',
        activityLog: row.activity_log ?? [],
        subitems: (row.subitems ?? []).map(mapSubitems),
    };
}
// client functions

export async function fetchClientsWithSubitems() {
    const { data, error } = await supabase
        .from('clients')
        .select(`
      *,
        subitems (*)
    `)
        .order('date_created', { ascending: false });

    if (error) {console.error('fetchClientsWithSubitems error:', error);
                throw error;
            }

    return (data ?? []).map((row) => mapClients(row as Clients));
}
export async function createClientRow() {
    const { data, error } = await supabase
        .from('clients')
        .insert({
            name: 'New Client',
            people: '',
            reply_status: '',
            follow_up: '',
            status: 'New Lead',
            channel: '',
            importance: '',
            company: '',
            email: '',
            phone: '',
            requirements: '',
            qty: '',
            nbd: '',
            total_price: '',
            company_address: '',
            billing_address: '',
            date_created: '',
            expanded: true,
            color: '#7BCBD5',
            activity_log: [],
        })
        .select('*')
        .single();

    if (error) throw error;
    return data;
}

export async function updateClientRow(clientId: string, updates: Partial<Client>) {
    const payload = {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.people !== undefined ? { people: updates.people } : {}),
        ...(updates.replyStatus !== undefined ? { reply_status: updates.replyStatus } : {}),
        ...(updates.followUp !== undefined ? { follow_up: updates.followUp } : {}),
        ...(updates.status !== undefined ? { status: updates.status } : {}),
        ...(updates.channel !== undefined ? { channel: updates.channel } : {}),
        ...(updates.importance !== undefined ? { importance: updates.importance } : {}),
        ...(updates.company !== undefined ? { company: updates.company } : {}),
        ...(updates.email !== undefined ? { email: updates.email } : {}),
        ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
        ...(updates.requirements !== undefined ? { requirements: updates.requirements } : {}),
        ...(updates.qty !== undefined ? { qty: updates.qty } : {}),
        ...(updates.nbd !== undefined ? { nbd: updates.nbd } : {}),
        ...(updates.totalPrice !== undefined ? { total_price: updates.totalPrice } : {}),
        ...(updates.companyAddress !== undefined ? { company_address: updates.companyAddress } : {}),
        ...(updates.billingAddress !== undefined ? { billing_address: updates.billingAddress } : {}),
        ...(updates.dateCreated !== undefined ? { date_created: updates.dateCreated } : {}),
        ...(updates.expanded !== undefined ? { expanded: updates.expanded } : {}),
        ...(updates.color !== undefined ? { color: updates.color } : {}),
        ...(updates.activityLog !== undefined ? { activity_log: updates.activityLog } : {}),
    };

    const { error } = await supabase
        .from('clients')
        .update(payload)
        .eq('id', clientId);

    if (error) throw error;
}

export async function deleteClientRow(clientId: string) {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

    if (error) throw error;
}

// subitem functions
export async function createSubitemRow(clientId: string) {
    const timelineRows = [
        { id: crypto.randomUUID(), name: 'Sample', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '', status: '' },
        { id: crypto.randomUUID(), name: 'Production 📦', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Sample', status: '' },
        { id: crypto.randomUUID(), name: 'Check Production Status (+3 from production start)', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '', status: '' },
        { id: crypto.randomUUID(), name: 'Local Shipping 🚚', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Production FS-1', status: '' },
        { id: crypto.randomUUID(), name: 'Sea/Air Freight ⛵✈️', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: 'Local Shipping', status: '' },
        { id: crypto.randomUUID(), name: 'Check Shipment Status (+3 from shipment start)', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '', status: '' },
        { id: crypto.randomUUID(), name: 'NBD', person: '', remarks: '', subProgress: '', timelineStart: '', timelineEnd: '', duration: '', dependency: '', status: '' },
    ];

    const { error } = await supabase
        .from('subitems')
        .insert({
            client_id: clientId,
            name: 'New Item',
            people: '',
            status: '',
            local_overseas: 'Local',
            qty: '',
            description: '',
            remarks: '',
            shipper: '',
            supplier: '',
            cost: '',
            manpower: '',
            ls: '',
            os: '',
            tc: '',
            uc: '',
            tc_sgd: '',
            price: '',
            up: '',
            num_of_cartons: '',
            cn_tracking: '',
            sg_tracking: '',
            owner: '',
            payment_status: '',
            total: '',
            ls_rmb: '',
            total_c: '',
            mode_of_payment: '',
            order_number: '',
            quantity_produced: '',
            sample: '',
            qty_for: '',
            payment_amount: '',
            difference: '',
            payment_remarks: '',
            timeline_rows: timelineRows,
            show_timeline: false,
            show_payments: false,
            show_sample: false,
            sample_rows: [],
            sample_order_status: '',
            sample_status: '',
            sample_type: '',
        });

    if (error) throw error;
}

export async function updateSubitemRow(subitemId: string, updates: Partial<Subitem>) {
    const payload = {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.people !== undefined ? { people: updates.people } : {}),
        ...(updates.status !== undefined ? { status: updates.status } : {}),
        ...(updates.localOverseas !== undefined ? { local_overseas: updates.localOverseas } : {}),
        ...(updates.qty !== undefined ? { qty: updates.qty } : {}),
        ...(updates.description !== undefined ? { description: updates.description } : {}),
        ...(updates.remarks !== undefined ? { remarks: updates.remarks } : {}),
        ...(updates.shipper !== undefined ? { shipper: updates.shipper } : {}),
        ...(updates.supplier !== undefined ? { supplier: updates.supplier } : {}),
        ...(updates.cost !== undefined ? { cost: updates.cost } : {}),
        ...(updates.manpower !== undefined ? { manpower: updates.manpower } : {}),
        ...(updates.ls !== undefined ? { ls: updates.ls } : {}),
        ...(updates.os !== undefined ? { os: updates.os } : {}),
        ...(updates.tc !== undefined ? { tc: updates.tc } : {}),
        ...(updates.uc !== undefined ? { uc: updates.uc } : {}),
        ...(updates.tcSgd !== undefined ? { tc_sgd: updates.tcSgd } : {}),
        ...(updates.price !== undefined ? { price: updates.price } : {}),
        ...(updates.up !== undefined ? { up: updates.up } : {}),
        ...(updates.numOfCartons !== undefined ? { num_of_cartons: updates.numOfCartons } : {}),
        ...(updates.cnTracking !== undefined ? { cn_tracking: updates.cnTracking } : {}),
        ...(updates.sgTracking !== undefined ? { sg_tracking: updates.sgTracking } : {}),
        ...(updates.owner !== undefined ? { owner: updates.owner } : {}),
        ...(updates.paymentStatus !== undefined ? { payment_status: updates.paymentStatus } : {}),
        ...(updates.total !== undefined ? { total: updates.total } : {}),
        ...(updates.lsRmb !== undefined ? { ls_rmb: updates.lsRmb } : {}),
        ...(updates.totalC !== undefined ? { total_c: updates.totalC } : {}),
        ...(updates.modeOfPayment !== undefined ? { mode_of_payment: updates.modeOfPayment } : {}),
        ...(updates.orderNumber !== undefined ? { order_number: updates.orderNumber } : {}),
        ...(updates.quantityProduced !== undefined ? { quantity_produced: updates.quantityProduced } : {}),
        ...(updates.sample !== undefined ? { sample: updates.sample } : {}),
        ...(updates.qtyFor !== undefined ? { qty_for: updates.qtyFor } : {}),
        ...(updates.paymentAmount !== undefined ? { payment_amount: updates.paymentAmount } : {}),
        ...(updates.difference !== undefined ? { difference: updates.difference } : {}),
        ...(updates.paymentRemarks !== undefined ? { payment_remarks: updates.paymentRemarks } : {}),
        ...(updates.timelineRows !== undefined ? { timeline_rows: updates.timelineRows } : {}),
        ...(updates.showTimeline !== undefined ? { show_timeline: updates.showTimeline } : {}),
        ...(updates.showPayments !== undefined ? { show_payments: updates.showPayments } : {}),
        ...(updates.showSample !== undefined ? { show_sample: updates.showSample } : {}),
        ...(updates.sampleRows !== undefined ? { sample_rows: updates.sampleRows } : {}),
        ...(updates.sampleOrderStatus !== undefined ? { sample_order_status: updates.sampleOrderStatus } : {}),
        ...(updates.sampleStatus !== undefined ? { sample_status: updates.sampleStatus } : {}),
        ...(updates.sampleType !== undefined ? { sample_type: updates.sampleType } : {}),
    };

    const { error } = await supabase
        .from('subitems')
        .update(payload)
        .eq('id', subitemId);

    if (error) throw error;
}

export async function deleteSubitemRow(subitemId: string) {
    const { error } = await supabase
        .from('subitems')
        .delete()
        .eq('id', subitemId);

    if (error) throw error;
}