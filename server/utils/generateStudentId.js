/**
 * Student ID  : WAEC-YYYY-<DOMAIN_CODE>-<SEQ>
 * Username    : firstname.registernumber
 * Password    : <3-letter-name-upper><last-4-reg>@
 */

const DOMAIN_CODES = {
  'Full Stack':         'FS',
  'UI/UX':              'UX',
  'Data Analyst':       'DA',
  'AI/ML':              'AI',
  'Cloud':              'CL',
  'Prompt Engineering': 'PE',
  'IoT':                'IT',
};

function generateStudentId(domain, count) {
  const yr   = new Date().getFullYear();
  const code = DOMAIN_CODES[domain] || 'GN';
  const seq  = String(count + 1).padStart(4, '0');
  return `WAEC-${yr}-${code}-${seq}`;
}

function generateLoginCredentials(studentName, registerNumber) {
  const first    = studentName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
  const username = `${first}.${registerNumber.toLowerCase()}`;
  const prefix   = studentName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase().padEnd(3, 'X');
  const suffix   = registerNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-4);
  const password = `${prefix}${suffix}@`;
  return { username, password };
}

/**
 * Assign scenario deterministically from student_id so page refresh
 * never changes the assignment.  Returns 1 or 2.
 */
function assignScenarioIndex(studentId) {
  const hash = studentId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return (hash % 2) + 1; // 1 or 2
}

module.exports = { generateStudentId, generateLoginCredentials, assignScenarioIndex };
