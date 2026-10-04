import Link from "next/link";

const tools = [
  ["منشئ السيرة الذاتية", "/tools/resume-builder"],
  ["محلل السيرة الذاتية وATS", "/tools/resume-analyzer"],
  ["الاستعداد للمقابلات", "/tools/interview-questions"],
  ["موجّهك المهني", "/tools/career-guidance"],
  ["خطاب التقديم", "/tools/cover-letter-generator"],
  ["كلمات ATS", "/tools/ats-keywords"],
  ["منظّم البحث عن عمل", "/tools/job-search"],
  ["مراجع الملف المهني", "/tools/linkedin-profile"],
];

export default function AdminToolsPage() {
  return <div className="admin-page">
    <div className="admin-page-heading"><div><span className="admin-kicker">مراجعة الواجهة العامة</span><h1>إدارة الأدوات</h1><p>روابط معاينة الأدوات وصفحاتها العامة. إعدادات المحتوى لكل أداة تُدار من صفحاتها الحالية.</p></div></div>
    <div className="admin-panel-card">
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>الأداة</th><th>المسار</th><th>الحالة</th><th>الإجراء</th></tr></thead>
        <tbody>{tools.map(([label, href]) => <tr key={href}><td>{label}</td><td dir="ltr">{href}</td><td>متاحة</td><td><Link className="admin-button admin-button-secondary" href={href} target="_blank">معاينة</Link></td></tr>)}</tbody>
      </table></div>
    </div>
  </div>;
}
