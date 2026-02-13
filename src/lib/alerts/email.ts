import { Resend } from 'resend';
import { Mention, Keyword } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailDigest(
  to: string,
  mentions: (Mention & { keyword?: Keyword })[],
  frequency: 'daily' | 'weekly'
): Promise<boolean> {
  if (mentions.length === 0) return true;

  const period = frequency === 'daily' ? 'Today' : 'This Week';
  const negative = mentions.filter((m) => m.sentiment === 'negative').length;
  const buyingIntent = mentions.filter((m) => m.buying_intent).length;

  const mentionRows = mentions
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 20)
    .map((m) => {
      const emoji = m.sentiment === 'positive' ? '🟢' : m.sentiment === 'negative' ? '🔴' : '🟡';
      const intent = m.buying_intent ? ' 🎯' : '';
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${emoji}${intent}</td>
        <td style="padding:8px;border-bottom:1px solid #eee"><strong>${m.keyword?.keyword || ''}</strong></td>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.source}</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.text.slice(0, 100)}...</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.relevance_score}/100</td>
        <td style="padding:8px;border-bottom:1px solid #eee">${m.url ? `<a href="${m.url}">View</a>` : ''}</td>
      </tr>`;
    })
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto">
      <h2 style="color:#1a1a2e">📊 Aggrestat ${frequency === 'daily' ? 'Daily' : 'Weekly'} Digest</h2>
      <p>${period}: <strong>${mentions.length}</strong> mentions found${negative > 0 ? ` • <span style="color:red">${negative} negative</span>` : ''}${buyingIntent > 0 ? ` • <span style="color:#2563eb">${buyingIntent} buying intent</span>` : ''}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f3f4f6">
            <th style="padding:8px;text-align:left">Status</th>
            <th style="padding:8px;text-align:left">Keyword</th>
            <th style="padding:8px;text-align:left">Source</th>
            <th style="padding:8px;text-align:left">Mention</th>
            <th style="padding:8px;text-align:left">Relevance</th>
            <th style="padding:8px;text-align:left">Link</th>
          </tr>
        </thead>
        <tbody>${mentionRows}</tbody>
      </table>
      ${mentions.length > 20 ? `<p style="color:#666;font-size:13px">Showing top 20 of ${mentions.length} mentions. <a href="https://aggrestat.com/dashboard">View all →</a></p>` : ''}
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee">
      <p style="color:#999;font-size:12px">Sent by <a href="https://aggrestat.com">Aggrestat</a> • <a href="https://aggrestat.com/settings">Manage alerts</a></p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: 'Aggrestat <alerts@aggrestat.com>',
      to,
      subject: `📊 ${mentions.length} mentions ${period.toLowerCase()} — Aggrestat ${frequency} digest`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email digest error:', error);
    return false;
  }
}
