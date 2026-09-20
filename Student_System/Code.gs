/**
 * Bicentennial Junior High School — Student Webhook Backend (V6 - Hardened Multi-Assignment Ledger Edition)
 * Mr. Waugh (Room 8)
 * 
 * V6 hardening (Sep 20, 2026):
 * - CONFIG.VERSION + get_health endpoint (drift visibility)
 * - Exemplar guardrail (blocks teacher sample data from saving to student PINs)
 * - Demo PIN routing (TST/WAU/DEV/MRW → DEMO tab)
 * - Corrupt-cell merge abort (never silently wipe data on bad JSON)
 * - Idempotency key (requestId dedupe prevents double-writes)
 * - Confirm-after-write (hash + byteLength in response for client verification)
 * - Batch roster write (single setValues call)
 * - Schema stamp (_v: 1 on all writes)
 *
 * Supports:
 * - Multi-class sections (801, 802, 803, 804, 901, 902, 903)
 * - Concurrency protection: LockService on all write operations (prevents simultaneous Chromebook submission collisions)
 * - Multi-assignment isolation: Stores each assignment under `_tasks[taskName].data` so assignments never overwrite each other
 * - Deep top-level property preservation (matrix, formats, p1-p5, rent_math, answers, issues, dilemmas, teacher_note, etc.)
 * - Cross-sheet homeroom resolution: Prevents orphaned empty login rows from being created when students pick the wrong class dropdown
 * - Authoritative deduplication in `get_class_progress`: Empty login placeholders can NEVER clobber real student work
 * - Year-long multi-assignment scale (Append-only Submissions_Log ledger)
 * - Automatic Visual Gradebook Columns in Class Sheets
 * - 3-Letter PIN + First Name verification
 * - Cross-device persistence
 * - Dedicated Locker & Combination Master Sync (`Lockers_902` tab)
 */

// ===== VERSION & CONSTANTS (bump VERSION on every edit, then redeploy) =====
var CONFIG_VERSION = 'V6.0-2026-09-20';
var CONFIG_DEPLOY_DATE = '2026-09-20T18:40:00Z';
var DEMO_PINS = ['TST', 'WAU', 'DEV', 'MRW'];
var EXEMPLAR_SIGNATURES = ['Smith Point Road', 'k7n7dESM4Hg', 'Gwangju, South Korea', 'Mauritius', 'Yeah Yeah No No'];
var ALL_CLASSES = ['901', '902', '903', '801', '802', '803', '804'];

function getSheetForClass(ss, className) {
  const cleanName = String(className || 'General').trim();
  let sheet = ss.getSheetByName(cleanName);
  if (!sheet) {
    sheet = ss.insertSheet(cleanName);
    sheet.appendRow([
      'PIN',                     // A (1)
      'Student Name',           // B (2)
      'Section',                // C (3)
      'GNSPES Email',           // D (4)
      'Pronouns',               // E (5)
      'Task / Stage',           // F (6)
      'Submission Data (JSON)', // G (7)
      'Formatted Summary',      // H (8)
      'Last Updated'            // I (9)
    ]);
    sheet.getRange("A1:I1").setFontWeight("bold").setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 70);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(4, 180);
    sheet.setColumnWidth(7, 240);
    sheet.setColumnWidth(8, 280);
  }
  return sheet;
}

function getSubmissionsLogSheet(ss) {
  const tabName = 'Submissions_Log';
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow([
      'Timestamp',              // A (1)
      'Section',                // B (2)
      'PIN',                    // C (3)
      'Student Name',           // D (4)
      'Task / Stage',           // E (5)
      'Status',                 // F (6)
      'Formatted Summary',      // G (7)
      'Submission Data (JSON)', // H (8)
      'GNSPES Email',           // I (9)
      'Pronouns'                // J (10)
    ]);
    sheet.getRange("A1:J1").setFontWeight("bold").setBackground('#1e293b').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 70);
    sheet.setColumnWidth(3, 70);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 100);
    sheet.setColumnWidth(7, 280);
    sheet.setColumnWidth(8, 200);
    sheet.setColumnWidth(9, 180);
    sheet.setColumnWidth(10, 100);
  }
  return sheet;
}

function getLockerSheet(ss, className) {
  const tabName = 'Lockers_' + String(className || '902').trim();
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow([
      'Locker #',        // A
      'Student Name',    // B
      'Student ID',      // C
      'PIN',             // D
      'Combination',     // E
      'Notes / Status',  // F
      'Last Updated'     // G
    ]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground('#e0f2fe').setFontColor('#0369a1');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 90);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 120);
    sheet.setColumnWidth(4, 80);
    sheet.setColumnWidth(5, 140);
    sheet.setColumnWidth(6, 180);
    sheet.setColumnWidth(7, 160);
  }
  return sheet;
}

function getOrCreateAssignmentColumn(sheet, taskName) {
  const cleanTask = String(taskName || 'Assignment').trim();
  const lastCol = Math.max(sheet.getLastColumn(), 9);
  const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  
  // Look for existing column matching taskName
  for (let c = 9; c < headerRow.length; c++) {
    if (String(headerRow[c] || '').trim().toLowerCase() === cleanTask.toLowerCase()) {
      return c + 1; // 1-indexed
    }
  }
  
  // Add new assignment column
  const newCol = lastCol + 1;
  sheet.getRange(1, newCol).setValue(cleanTask)
    .setFontWeight("bold")
    .setBackground('#e2e8f0')
    .setFontColor('#0f172a');
  sheet.setColumnWidth(newCol, 150);
  return newCol;
}

/**
 * Cross-sheet finder: searches all official class sheets for a student by PIN.
 * Returns { sheet, rowIndex, rowData, className } or null.
 */
function findStudentAcrossSheets(ss, pin) {
  const allClasses = ALL_CLASSES;
  const cleanPin = String(pin || '').trim().toUpperCase();
  if (!cleanPin) return null;

  let bestMatch = null;

  for (let i = 0; i < allClasses.length; i++) {
    const cls = allClasses[i];
    const sheet = ss.getSheetByName(cls);
    if (!sheet) continue;
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) continue;
    const data = sheet.getRange(1, 1, lastRow, Math.max(sheet.getLastColumn(), 9)).getValues();

    for (let r = 1; r < data.length; r++) {
      if (String(data[r][0]).trim().toUpperCase() === cleanPin) {
        let sd = {};
        try { sd = JSON.parse(data[r][6] || '{}'); } catch(e) { sd = {}; }
        const keyCount = Object.keys(sd).length;
        const isNotPlaceholder = data[r][5] !== 'Active / Logged In' && data[r][7] !== 'Initial Login';

        const match = {
          sheet: sheet,
          rowIndex: r + 1,
          rowData: data[r],
          className: cls,
          keyCount: keyCount,
          isReal: isNotPlaceholder
        };

        // If this record has real data or real task, return immediately as authoritative
        if (match.isReal || match.keyCount > 0) {
          return match;
        }
        if (!bestMatch) bestMatch = match;
      }
    }
  }
  return bestMatch;
}

function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = params.action || 'login';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ==========================================
    // ACTION: HEALTH CHECK (deployment drift visibility)
    // Bookmark this URL and hit it before every class.
    // ==========================================
    if (action === 'get_health') {
      const sheetNames = ss.getSheets().map(function(s) { return s.getName(); });
      const logSheet = ss.getSheetByName('Submissions_Log');
      const logRows = logSheet ? logSheet.getLastRow() - 1 : 0;
      const rowCounts = {};
      ALL_CLASSES.forEach(function(cls) {
        var sheet = ss.getSheetByName(cls);
        rowCounts[cls] = sheet ? sheet.getLastRow() - 1 : 0;
      });
      return successJSON({
        status: 'healthy',
        version: CONFIG_VERSION,
        deployedAt: CONFIG_DEPLOY_DATE,
        sheetInventory: sheetNames,
        rowCounts: rowCounts,
        logRows: logRows
      });
    }

    // ==========================================
    // ACTION: GET LOCKERS
    // ==========================================
    if (action === 'get_lockers') {
      const className = String(params.className || '902').trim();
      const sheet = getLockerSheet(ss, className);
      const data = sheet.getDataRange().getValues();
      const result = {};
      for (let i = 1; i < data.length; i++) {
        const id = String(data[i][2]).trim();
        if (id) {
          result[id] = {
            locker: data[i][0],
            name: data[i][1],
            id: id,
            pin: data[i][3],
            combo: data[i][4],
            notes: data[i][5],
            updated: data[i][6]
          };
        }
      }
      return successJSON({ status: 'lockers_fetched', lockers: result });
    }

    // ==========================================
    // ACTION: GET CLASS LOG (Class_Log_Tracker.html — "what we did last class")
    // Returns { entries: [...], plans: { '902-CIT': {note, classNo, updated} } }
    // ==========================================
    if (action === 'get_class_log') {
      const logSheet = ss.getSheetByName('Class_Log');
      const entries = [];
      if (logSheet && logSheet.getLastRow() > 1) {
        const rows = logSheet.getRange(1, 1, logSheet.getLastRow(), 7).getValues();
        for (let i = 1; i < rows.length; i++) {
          if (!String(rows[i][0] || '').trim()) continue;
          entries.push({
            date: toIsoDate(rows[i][0]),              // 'YYYY-MM-DD' (normalized from date cells)
            section: String(rows[i][1]).trim(),       // e.g. '902-CIT'
            course: String(rows[i][2]).trim(),        // e.g. 'CIT9'
            classNo: String(rows[i][3] || '').trim(), // optional lesson number
            did: String(rows[i][4] || ''),
            next: String(rows[i][5] || ''),
            timestamp: toIsoStamp(rows[i][6])
          });
        }
      }
      const rawPlans = readClassPlans(ss);
      const plans = {};
      for (const section of Object.keys(rawPlans)) {
        plans[section] = {
          note: String(rawPlans[section].note || ''),
          classNo: String(rawPlans[section].classNo || '').trim(),
          updated: toIsoStamp(rawPlans[section].updated)
        };
      }
      return successJSON({
        status: 'success',
        entries: entries,
        plans: plans,
        slides: readClassSlides(ss)
      });
    }

    // ==========================================
    // ACTION: FAST BULK CLASS PROGRESS (With Anti-Overwrite Deduplication)
    // ==========================================
    if (action === 'get_class_progress' || action === 'get_all_progress' || action === 'GET_ALL_PROGRESS') {
      const className = String(params.className || 'ALL').trim();
      const classesToScan = (className === 'ALL') ? ALL_CLASSES : [className];
      const studentsByPin = {};
      
      for (let c = 0; c < classesToScan.length; c++) {
        const cls = classesToScan[c];
        const sheet = ss.getSheetByName(cls);
        if (!sheet) continue;
        const lastRow = sheet.getLastRow();
        const lastCol = Math.max(sheet.getLastColumn(), 9);
        if (lastRow <= 1) continue;
        
        const rows = sheet.getRange(1, 1, lastRow, lastCol).getValues();
        const headers = rows[0];
        
        for (let i = 1; i < rows.length; i++) {
          const rowPin = String(rows[i][0] || '').trim().toUpperCase();
          if (!rowPin) continue;
          
          let savedObj = {};
          try { savedObj = JSON.parse(rows[i][6] || '{}'); } catch(err) { savedObj = {}; }
          
          // Collect visual gradebook assignment columns (from col 10 onwards)
          const assignments = {};
          for (let col = 9; col < headers.length; col++) {
            const aName = String(headers[col] || '').trim();
            const aVal = String(rows[i][col] || '').trim();
            if (aName) {
              assignments[aName] = aVal;
            }
          }
          
          const entry = {
            pin: rowPin,
            name: rows[i][1] || '',
            className: cls,
            email: rows[i][3] || '',
            pronouns: rows[i][4] || '',
            task: rows[i][5] || '',
            savedData: savedObj,
            summary: rows[i][7] || '',
            lastUpdated: rows[i][8] || '',
            assignments: assignments
          };
          
          if (!studentsByPin[rowPin]) {
            studentsByPin[rowPin] = entry;
          } else {
            // Merge intelligently: real work ALWAYS trumps empty placeholders
            const prev = studentsByPin[rowPin];
            const prevKeys = Object.keys(prev.savedData || {}).length;
            const currKeys = Object.keys(savedObj || {}).length;
            const prevIsPlaceholder = (prev.task === 'Active / Logged In' || prev.summary === 'Initial Login') && prevKeys === 0;
            const currIsPlaceholder = (entry.task === 'Active / Logged In' || entry.summary === 'Initial Login') && currKeys === 0;

            if (prevIsPlaceholder && !currIsPlaceholder) {
              // Current has real data, replace placeholder completely
              Object.assign(entry.assignments, prev.assignments);
              studentsByPin[rowPin] = entry;
            } else if (!prevIsPlaceholder && currIsPlaceholder) {
              // Keep prev, just merge assignments
              Object.assign(prev.assignments, entry.assignments);
            } else {
              // Both have data or both are placeholders: merge savedData & assignments safely
              const mergedSaved = Object.assign({}, prev.savedData, savedObj);
              const mergedAssignments = Object.assign({}, prev.assignments, entry.assignments);
              if (currKeys > prevKeys) {
                entry.savedData = mergedSaved;
                entry.assignments = mergedAssignments;
                studentsByPin[rowPin] = entry;
              } else {
                prev.savedData = mergedSaved;
                prev.assignments = mergedAssignments;
              }
            }
          }
        }
      }
      
      const results = Object.keys(studentsByPin).map(function(k) { return studentsByPin[k]; });
      return successJSON({ status: 'success', students: results, timestamp: new Date() });
    }

    // ==========================================
    // ACTION: GET STUDENT SUBMISSION HISTORY
    // ==========================================
    if (action === 'get_student_history') {
      const pin = String(params.pin || '').trim().toUpperCase();
      const logSheet = ss.getSheetByName('Submissions_Log');
      if (!logSheet || !pin) {
        return successJSON({ status: 'success', pin: pin, history: [] });
      }
      const lastRow = logSheet.getLastRow();
      if (lastRow <= 1) {
        return successJSON({ status: 'success', pin: pin, history: [] });
      }
      const rows = logSheet.getRange(1, 1, lastRow, 8).getValues();
      const studentHistory = [];
      for (let i = 1; i < rows.length; i++) {
        if (String(rows[i][2] || '').trim().toUpperCase() === pin) {
          studentHistory.push({
            timestamp: rows[i][0],
            className: rows[i][1],
            pin: rows[i][2],
            name: rows[i][3],
            task: rows[i][4],
            status: rows[i][5],
            summary: rows[i][6]
          });
        }
      }
      return successJSON({ status: 'success', pin: pin, history: studentHistory });
    }

    // ==========================================
    // ACTION: SINGLE STUDENT LOGIN / SYNC (GET)
    // ==========================================
    const pin = String(params.pin || '').trim().toUpperCase();
    const className = String(params.className || 'General').trim();
    if (!pin) throw new Error("3-Letter PIN is required.");

    const sheet = getSheetForClass(ss, className);
    const lastRow = sheet.getLastRow();
    let rowIndex = -1;
    let studentRow = null;

    if (lastRow > 1) {
      const data = sheet.getRange(1, 1, lastRow, Math.max(sheet.getLastColumn(), 9)).getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim().toUpperCase() === pin) {
          rowIndex = i + 1;
          studentRow = data[i];
          break;
        }
      }
    }

    // Fallback: check cross-sheet if not in current sheet
    if (rowIndex === -1) {
      const crossMatch = findStudentAcrossSheets(ss, pin);
      if (crossMatch && crossMatch.rowData) {
        studentRow = crossMatch.rowData;
        rowIndex = crossMatch.rowIndex;
      }
    }

    if (rowIndex !== -1 && studentRow) {
      let savedDataJSON = {};
      try {
        savedDataJSON = JSON.parse(studentRow[6] || '{}');
      } catch (err) {
        savedDataJSON = {};
      }
      return successJSON({
        isNew: false,
        name: studentRow[1],
        email: studentRow[3] || '',
        pronouns: studentRow[4] || '',
        task: studentRow[5] || '',
        savedData: savedDataJSON,
        className: studentRow[2] || className
      });
    } else {
      return successJSON({
        isNew: true,
        name: params.name || '',
        savedData: {},
        className: className
      });
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // Parse payload and get spreadsheet BEFORE acquiring the lock.
  // This lets guardrail checks and Submissions_Log appends happen without waiting.
  // The lock is acquired later, only for the roster read-modify-write cycle.
  const lock = LockService.getScriptLock();
  var lockAcquired = false;
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action; 
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Acquire the lock for all write actions (except submit_profile which manages its own lock)
    if (action !== 'submit_profile' && action !== 'submit_assignment' && action !== 'submit_diagnostic') {
      lock.waitLock(30000);
      lockAcquired = true;
    }

    // ==========================================
    // ACTION: SAVE LOCKERS (Bulk or Single Sync)
    // ==========================================
    if (action === 'save_lockers') {
      const className = String(payload.className || '902').trim();
      const lockerData = payload.lockers || [];
      const sheet = getLockerSheet(ss, className);

      if (Array.isArray(lockerData) && lockerData.length > 0) {
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
        }

        const now = new Date();
        const rows = lockerData.map(function(item) {
          return [
            item.locker,
            item.name,
            item.id,
            item.pin,
            item.combo || '',
            item.notes || '',
            now
          ];
        });

        sheet.getRange(2, 1, rows.length, 7).setValues(rows);
        return successJSON({ 
          status: 'lockers_saved',
          count: rows.length,
          timestamp: now
        });
      }

      return successJSON({ status: 'no_data_provided' });
    }

    // ==========================================
    // ACTION: SUBMIT CLASS LOG (Class_Log_Tracker quick-log panel)
    // Upsert keyed on (date + section): logging the same class twice fixes it.
    // Optional gate: set Script Property CLASS_LOG_PIN to require teacherPin.
    // ==========================================
    if (action === 'submit_class_log') {
      const expectedPin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
      if (expectedPin && String(payload.teacherPin || '').trim() !== String(expectedPin)) {
        throw new Error('Teacher PIN required for class log entries.');
      }
      const entry = payload.entry || {};
      const logDate = String(entry.date || '').trim();
      const logSection = String(entry.section || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(logDate)) throw new Error('Entry date must be YYYY-MM-DD.');
      if (!logSection) throw new Error('Entry section is required.');

      const sheet = getClassLogSheet(ss);
      const now = new Date();
      const rowValues = [
        logDate,                                        // A Date
        logSection,                                     // B Section (e.g. 902-CIT)
        String(entry.course || ''),                     // C Course (e.g. CIT9)
        String(entry.classNo || ''),                    // D Class # (optional)
        String(entry.did || ''),                        // E What we did
        String(entry.next || ''),                       // F Next class / reminders
        now                                             // G Timestamp
      ];

      // Upsert: replace any existing row with the same date+section
      const lastRow = sheet.getLastRow();
      let targetRow = -1;
      if (lastRow > 1) {
        const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
        for (let r = 0; r < data.length; r++) {
          if (toIsoDate(data[r][0]) === logDate && String(data[r][1]).trim() === logSection) {
            targetRow = r + 2;
            break;
          }
        }
      }
      if (targetRow !== -1) {
        sheet.getRange(targetRow, 1, 1, 7).setValues([rowValues]);
      } else {
        sheet.appendRow(rowValues);
      }

      // Keep the section's forward plan in sync: logging a class with a
      // "next" note sets/advances the plan (classNo auto-advances by 1).
      if (String(entry.next || '').trim()) {
        writeClassPlan(ss, logSection, String(entry.next).trim(),
          /^\d+$/.test(String(entry.classNo || '').trim()) ? String(Number(entry.classNo) + 1) : null);
      }

      return successJSON({
        status: targetRow !== -1 ? 'class_log_updated' : 'class_log_saved',
        date: logDate,
        section: logSection
      });
    }

    // ==========================================
    // ACTION: SET CLASS PLAN (change direction without logging a class)
    // payload: { section, note, classNo } — empty note clears the plan.
    // ==========================================
    if (action === 'set_class_plan') {
      const expectedPin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
      if (expectedPin && String(payload.teacherPin || '').trim() !== String(expectedPin)) {
        throw new Error('Teacher PIN required for class log entries.');
      }
      const planSection = String(payload.section || '').trim();
      if (!planSection) throw new Error('Section is required.');
      const note = String(payload.note || '').trim();
      if (note) {
        writeClassPlan(ss, planSection, note, String(payload.classNo || '').trim() || null);
      } else {
        clearClassPlan(ss, planSection);
      }
      return successJSON({ status: 'class_plan_set', section: planSection });
    }

    // ==========================================
    // ACTION: SET CLASS SLIDE (Class_Opening_Slide.html — projector do-now slide)
    // payload: { section, title, announcements, outcome } — all blank clears.
    // ==========================================
    if (action === 'set_class_slide') {
      const expectedPin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
      if (expectedPin && String(payload.teacherPin || '').trim() !== String(expectedPin)) {
        throw new Error('Teacher PIN required for class log entries.');
      }
      const slideSection = String(payload.section || '').trim();
      if (!slideSection) throw new Error('Section is required.');
      const title = String(payload.title || '').trim();
      const announcements = String(payload.announcements || '').trim();
      const outcome = String(payload.outcome || '').trim();
      if (title || announcements || outcome) {
        writeClassSlide(ss, slideSection, title, announcements, outcome);
      } else {
        clearClassSlide(ss, slideSection);
      }
      return successJSON({ status: 'class_slide_set', section: slideSection });
    }

    // ==========================================
    // ACTION: DELETE CLASS LOG ROW (fix test rows / mistakes)
    // payload: { date, section }
    // ==========================================
    if (action === 'delete_class_log') {
      const expectedPin = PropertiesService.getScriptProperties().getProperty('CLASS_LOG_PIN');
      if (expectedPin && String(payload.teacherPin || '').trim() !== String(expectedPin)) {
        throw new Error('Teacher PIN required for class log entries.');
      }
      const delDate = String(payload.date || '').trim();
      const delSection = String(payload.section || '').trim();
      const sheet = ss.getSheetByName('Class_Log');
      if (!sheet || sheet.getLastRow() <= 1) {
        return successJSON({ status: 'class_log_deleted', removed: 0 });
      }
      const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
      let removed = 0;
      for (let r = data.length - 1; r >= 0; r--) {
        if (toIsoDate(data[r][0]) === delDate && String(data[r][1]).trim() === delSection) {
          sheet.deleteRow(r + 2);
          removed++;
        }
      }
      return successJSON({ status: 'class_log_deleted', removed: removed });
    }

    // ==========================================
    // DEFAULT STUDENT WORKFLOW ACTIONS
    // ==========================================
    const pin = String(payload.pin || '').trim().toUpperCase();
    let className = String(payload.className || 'General').trim();
    
    if (!pin) throw new Error("3-Letter PIN is required.");

    // Demo PIN routing: TST/WAU/DEV/MRW always write to DEMO tab
    var isDemoPin = DEMO_PINS.indexOf(pin) !== -1;
    if (isDemoPin) {
      className = 'DEMO';
    }

    // Check if student exists in the targeted sheet
    let sheet = getSheetForClass(ss, className);
    let lastRow = sheet.getLastRow();
    let lastCol = Math.max(sheet.getLastColumn(), 9);
    let rowIndex = -1;
    let studentRow = null;

    if (lastRow > 1) {
      const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim().toUpperCase() === pin) {
          rowIndex = i + 1;
          studentRow = data[i];
          break;
        }
      }
    }

    // If not in targeted sheet, check if student already exists in another class sheet
    // (skip cross-sheet search for demo PINs — they always stay in DEMO)
    if (rowIndex === -1 && !isDemoPin) {
      const crossMatch = findStudentAcrossSheets(ss, pin);
      if (crossMatch && crossMatch.rowData) {
        sheet = crossMatch.sheet;
        rowIndex = crossMatch.rowIndex;
        studentRow = crossMatch.rowData;
        className = crossMatch.className;
        lastCol = Math.max(sheet.getLastColumn(), 9);
      }
    }

    // --- ACTION: LOGIN (Cross-Device Persistence) ---
    if (action === 'login') {
      const name = (payload.name || '').trim();
      
      if (rowIndex !== -1 && studentRow) {
        const savedName = studentRow[1];
        const savedEmail = studentRow[3];
        const savedPronouns = studentRow[4];
        const savedTask = studentRow[5];
        let savedDataJSON = {};
        try {
          savedDataJSON = JSON.parse(studentRow[6] || '{}');
        } catch (err) {
          savedDataJSON = {};
        }
        
        return successJSON({
          isNew: false,
          name: savedName || name,
          email: savedEmail || '',
          pronouns: savedPronouns || '',
          task: savedTask || '',
          savedData: savedDataJSON,
          className: className
        });
      } else {
        sheet.appendRow([
          pin,
          name,
          className,
          '', '',
          'Active / Logged In',
          '{}',
          'Initial Login',
          new Date()
        ]);
        return successJSON({
          isNew: true,
          name: name,
          email: '',
          pronouns: '',
          task: 'Active / Logged In',
          savedData: {},
          className: className
        });
      }
    }
    
    // --- ACTION: SUBMIT / SAVE PROFILE & ASSIGNMENT (Resilient Multi-Task Ledger) ---
    else if (action === 'submit_profile' || action === 'submit_assignment' || action === 'submit_diagnostic') {
      const taskName = payload.taskName || 'Intake & Diagnostic Profile';
      const studentName = (payload.name || '').trim();
      const email = (payload.email || '').trim();
      const pronouns = (payload.pronouns || '').trim();
      const summary = payload.summary || '';
      const requestId = payload.requestId || '';
      const now = new Date();
      const rawPayloadData = payload.data || {};

      // GUARDRAIL: Exemplar signature check — block teacher sample data from saving to real student PINs
      if (!isDemoPin) {
        var rawStr = JSON.stringify(rawPayloadData);
        var isExemplar = EXEMPLAR_SIGNATURES.some(function(sig) { return rawStr.indexOf(sig) !== -1; });
        if (isExemplar) {
          Logger.log('BLOCKED exemplar save to real PIN: ' + pin + ' task: ' + taskName);
          return successJSON({
            status: 'blocked_exemplar',
            message: 'Exemplar/sample data cannot be saved to a student profile. This submission was blocked.',
            version: CONFIG_VERSION
          });
        }
      }

      // IDEMPOTENCY: If requestId is provided, check recent Submissions_Log for duplicate
      if (requestId) {
        var logSheetDedup = getSubmissionsLogSheet(ss);
        var dedupLastRow = logSheetDedup.getLastRow();
        if (dedupLastRow > 1) {
          var scanStart = Math.max(2, dedupLastRow - 99); // scan last 100 rows
          var dedupRows = logSheetDedup.getRange(scanStart, 1, dedupLastRow - scanStart + 1, 8).getValues();
          for (var dr = dedupRows.length - 1; dr >= 0; dr--) {
            try {
              var logPayload = JSON.parse(dedupRows[dr][7] || '{}');
              if (logPayload._requestId === requestId) {
                return successJSON({
                  status: 'submitted_successfully',
                  task: taskName,
                  deduplicated: true,
                  message: 'Duplicate requestId — original submission already recorded.',
                  version: CONFIG_VERSION
                });
              }
            } catch(parseErr) { /* skip unparseable log rows */ }
          }
        }
      }

      // Stamp requestId into the payload for future dedupe lookups
      if (requestId) {
        rawPayloadData._requestId = requestId;
      }

      // 1. IMMUTABLE APPEND TO CENTRAL SUBMISSIONS_LOG — happens OUTSIDE the lock
      // so that even if the roster merge times out, the payload is permanently safe.
      // Google Sheets handles concurrent appendRow calls to the same sheet safely.
      const logSheet = getSubmissionsLogSheet(ss);
      logSheet.appendRow([
        now,
        className,
        pin,
        studentName,
        taskName,
        'Submitted',
        summary,
        JSON.stringify(rawPayloadData),
        email,
        pronouns
      ]);

      // NOW acquire the lock for the roster read-modify-write cycle.
      // End-of-class crunch: if 28 students close lids simultaneously, all 28 log
      // appends above succeed immediately. Only the roster merges queue here.
      // If a student's merge times out, their data is still in Submissions_Log.
      lock.waitLock(30000);
      lockAcquired = true;

      // 2. PRESERVE & MERGE STUDENT ROSTER ROW
      let existingData = {};
      if (rowIndex !== -1 && studentRow) {
        var existingCellValue = studentRow[6] || '';
        if (existingCellValue) {
          try {
            existingData = JSON.parse(existingCellValue);
          } catch (err) {
            // CORRUPT CELL MERGE ABORT: Non-empty cell that won't parse — never silently wipe it
            // Stash the corrupt text in Submissions_Log and refuse to overwrite
            logSheet.appendRow([
              now,
              className,
              pin,
              studentName,
              '__corrupt_backup',
              'CORRUPT_CELL',
              'Merge aborted: existing cell JSON failed to parse. Raw text stashed here.',
              String(existingCellValue),
              email,
              pronouns
            ]);
            Logger.log('CORRUPT CELL for PIN ' + pin + ' in ' + className + ' — merge aborted, raw text backed up to Submissions_Log');
            return successJSON({
              status: 'error',
              message: 'Existing student data is corrupted (cannot parse JSON). Merge aborted to prevent data loss. The corrupt data has been backed up. Please contact Mr. Waugh.',
              version: CONFIG_VERSION
            });
          }
        }
      }

      // Deep merge: Start with existing data
      const mergedData = Object.assign({}, existingData);
      mergedData.name = studentName || mergedData.name || '';
      mergedData.pin = pin;
      mergedData.className = className;
      if (email) mergedData.email = email;
      if (pronouns) mergedData.pronouns = pronouns;

      // Copy all fields from rawPayloadData into mergedData (skip _tasks to avoid double nesting)
      for (let k in rawPayloadData) {
        if (rawPayloadData.hasOwnProperty(k) && k !== '_tasks') {
          mergedData[k] = rawPayloadData[k];
        }
      }

      // CRITICAL TASK ISOLATION: Store complete task payload in dedicated namespace
      if (!mergedData._tasks) mergedData._tasks = {};
      mergedData._tasks[taskName] = {
        updated: now,
        summary: summary,
        status: 'submitted',
        data: rawPayloadData
      };

      // Schema stamp for future migration
      mergedData._v = 1;

      const rawDataString = JSON.stringify(mergedData);
      
      // 3. UPDATE CLASS ROSTER ROW (batch write — single setValues call prevents partial writes)
      // PERFORMANCE: Use pre-fetched studentRow values instead of 4 separate getValue()
      // remote API calls. This cuts per-student lock hold time from ~1000ms down to ~200ms,
      // preventing end-of-class lock contention when 30 students close lids simultaneously.
      if (rowIndex !== -1) {
        var existingName = (studentRow && studentRow[1]) ? studentRow[1] : '';
        var existingClass = (studentRow && studentRow[2]) ? studentRow[2] : className;
        var existingEmail = (studentRow && studentRow[3]) ? studentRow[3] : '';
        var existingPronouns = (studentRow && studentRow[4]) ? studentRow[4] : '';

        var rosterValues = [
          [studentName || existingName,
           existingClass,
           email || existingEmail,
           pronouns || existingPronouns,
           taskName,
           rawDataString,
           summary,
           now]
        ];
        sheet.getRange(rowIndex, 2, 1, 8).setValues(rosterValues);
      } else {
        sheet.appendRow([
          pin,
          studentName,
          className,
          email,
          pronouns,
          taskName,
          rawDataString,
          summary,
          now
        ]);
        rowIndex = sheet.getLastRow();
      }

      // 4. WRITE TO VISUAL GRADEBOOK ASSIGNMENT COLUMN
      try {
        const assignmentCol = getOrCreateAssignmentColumn(sheet, taskName);
        const tz = ss.getSpreadsheetTimeZone() || "America/Halifax";
        const dateStamp = Utilities.formatDate(now, tz, "MMM d");
        sheet.getRange(rowIndex, assignmentCol).setValue("✅ " + dateStamp);
      } catch (colErr) {
        // Fallback gracefully if sheet structure restricts column additions
        Logger.log('Gradebook column write failed for ' + taskName + ': ' + colErr);
      }

      // 5. CONFIRM-AFTER-WRITE: Return hash + byteLength so client can verify
      var dataHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, rawDataString)
        .map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
      
      return successJSON({ 
        status: 'submitted_successfully',
        task: taskName,
        timestamp: now,
        hash: dataHash,
        byteLength: rawDataString.length,
        version: CONFIG_VERSION
      });
    }
    
    else {
      throw new Error("Unknown action: " + action);
    }
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    if (lockAcquired) {
      try { lock.releaseLock(); } catch(e) {}
    }
  }
}

function successJSON(data) {
  if (!data.status) data.status = 'success';
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Class_Plan tab — the per-section forward plan ("what's next"), editable at
 * any time without logging a class ("change direction"). One row per section:
 * A Section | B NextNote | C ClassNoNext (optional override) | D Updated
 */
function getClassPlanSheet(ss) {
  let sheet = ss.getSheetByName('Class_Plan');
  if (!sheet) {
    sheet = ss.insertSheet('Class_Plan');
    sheet.appendRow(['Section', 'Next Note', 'Next Class #', 'Updated']);
    sheet.getRange("A1:D1").setFontWeight("bold").setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(2, 360);
  }
  return sheet;
}

function readClassPlans(ss) {
  const plans = {};
  const sheet = ss.getSheetByName('Class_Plan');
  if (!sheet || sheet.getLastRow() <= 1) return plans;
  const rows = sheet.getRange(1, 1, sheet.getLastRow(), 4).getValues();
  for (let i = 1; i < rows.length; i++) {
    const section = String(rows[i][0] || '').trim();
    if (!section) continue;
    plans[section] = {
      note: String(rows[i][1] || ''),
      classNo: String(rows[i][2] || '').trim(),
      updated: rows[i][3] || ''
    };
  }
  return plans;
}

function writeClassPlan(ss, section, note, classNo) {
  const sheet = getClassPlanSheet(ss);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const sections = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let r = 0; r < sections.length; r++) {
      if (String(sections[r][0]).trim() === section) {
        const row = sheet.getRange(r + 2, 1, 1, 4).getValues()[0];
        sheet.getRange(r + 2, 2).setValue(note);
        if (classNo) sheet.getRange(r + 2, 3).setValue(String(classNo));
        sheet.getRange(r + 2, 4).setValue(new Date());
        return;
      }
    }
  }
  sheet.appendRow([section, note, classNo ? String(classNo) : '', new Date()]);
}

function clearClassPlan(ss, section) {
  const sheet = ss.getSheetByName('Class_Plan');
  if (!sheet || sheet.getLastRow() <= 1) return;
  const sections = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let r = sections.length - 1; r >= 0; r--) {
    if (String(sections[r][0]).trim() === section) {
      sheet.deleteRow(r + 2);
      return;
    }
  }
}

/**
 * Class_Slide tab — per-section extras for the projector opening slide
 * (Class_Opening_Slide.html). Agenda itself comes from Class_Plan.
 * A Section | B Title | C Announcements | D Outcome | E Updated
 */
function getClassSlideSheet(ss) {
  let sheet = ss.getSheetByName('Class_Slide');
  if (!sheet) {
    sheet = ss.insertSheet('Class_Slide');
    sheet.appendRow(['Section', 'Title', 'Announcements', 'Outcome', 'Updated']);
    sheet.getRange("A1:E1").setFontWeight("bold").setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(3, 360);
    sheet.setColumnWidth(4, 360);
  }
  return sheet;
}

function readClassSlides(ss) {
  const slides = {};
  const sheet = ss.getSheetByName('Class_Slide');
  if (!sheet || sheet.getLastRow() <= 1) return slides;
  const rows = sheet.getRange(1, 1, sheet.getLastRow(), 5).getValues();
  for (let i = 1; i < rows.length; i++) {
    const section = String(rows[i][0] || '').trim();
    if (!section) continue;
    slides[section] = {
      title: String(rows[i][1] || ''),
      announcements: String(rows[i][2] || ''),
      outcome: String(rows[i][3] || ''),
      updated: toIsoStamp(rows[i][4])
    };
  }
  return slides;
}

function writeClassSlide(ss, section, title, announcements, outcome) {
  const sheet = getClassSlideSheet(ss);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const sections = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let r = 0; r < sections.length; r++) {
      if (String(sections[r][0]).trim() === section) {
        sheet.getRange(r + 2, 2, 1, 4).setValues([[title, announcements, outcome, new Date()]]);
        return;
      }
    }
  }
  sheet.appendRow([section, title, announcements, outcome, new Date()]);
}

function clearClassSlide(ss, section) {
  const sheet = ss.getSheetByName('Class_Slide');
  if (!sheet || sheet.getLastRow() <= 1) return;
  const sections = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (let r = sections.length - 1; r >= 0; r--) {
    if (String(sections[r][0]).trim() === section) {
      sheet.deleteRow(r + 2);
      return;
    }
  }
}

/**
 * Sheets auto-converts '2026-09-17' typed into a cell into a real Date —
 * normalize every date cell back to 'YYYY-MM-DD' on read/compare so the log,
 * upsert matching, and deletes work no matter how the row was written.
 */
function toIsoDate(value) {
  if (value instanceof Date) {
    const tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone() || 'America/Halifax';
    return Utilities.formatDate(value, tz, 'yyyy-MM-dd');
  }
  return String(value || '').trim();
}

function toIsoStamp(value) {
  if (value instanceof Date) return value.toISOString();
  return value || '';
}

/**
 * Class_Log tab — teacher's "what we did / what's next" tracker
 * (Class_Log_Tracker.html). Created on first write.
 */
function getClassLogSheet(ss) {
  let sheet = ss.getSheetByName('Class_Log');
  if (!sheet) {
    sheet = ss.insertSheet('Class_Log');
    sheet.appendRow([
      'Date',       // A (YYYY-MM-DD)
      'Section',    // B (e.g. 902-CIT)
      'Course',     // C (e.g. CIT9)
      'Class #',    // D (optional lesson number)
      'What We Did',// E
      'Next Class', // F (what's next / reminders)
      'Timestamp'   // G
    ]);
    sheet.getRange("A1:G1").setFontWeight("bold").setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
    sheet.getRange('A2:A').setNumberFormat('@'); // keep dates as plain text strings
    sheet.setColumnWidth(5, 320);
    sheet.setColumnWidth(6, 320);
  }
  return sheet;
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
