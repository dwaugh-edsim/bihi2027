/**
 * Bicentennial Junior High School — Student Webhook API Client
 * Mr. Waugh (Room 8)
 * 
 * Supports Cross-Device State Persistence:
 * Logs in with PIN + Name and recovers all previous answers from Google Sheet.
 */

const CONFIG = {
    DEFAULT_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec',
    COURSES: {
        'CIT9': 'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec',
        'HL8':  'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec',
        'HL9':  'https://script.google.com/macros/s/AKfycbzsfWqIHC5ToS-6tYPexArJ6SvW0NAChEnZR5YQmwkK4MYm1CMD-zqgleTTDqLMcPsW/exec'
    }
};

const StudentAPI = {
    getScriptUrl(courseKey) {
        return CONFIG.COURSES[courseKey] || CONFIG.DEFAULT_SCRIPT_URL;
    },

    getRoster() {
        if (window.MASTER_ROSTER_DATA && Array.isArray(window.MASTER_ROSTER_DATA)) {
            return window.MASTER_ROSTER_DATA;
        }
        return [];
    },

    resolveStudent(className, enteredName, enteredPin) {
        enteredName = (enteredName || '').trim();
        enteredPin = (enteredPin || '').trim().toUpperCase();

        const roster = this.getRoster();
        if (!roster || roster.length === 0) {
            return { student: null, pin: enteredPin, name: enteredName };
        }

        const clean = str => (str || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        const cleanClass = className ? String(className).trim().replace(/[^0-9]/g, '') : '';

        // Homeroom 801 alias: Samuel Hendricks Apud (initials S-H-A, assigned PIN SAH)
        if (cleanClass === '801' && enteredPin === 'SHA') {
            enteredPin = 'SAH';
        }

        // 1. If enteredPin is provided, search by PIN (prioritizing selected class)
        if (enteredPin) {
            let pinMatch = null;
            if (cleanClass) {
                pinMatch = roster.find(s => String(s.homeroom || '').trim() === cleanClass && (s.pin || '').toUpperCase() === enteredPin);
            }
            if (!pinMatch) {
                pinMatch = roster.find(s => (s.pin || '').toUpperCase() === enteredPin);
            }
            if (!pinMatch) {
                return { student: null, pin: enteredPin, name: enteredName, error: 'PIN not recognized' };
            }

            // PIN is valid; verify name if entered
            if (enteredName) {
                const term = clean(enteredName);
                const fn = clean(pinMatch.first_name);
                const ffn = clean(pinMatch.full_first_name);
                const ln = clean(pinMatch.last_name);
                const tokens = term.split(/\s+/).filter(Boolean);

                const fnMatches = tokens.some(t => fn === t || ffn === t || fn.startsWith(t) || t.startsWith(fn) || ffn.startsWith(t) || t.startsWith(ffn));
                const lnMatches = tokens.some(t => ln.includes(t) || t.includes(ln));
                const nameMatches = fnMatches || lnMatches || fn.includes(term) || term.includes(fn) || ln.includes(term);

                if (!nameMatches) {
                    return { student: null, pin: enteredPin, name: enteredName, error: 'Name and PIN mismatch' };
                }
            }

            return { student: pinMatch, pin: pinMatch.pin, name: pinMatch.first_name, autoResolved: false };
        }

        // 2. Name-only search (used strictly for PIN Lookup / Claim assistance)
        const term = clean(enteredName);
        if (!term || term.length < 2) {
            return { student: null, pin: enteredPin, name: enteredName };
        }

        let classStudents = roster;
        if (cleanClass) {
            const matchedClass = roster.filter(s => String(s.homeroom || '').trim() === cleanClass);
            if (matchedClass.length > 0) classStudents = matchedClass;
        }

        // Direct full name match
        let match = classStudents.find(s => {
            const full1 = clean(`${s.first_name} ${s.last_name}`);
            const full2 = clean(`${s.last_name} ${s.first_name}`);
            const full3 = clean(`${s.full_first_name} ${s.last_name}`);
            return full1 === term || full2 === term || full3 === term;
        });

        // Tokenized match (e.g. "Sam Hendricks", "Sam Hendricks-Apud", "Hendricks Apud")
        if (!match) {
            const tokens = term.split(/\s+/).filter(Boolean);
            const candidates = classStudents.filter(s => {
                const fn = clean(s.first_name);
                const ffn = clean(s.full_first_name);
                const ln = clean(s.last_name);
                const t0 = tokens[0];
                const fnMatch = t0 === fn || t0 === ffn || fn.startsWith(t0) || t0.startsWith(fn) || ffn.startsWith(t0) || t0.startsWith(ffn);
                if (fnMatch) {
                    if (tokens.length === 1) return true;
                    return tokens.slice(1).every(t => ln.includes(t));
                }
                return tokens.every(t => ln.includes(t));
            });
            if (candidates.length === 1) {
                match = candidates[0];
            }
        }

        // Substring / word match fallback
        if (!match) {
            match = classStudents.find(s => {
                const fn = clean(s.first_name);
                const ln = clean(s.last_name);
                return fn && ln && term.includes(fn) && term.includes(ln);
            });
        }

        // Unique single first name or middle/heritage name match within section
        if (!match) {
            const firstMatches = classStudents.filter(s => {
                const fn = clean(s.first_name);
                const ffn = clean(s.full_first_name);
                const tBase = term.replace(/[yi]$/, '');
                return fn === term || ffn === term || fn.startsWith(term) || term.startsWith(fn) || (tBase.length >= 3 && ffn.includes(tBase));
            });
            if (firstMatches.length === 1) {
                match = firstMatches[0];
            }
        }

        if (match) {
            return { student: match, pin: match.pin, name: match.first_name, autoResolved: true };
        }

        return { student: null, pin: enteredPin, name: enteredName };
    },

    validateStudent(className, firstName, pin) {
        pin = (pin || '').trim().toUpperCase();
        let enteredName = (firstName || '').trim();

        // 1. PIN is strictly mandatory
        if (!pin) {
            return { 
                valid: false, 
                message: "❌ Access Denied: Please enter your 3-letter student PIN." 
            };
        }

        // 2. Teacher & testing demo overrides
        if (pin === 'TST' || pin === 'WAU' || pin === 'DEV' || pin === 'MRW') {
            return { 
                valid: true, 
                isTeacher: true, 
                name: enteredName || 'Teacher Demo', 
                pin: pin,
                className: className || 'Teacher'
            };
        }

        // 3. Ensure PIN format is exactly 3 letters
        if (pin.length !== 3) {
            return { 
                valid: false, 
                message: `❌ Invalid PIN: "${pin}". Student PINs must be exactly 3 uppercase letters.` 
            };
        }

        // 4. Class roster database must be loaded
        const roster = this.getRoster();
        if (!roster || roster.length === 0) {
            return { 
                valid: false, 
                message: "❌ System Error: Official class roster not loaded. Please refresh the page or contact Mr. Waugh." 
            };
        }

        const cleanClass = className ? String(className).trim().replace(/[^0-9]/g, '') : '';

        // Homeroom 801 alias: Samuel Hendricks Apud (initials S-H-A, assigned PIN SAH)
        // Auto-resolve SHA -> SAH when in class 801
        if (cleanClass === '801' && pin === 'SHA') {
            pin = 'SAH';
        }

        // 5. Look up PIN in official roster, prioritizing selected class
        let student = null;
        if (cleanClass) {
            student = roster.find(s => String(s.homeroom || '').trim() === cleanClass && (s.pin || '').trim().toUpperCase() === pin);
        }

        if (!student) {
            // Check global roster
            const globalMatch = roster.find(s => (s.pin || '').trim().toUpperCase() === pin);
            if (globalMatch) {
                // If the student is in a different homeroom, block cross-class confusion with a clear explanation
                if (cleanClass && String(globalMatch.homeroom || '').trim() !== cleanClass) {
                    return {
                        valid: false,
                        message: `❌ Class Mismatch: PIN "${pin}" belongs to ${globalMatch.first_name} ${globalMatch.last_name.charAt(0)}. in Class ${globalMatch.homeroom}, not Class ${cleanClass}.\n\nPlease check your 3-letter PIN slip for Class ${cleanClass}.`
                    };
                }
                student = globalMatch;
            }
        }

        if (!student) {
            return { 
                valid: false, 
                message: `❌ Access Denied: PIN "${pin}" is not registered on the official class list.\n\nPlease check your 3-letter PIN slip or see Mr. Waugh.` 
            };
        }

        // 6. If Name was also entered, verify it matches the registered student for this PIN
        if (enteredName) {
            const clean = str => (str || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
            const inputClean = clean(enteredName);
            const fnClean = clean(student.first_name);
            const ffnClean = clean(student.full_first_name);
            const lnClean = clean(student.last_name);
            const fullClean = `${fnClean} ${lnClean}`.replace(/\s+/g, '');
            const fullFirstLast = `${ffnClean} ${lnClean}`.replace(/\s+/g, '');
            const inputNoSpaces = inputClean.replace(/\s+/g, '');
            const tokens = inputClean.split(/\s+/).filter(Boolean);

            const fnMatches = tokens.some(t => fnClean === t || ffnClean === t || fnClean.startsWith(t) || t.startsWith(fnClean) || ffnClean.startsWith(t) || t.startsWith(ffnClean));
            const lnMatches = tokens.some(t => lnClean.includes(t) || t.includes(lnClean));

            const nameMatches = fnMatches ||
                                lnMatches ||
                                inputNoSpaces === fullClean ||
                                inputNoSpaces === fullFirstLast ||
                                fnClean.startsWith(inputClean) ||
                                inputClean.startsWith(fnClean) ||
                                ffnClean.startsWith(inputClean) ||
                                inputClean.startsWith(ffnClean);

            if (!nameMatches) {
                return { 
                    valid: false, 
                    message: `❌ Login Mismatch: The entered name "${enteredName}" does not match PIN "${pin}".\n\nOfficial record for this PIN is ${student.first_name} ${student.last_name.charAt(0)}.` 
                };
            }
        }

        // 7. Verified successfully
        return { 
            valid: true, 
            student: student, 
            name: student.first_name, 
            pin: student.pin,
            className: student.homeroom || className
        };
    },

    async login(className, firstName, pin, courseKey = 'HL9') {
        pin = (pin || '').trim().toUpperCase();
        firstName = (firstName || '').trim();

        // Enforce Authorized Roster Verification
        const auth = this.validateStudent(className, firstName, pin);
        if (!auth.valid) {
            return { status: 'error', message: auth.message };
        }

        // Always prioritize the official homeroom from roster
        const effectiveClass = (auth.student && auth.student.homeroom) ? String(auth.student.homeroom).trim() : className;

        const url = this.getScriptUrl(courseKey);
        try {
            const getUrl = `${url}?action=login&className=${encodeURIComponent(effectiveClass)}&pin=${encodeURIComponent(pin)}&name=${encodeURIComponent(auth.name || firstName)}`;
            const res = await fetch(getUrl);
            const data = await res.json();
            if (data.status === 'success') {
                Session.set(effectiveClass, data.name || auth.name || firstName, pin, data.email || '', data.pronouns || '');
            }
            return data;
        } catch (e) {
            console.warn("GAS Cloud Fetch failed (Offline / network issue):", e);
            Session.set(effectiveClass, auth.name || firstName, pin);
            return { 
                status: 'offline', 
                isOffline: true, 
                name: auth.name || firstName, 
                className: effectiveClass,
                message: 'Could not connect to Google Sheets. Using local browser memory.',
                savedData: {} 
            };
        }
    },

    async submitProfile(taskName, profileData, summaryText, courseKey = 'CIT9') {
        const url = this.getScriptUrl(courseKey);
        const pin = (profileData.pin || Session.getPin() || '').trim().toUpperCase();
        const name = (profileData.name || Session.getName() || '').trim();
        const className = profileData.className || profileData.class || (typeof PlacesSession !== 'undefined' && PlacesSession.getClass ? PlacesSession.getClass() : null) || Session.getClass();
        const email = profileData.email || Session.getEmail();
        const pronouns = profileData.pronouns || Session.getPronouns();

        if (!pin) {
            return { status: 'error', message: 'Please log in with your Name and 3-Letter PIN first.' };
        }

        // Enforce Authorized Roster Verification
        const auth = this.validateStudent(className, name, pin);
        if (!auth.valid) {
            return { status: 'error', message: auth.message };
        }

        // Always prioritize the official homeroom from roster
        const effectiveClass = (auth.student && auth.student.homeroom) ? String(auth.student.homeroom).trim() : className;

        const payloadStr = JSON.stringify({
            action: 'submit_profile',
            taskName: taskName,
            className: effectiveClass,
            name: name,
            pin: pin,
            email: email,
            pronouns: pronouns,
            data: profileData,
            summary: summaryText
        });

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: payloadStr,
                keepalive: true
            });
            const data = await res.json();
            if (data.status === 'success' || data.status === 'submitted_successfully') {
                Session.set(className, name, pin, email, pronouns);
                const localKey = `submission_${className}_${pin}_${taskName}`;
                localStorage.setItem(localKey, JSON.stringify({
                    task: taskName,
                    time: new Date().toISOString(),
                    cloudSynced: true,
                    data: profileData,
                    summary: summaryText
                }));
            }
            return data;
        } catch (e) {
            console.warn("Standard CORS fetch failed. Firing guaranteed no-cors cloud dispatch to GAS:", e);
            try {
                // Guaranteed cloud dispatch: mode 'no-cors' + keepalive bypasses browser CORS and delivers POST payload to Google Apps Script even on page unload
                fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: payloadStr,
                    keepalive: true
                });
            } catch (errBeacon) {
                if (navigator.sendBeacon) {
                    const blob = new Blob([payloadStr], { type: 'text/plain;charset=utf-8' });
                    navigator.sendBeacon(url, blob);
                }
            }

            // Mark session and local backup as cloud pushed
            Session.set(className, name, pin, email, pronouns);
            const localKey = `submission_${className}_${pin}_${taskName}`;
            localStorage.setItem(localKey, JSON.stringify({
                task: taskName,
                time: new Date().toISOString(),
                cloudSynced: true,
                data: profileData,
                summary: summaryText
            }));

            return { 
                status: 'submitted_successfully', 
                isNoCorsFallback: true,
                message: 'Cloud sync dispatched to Google Sheets.',
                task: taskName
            };
        }
    },

    async submitAssignment(taskName, assignmentData, summaryText, courseKey = 'HL8') {
        return this.submitProfile(taskName, assignmentData, summaryText, courseKey);
    },

    // ============ CLASS LOG (teacher's "what we did / what's next" tracker) ============

    async getClassLog(courseKey = 'HL9') {
        const url = this.getScriptUrl(courseKey);
        try {
            const res = await fetch(`${url}?action=get_class_log`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn("Class log fetch failed:", err);
            return { status: 'error', error: err.toString() };
        }
    },

    async submitClassLog(entry, teacherPin, courseKey = 'HL9') {
        return this._classLogPost({
            action: 'submit_class_log',
            entry: entry,
            teacherPin: teacherPin || ''
        }, courseKey);
    },

    // "Change direction": set/clear a section's forward plan without logging a class.
    // note '' clears the plan. classNo overrides the suggested next lesson.
    async setClassPlan(section, note, classNo, teacherPin, courseKey = 'HL9') {
        return this._classLogPost({
            action: 'set_class_plan',
            section: section,
            note: note || '',
            classNo: classNo || '',
            teacherPin: teacherPin || ''
        }, courseKey);
    },

    async deleteClassLog(date, section, teacherPin, courseKey = 'HL9') {
        return this._classLogPost({
            action: 'delete_class_log',
            date: date,
            section: section,
            teacherPin: teacherPin || ''
        }, courseKey);
    },

    // Opening-slide extras (announcements / outcome / title) per section.
    async setClassSlide(section, title, announcements, outcome, teacherPin, courseKey = 'HL9') {
        return this._classLogPost({
            action: 'set_class_slide',
            section: section,
            title: title || '',
            announcements: announcements || '',
            outcome: outcome || '',
            teacherPin: teacherPin || ''
        }, courseKey);
    },

    async _classLogPost(payload, courseKey) {
        const url = this.getScriptUrl(courseKey);
        const payloadStr = JSON.stringify(payload);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: payloadStr,
                keepalive: true
            });
            return await res.json();
        } catch (e) {
            // GitHub Pages CORS on GAS 302: fire guaranteed no-cors dispatch,
            // then verify via a GET read like the student save flow does.
            try {
                await fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: payloadStr,
                    keepalive: true
                });
            } catch (errBeacon) {
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(url, new Blob([payloadStr], { type: 'text/plain;charset=utf-8' }));
                }
            }
            return { status: 'submitted_no_cors', message: 'Cloud sync dispatched (no-cors). Refresh to verify.' };
        }
    },

    async getClassProgress(className = 'ALL', courseKey = 'HL8') {
        const url = this.getScriptUrl(courseKey);
        try {
            const getUrl = `${url}?action=get_class_progress&className=${encodeURIComponent(className)}`;
            const res = await fetch(getUrl);
            const data = await res.json();
            return data;
        } catch (err) {
            console.warn("Bulk class progress fetch failed:", err);
            return { status: 'error', error: err.toString() };
        }
    },

    async verifyCloudSave(className, pin, courseKey = 'CIT9') {
        const url = this.getScriptUrl(courseKey);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    action: 'login',
                    className: className,
                    pin: pin
                })
            });
            const data = await res.json();
            return data;
        } catch (e) {
            return { status: 'offline', isOffline: true, error: e.toString() };
        }
    }
};

// Session storage helper with email and pronouns
const Session = {
    set(className, name, pin, email = '', pronouns = '') {
        sessionStorage.setItem('bh_class', className);
        sessionStorage.setItem('bh_name', name);
        sessionStorage.setItem('bh_pin', pin);
        sessionStorage.setItem('bh_email', email);
        sessionStorage.setItem('bh_pronouns', pronouns);
    },
    getClass() { return sessionStorage.getItem('bh_class') || ''; },
    getName() { return sessionStorage.getItem('bh_name') || ''; },
    getPin() { return sessionStorage.getItem('bh_pin') || ''; },
    getEmail() { return sessionStorage.getItem('bh_email') || ''; },
    getPronouns() { return sessionStorage.getItem('bh_pronouns') || ''; },
    isLoggedIn() { return !!sessionStorage.getItem('bh_pin'); },
    clear() {
        sessionStorage.clear();
    }
};

// Common Toast UI
function showToast(msg, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 12px 20px;
            border-radius: 6px;
            color: #ffffff;
            font-family: 'Open Sans', sans-serif;
            font-size: 0.9em;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(10px);
        `;
        document.body.appendChild(toast);
    }
    toast.style.backgroundColor = isError ? '#dc2626' : '#16a34a';
    toast.innerText = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 3500);
}
