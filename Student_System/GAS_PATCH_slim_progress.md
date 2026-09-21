# GAS patch — slim `get_class_progress` payload (optional but recommended)

**Why:** today `get_class_progress` ships every student's entire `savedData`
blob — ~246 KB per class, ~1.1 MB for `ALL` — which makes refreshes slow and
timeout-prone on Google's free Apps Script hosting. The opening slide only
needs a few fields per student; this patch cuts the response to a few KB.

**Safe rollout:** the slim shape only activates when the request has
`slim=1`. `api.js` already sends it; a GAS *without* this patch ignores the
unknown param and returns the old full shape, and the opening slide
normalizes either one. Nothing breaks if you deploy this today, next week,
or never.

## How to apply

1. Open the Apps Script project behind the webhook in
   `Student_System/api.js` (`CONFIG.DEFAULT_SCRIPT_URL` → script.google.com
   → Extensions / Apps Script editor).
2. Paste `slimStudents` (below) anywhere at top level.
3. In `doGet`, find the `get_class_progress` branch — specifically where it
   builds the students array it returns. Just before the response object is
   created (or just after it, if easier), add:

   ```js
   if (e.parameter.slim === '1' && Array.isArray(out.students)) {
     out.students = slimStudents(out.students);
   }
   ```

   (`out` = the response object with `.status` and `.students`; rename to
   match your local variable.)
4. Save, then **Deploy → Manage deployments → edit → New version** so the
   live webhook picks it up.

## The function

```js
// Slim per-student record for get_class_progress?slim=1. Keeps everything
// the opening slide's progress panel reads (pin/name/task/summary/partner/
// assignments/lastUpdated + per-task written flags) and drops the heavy
// savedData payloads. Full payload still returned when slim is absent.
function slimStudents(students) {
  return students.map(function (s) {
    var saved = s.savedData || {};
    var legacy = saved._tasks || {};
    var out = {
      pin: s.pin,
      name: s.name,
      className: s.className,
      task: s.task,
      summary: s.summary,
      partner: saved.partner || '',
      lastUpdated: s.lastUpdated,
      assignments: s.assignments || {},
      tasks: {}
    };
    Object.keys(legacy).forEach(function (k) {
      var e = legacy[k] || {};
      var d = e.data || {};
      var written = String(e.summary || '').trim() !== '' ||
        String(d.summary || '').trim() !== '';
      if (!written) {
        written = Object.keys(d).some(function (k2) {
          var v = d[k2];
          if (typeof v === 'string') return v.trim() !== '';
          if (v && typeof v === 'object') {
            return Object.keys(v).some(function (k3) { return String(v[k3]).trim() !== ''; });
          }
          return false;
        });
      }
      out.tasks[k] = { summary: String(e.summary || ''), written: written };
    });
    return out;
  });
}
```

## Optional: 90-second server-side cache (same patch, one more snippet)

Apps Script re-reads the whole Sheet on every call. A short CacheService TTL
collapses bursts (several tabs / the 3-minute slide refresh + student saves)
into one Sheet read. Cache entries cap at 100 KB, so only cache the *slim*
shape:

```js
// at the top of the get_class_progress branch:
var slim = e.parameter.slim === '1';
var cache = CacheService.getScriptCache();
var ck = 'prog_' + (e.parameter.className || 'ALL');
if (slim && e.parameter.cache !== '0') {
  var hit = cache.get(ck);
  if (hit) return ContentService.createTextOutput(hit)
    .setMimeType(ContentService.MimeType.JSON);
}
// ...build the response object as usual, then before returning:
if (slim) {
  try { cache.put(ck, JSON.stringify(out), 90); } catch (ignore) { /* >100KB */ }
}
```

Add `&cache=0` to any request to force a fresh read.

## Verify after deploying

```
curl -sL "<webhook-url>?action=get_class_progress&className=901&slim=1" | head -c 400
```

You should see compact records with a `tasks` map (`{"summary": "...",
"written": true}`) and no `savedData`. Without `slim=1`, the old full
payload still comes back for the dashboards.
