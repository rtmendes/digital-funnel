/**
 * Vercel Serverless Function: /api/capture-lead
 * Receives quiz submissions and creates contacts in GoHighLevel.
 *
 * Required env vars in Vercel dashboard:
 *   GHL_PRIVATE_TOKEN  — GHL Private Integration access token
 *   GHL_LOCATION_ID    — GHL location ID (defaults to Growthworks CRM sub-account)
 *
 * To get GHL_PRIVATE_TOKEN:
 *  1. In GHL go to Settings → Private Integrations → + New Integration
 *  2. Name it "Digital Funnel", enable Contacts scope (read + write)
 *  3. Copy the Access Token → add as GHL_PRIVATE_TOKEN in Vercel env vars
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_TOKEN   = process.env.GHL_PRIVATE_TOKEN;
  const LOCATION_ID = process.env.GHL_LOCATION_ID || 'JFsGvpDHJ13LshVby4Xl';

  if (!GHL_TOKEN) {
    console.log('LEAD (no GHL token yet):', JSON.stringify(req.body));
    return res.status(200).json({ ok: true, note: 'Lead logged — add GHL_PRIVATE_TOKEN to Vercel env vars' });
  }

  const { firstName, email, archetype, archetypeName, source, tags } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const contactPayload = {
      locationId: LOCATION_ID,
      email,
      firstName: firstName || '',
      source: source || 'Digital Funnel',
      tags: [
        ...(tags || []),
        `archetype-${archetype || 'unknown'}`,
        archetypeName || '',
        'digital-funnel',
      ].filter(Boolean),
      customFields: [
        { key: 'funnel_archetype',      field_value: archetype     || '' },
        { key: 'funnel_archetype_name', field_value: archetypeName || '' },
        { key: 'funnel_source',         field_value: source        || 'quiz' },
      ],
    };

    const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    const ghlData = await ghlRes.json();

    if (!ghlRes.ok) {
      console.error('GHL error:', JSON.stringify(ghlData));
      console.log('LEAD (GHL error):', JSON.stringify(req.body));
      return res.status(200).json({ ok: true, ghlError: ghlData.message });
    }

    const contactId = ghlData.contact?.id;

    // Optionally enroll in a workflow
    const WORKFLOW_ID = process.env.GHL_FUNNEL_WORKFLOW_ID;
    if (WORKFLOW_ID && contactId) {
      await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${WORKFLOW_ID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
      });
    }

    return res.status(200).json({ ok: true, contactId });

  } catch (err) {
    console.error('capture-lead error:', err.message);
    console.log('LEAD (exception):', JSON.stringify(req.body));
    return res.status(200).json({ ok: true, note: 'Lead logged' });
  }
}
