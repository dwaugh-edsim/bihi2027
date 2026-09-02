/**
 * Bicentennial Junior High School — Student Webhook Backend (V3 with Locker Master Sync)
 * Mr. Waugh (Room 8)
 * 
 * Supports:
 * - Multi-class sections (801, 802, 803, 804, 901, 902, 903)
 * - 3-Letter PIN + First Name verification
 * - Cross-device persistence (Intake, Diagnostic & "WHERE" profile)
 * - Dedicated Locker & Combination Master Sync (`Lockers_902` tab)
 */

function getSheetForClass(ss, className) {
  const cleanName = String(className || 'General').trim();
  let sheet = ss.getSheetByName(cleanName);
  if (!sheet) {
    sheet = ss.insertSheet(cleanName);
    sheet.appendRow([
      'PIN',                     // A
      'Student Name',           // B
      'Section',                // C
      'GNSPES Email',           // D
      'Pronouns',               // E
      'Task / Stage',           // F
      'Submission Data (JSON)', // G
      'Formatted Summary',      // H
      'Last Updated'            // I
    ]);
    sheet.getRange("A1:I1").setFontWeight("bold").setBackground('#f1f5f9');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(4, 180);
    sheet.setColumnWidth(7, 280);
    sheet.setColumnWidth(8, 320);
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

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action; 
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ==========================================
    // ACTION: SAVE LOCKERS (Bulk or Single Sync)
    // ==========================================
    if (action === 'save_lockers') {
      const className = String(payload.className || '902').trim();
      const lockerData = payload.lockers || []; // Array of { locker, name, id, pin, combo, notes }
      const sheet = getLockerSheet(ss, className);

      // If full array provided, rewrite cleanly from row 2
      if (Array.isArray(lockerData) && lockerData.length > 0) {
        // Clear old rows below header
        const lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
        }

        const now = new Date();
        const rows = lockerData.map(item => [
          item.locker,
          item.name,
          item.id,
          item.pin,
          item.combo || '',
          item.notes || '',
          now
        ]);

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
    // ACTION: GET LOCKERS
    // ==========================================
    else if (action === 'get_lockers') {
      const className = String(payload.className || '902').trim();
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

      return successJSON({ 
        status: 'lockers_fetched',
        lockers: result
      });
    }

    // ==========================================
    // DEFAULT STUDENT WORKFLOW ACTIONS
    // ==========================================
    const pin = String(payload.pin || '').trim().toUpperCase();
    const className = String(payload.className || 'General').trim();
    
    if (!pin) throw new Error("3-Letter PIN is required.");

    const sheet = getSheetForClass(ss, className);
    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim().toUpperCase() === pin) {
        rowIndex = i + 1;
        break;
      }
    }

    // --- ACTION: LOGIN (Cross-Device Persistence) ---
    if (action === 'login') {
      const name = (payload.name || '').trim();
      
      if (rowIndex !== -1) {
        const savedName = data[rowIndex-1][1];
        const savedEmail = data[rowIndex-1][3];
        const savedPronouns = data[rowIndex-1][4];
        const savedTask = data[rowIndex-1][5];
        let savedDataJSON = {};
        try {
          savedDataJSON = JSON.parse(data[rowIndex-1][6] || '{}');
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
    
    // --- ACTION: SUBMIT / SAVE PROFILE & ASSIGNMENT ---
    else if (action === 'submit_profile' || action === 'submit_assignment' || action === 'submit_diagnostic') {
      const taskName = payload.taskName || 'Intake & Diagnostic Profile';
      const studentName = (payload.name || '').trim();
      const email = (payload.email || '').trim();
      const pronouns = (payload.pronouns || '').trim();
      const rawData = JSON.stringify(payload.data || {});
      const summary = payload.summary || '';
      
      if (rowIndex !== -1) {
        if (studentName) sheet.getRange(rowIndex, 2).setValue(studentName);
        if (email) sheet.getRange(rowIndex, 4).setValue(email);
        if (pronouns) sheet.getRange(rowIndex, 5).setValue(pronouns);
        sheet.getRange(rowIndex, 6).setValue(taskName);
        sheet.getRange(rowIndex, 7).setValue(rawData);
        sheet.getRange(rowIndex, 8).setValue(summary);
        sheet.getRange(rowIndex, 9).setValue(new Date());
      } else {
        sheet.appendRow([
          pin,
          studentName,
          className,
          email,
          pronouns,
          taskName,
          rawData,
          summary,
          new Date()
        ]);
      }
      
      return successJSON({ 
        status: 'submitted_successfully',
        task: taskName,
        timestamp: new Date()
      });
    }
    
    else {
      throw new Error("Unknown action: " + action);
    }
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function successJSON(data) {
  data.status = 'success';
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
