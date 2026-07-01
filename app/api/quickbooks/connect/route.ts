import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID!;
    const redirectUri = process.env.QUICKBOOKS_REDIRECT_URI!;
    const scope = 'com.intuit.quickbooks.accounting';
    const state = crypto.randomUUID();

    const url = new URL('https://appcenter.intuit.com/connect/oauth2');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);

    return NextResponse.redirect(url.toString());
}