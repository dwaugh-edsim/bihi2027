// Exercises the 0.13.0 recovery predicate and msOf_ outside Apps Script.
// backend.gs declares only vars at top level; the SpreadsheetApp/LockService
// globals are touched inside functions, so the file evaluates cleanly here.
//
//   node scripts/test_recovery_predicate.js
//   BACKEND=/path/to/backend.gs node scripts/test_recovery_predicate.js
const fs = require('fs');
const path = require('path');
const BACKEND = process.env.BACKEND ||
  path.join(__dirname, '..', 'Student_System', 'Room8v2', 'backend.gs');
const src = fs.readFileSync(BACKEND, 'utf8');
const fn = new Function(src + '\n; return { msOf_: msOf_, countCompleted_: countCompleted_, version: CONFIG_VERSION };');
const api = fn();

let pass = 0, fail = 0;
function check(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  PASS  ' + label); }
  else { fail++; console.log('  FAIL  ' + label + '  got=' + JSON.stringify(got) + ' want=' + JSON.stringify(want)); }
}

console.log('backend version: ' + api.version);
console.log('\nmsOf_ normalisation');
const iso = '2026-09-25T01:15:48.969Z';
const dt = new Date(iso);
check('Date object', api.msOf_(dt), dt.getTime());
check('ISO string', api.msOf_(iso), dt.getTime());
check('empty', api.msOf_(''), 0);
check('null', api.msOf_(null), 0);
check('garbage', api.msOf_('not-a-date'), 0);
check('Date and ISO agree', api.msOf_(dt) === api.msOf_(iso), true);

console.log('\nrecovery predicate  (recover when archived, or when the log is newer)');
// Mirrors the exact condition now used in getTaskProgress_ and getSnapshot_.
function recovers(archived, logTs, ledgerTs) {
  if (archived === true) return true;
  return api.msOf_(logTs) > api.msOf_(ledgerTs);
}
const olderLog = '2026-09-20T10:00:00.000Z';   // student saved, then cleared
const newerLog = '2026-09-25T01:15:48.969Z';   // log genuinely ahead of the ledger
const ledgerTs = '2026-09-25T01:00:00.000Z';   // the clear, an hour before the newer log

check('cleared submission is NOT resurrected', recovers(false, olderLog, ledgerTs), false);
check('log newer than ledger recovers',        recovers(false, newerLog, ledgerTs), true);
check('archived stub always recovers',         recovers(true,  olderLog, ledgerTs), true);
check('empty log ts never recovers',           recovers(false, '', ledgerTs), false);
check('equal timestamps do not recover',       recovers(false, ledgerTs, ledgerTs), false);

console.log('\ncountCompleted_ sanity');
check('real answers count', api.countCompleted_({ answers: { a: 'x', b: 'y' } }) > 0, true);
check('cleared submission counts zero', api.countCompleted_({ answers: {} }), 0);
check('empty object counts zero', api.countCompleted_({}), 0);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
