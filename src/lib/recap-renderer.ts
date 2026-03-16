import jwt from 'jsonwebtoken';

interface RecapData {
  agency_name: string;
  client_name: string;
  meeting_date: string;
  decisions: { decision: string; context: string }[];
  action_items: { task: string; owner_name?: string; owner_email?: string; due_date?: string; priority: string }[];
  next_steps: string[];
  next_meeting?: string;
  confirmation_url: string;
}

/**
 * High-quality HTML template for meeting recaps
 */
const DEFAULT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1f36; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; }
        .header { border-bottom: 2px solid #5469d4; padding-bottom: 10px; margin-bottom: 20px; }
        h1 { color: #5469d4; font-size: 24px; margin: 0; }
        .section { margin-bottom: 25px; }
        h2 { font-size: 18px; color: #1a1f36; border-left: 4px solid #5469d4; padding-left: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { text-align: left; background: #f7fafc; padding: 10px; border: 1px solid #edf2f7; font-size: 14px; }
        td { padding: 10px; border: 1px solid #edf2f7; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 24px; background: #5469d4; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { font-size: 12px; color: #a0aec0; margin-top: 40px; text-align: center; }
        .priority-HIGH { color: #e53e3e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{agency_name}} - Meeting Recap</h1>
            <p style="color: #718096;">For: {{client_name}} | Date: {{meeting_date}}</p>
        </div>

        <div class="section">
            <h2>Key Decisions</h2>
            <ul>
                {{decisions}}
            </ul>
        </div>

        <div class="section">
            <h2>Action Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Owner</th>
                        <th>Due</th>
                    </tr>
                </thead>
                <tbody>
                    {{action_items_table}}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2>Next Steps</h2>
            <ol>
                {{next_steps}}
            </ol>
        </div>

        {{next_meeting_section}}

        <div style="text-align: center;">
            <p>Please review and confirm these notes:</p>
            <a href="{{confirmation_url}}" class="btn">Confirm Recap</a>
        </div>

        <div class="footer">
            Sent by {{agency_name}} via Nexus Suite
        </div>
    </div>
</body>
</html>
`;

export function generateConfirmationUrl(recapId: string) {
  const secret = process.env.JWT_SECRET || 'nexus_fallback_secret';
  const token = jwt.sign({ recapId }, secret, { expiresIn: '72h' });
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/recaps/${recapId}/confirm?token=${token}`;
}

export function renderRecapHtml(data: RecapData): string {
  let html = DEFAULT_TEMPLATE;

  const decisionsHtml = data.decisions
    .map((d: any) => `<li><strong>${d.decision}</strong>: ${d.context}</li>`)
    .join('');

  const actionItemsHtml = data.action_items
    .map((ai: any) => `
        <tr>
            <td>${ai.task} <br/> <small class="priority-${ai.priority}">${ai.priority} Priority</small></td>
            <td>${ai.owner_name || 'Unassigned'}</td>
            <td>${ai.due_date ? new Date(ai.due_date).toLocaleDateString() : 'N/A'}</td>
        </tr>
    `)
    .join('');

  const nextStepsHtml = data.next_steps
    .map((ns: any) => `<li>${ns}</li>`)
    .join('');

  const nextMeetingSection = data.next_meeting 
    ? `<div class="section"><h2>Next Meeting</h2><p>Scheduled for: ${new Date(data.next_meeting).toLocaleString()}</p></div>`
    : '';

  html = html.replace('{{agency_name}}', data.agency_name);
  html = html.replace('{{agency_name}}', data.agency_name); // Footer replacement too
  html = html.replace('{{client_name}}', data.client_name);
  html = html.replace('{{meeting_date}}', data.meeting_date);
  html = html.replace('{{decisions}}', decisionsHtml);
  html = html.replace('{{action_items_table}}', actionItemsHtml);
  html = html.replace('{{next_steps}}', nextStepsHtml);
  html = html.replace('{{next_meeting_section}}', nextMeetingSection);
  html = html.replace('{{confirmation_url}}', data.confirmation_url);

  return html;
}
