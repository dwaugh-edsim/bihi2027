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

        // 1. If enteredPin is an exact 3-letter PIN in roster
        if (enteredPin && enteredPin.length === 3) {
            const pinMatch = roster.find(s => (s.pin || '').toUpperCase() === enteredPin);
            if (pinMatch) {
                return { student: pinMatch, pin: pinMatch.pin, name: pinMatch.first_name };
            }
        }

        // 2. Search by name (first name, full name, or entered text in either box)
        const clean = str => (str || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        const searchTerms = [enteredName, enteredPin].filter(t => t && t.length >= 2);
        if (searchTerms.length === 0) {
            return { student: null, pin: enteredPin, name: enteredName };
        }

        // Filter by class if provided
        let classStudents = roster;
        if (className) {
            const clsStr = String(className).trim().toLowerCase().replace('cit', '').replace('hl', '').trim();
            const matchedClass = roster.filter(s => String(s.homeroom || '').trim().toLowerCase() === clsStr);
            if (matchedClass.length > 0) classStudents = matchedClass;
        }

        for (const rawTerm of searchTerms) {
            const term = clean(rawTerm);
            if (!term) continue;

            // Direct match: First + Last or Last + First or Full First + Last
            let match = classStudents.find(s => {
                const full1 = clean(`${s.first_name} ${s.last_name}`);
                const full2 = clean(`${s.last_name} ${s.first_name}`);
                const full3 = clean(`${s.full_first_name} ${s.last_name}`);
                return full1 === term || full2 === term || full3 === term;
            });

            // Substring / word match: contains both first and last name words
            if (!match) {
                match = classStudents.find(s => {
                    const fn = clean(s.first_name);
                    const ln = clean(s.last_name);
                    return fn && ln && term.includes(fn) && term.includes(ln);
                });
            }

            // Single first name unique match within the selected class
            if (!match) {
                const firstMatches = classStudents.filter(s => {
                    const fn = clean(s.first_name);
                    const ffn = clean(s.full_first_name);
                    return fn === term || ffn === term || fn.startsWith(term) || term.startsWith(fn);
                });
                if (firstMatches.length === 1) {
                    match = firstMatches[0];
                }
            }

            // Also search across entire school roster if not found in section
            if (!match && classStudents !== roster) {
                match = roster.find(s => {
                    const full1 = clean(`${s.first_name} ${s.last_name}`);
                    const full2 = clean(`${s.last_name} ${s.first_name}`);
                    return full1 === term || full2 === term;
                });
            }

            if (match) {
                return { student: match, pin: match.pin, name: match.first_name, autoResolved: true };
            }
        }

        return { student: null, pin: enteredPin, name: enteredName };
    },

    validateStudent(className, firstName, pin) {
        pin = (pin || '').trim().toUpperCase();
        let enteredName = (firstName || '').trim();

        // Teacher & testing demo overrides
        if (pin === 'TST' || pin === 'WAU' || pin === 'DEV' || pin === 'MRW') {
            return { valid: true, isTeacher: true, name: firstName || 'Teacher Demo', pin: pin || 'WAU' };
        }

        const roster = this.getRoster();
        if (!roster || roster.length === 0) {
            console.warn("Roster data not loaded; bypassing local gate.");
            return { valid: true, unverified: true, name: firstName, pin: pin };
        }

        // Smart Resolution: check if full name or PIN resolves student
        const resolved = this.resolveStudent(className, enteredName, pin);
        if (resolved && resolved.student) {
            const student = resolved.student;
            return { 
                valid: true, 
                student: student, 
                name: student.first_name, 
                pin: student.pin,
                autoResolved: resolved.autoResolved 
            };
        }

        if (!pin && !enteredName) {
            return { valid: false, message: "Please enter your First Name (or Full Name) and 3-Letter PIN." };
        }

        // If PIN was entered but not found in roster
        if (pin && pin.length >= 3) {
            const pinMatch = roster.find(s => (s.pin || '').trim().toUpperCase() === pin);
            if (!pinMatch) {
                return { 
                    valid: false, 
                    message: `❌ Access Denied: PIN "${pin}" is not registered on the official roster.\n\nPlease check your 3-letter PIN slip or look up your name.` 
                };
            }
        }

        return { 
            valid: false, 
            message: `❌ Student not found for "${enteredName || pin}".\n\nPlease enter your registered full name (e.g. "${roster[0]?.first_name} ${roster[0]?.last_name}") or enter your 3-letter PIN.` 
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

        const url = this.getScriptUrl(courseKey);
        try {
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'login',
                    className: className,
                    name: auth.name || firstName,
                    pin: pin
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                Session.set(className, data.name || auth.name || firstName, pin, data.email || '', data.pronouns || '');
            }
            return data;
        } catch (e) {
            console.warn("Offline or Demo Mode:", e);
            Session.set(className, auth.name || firstName, pin);
            return { 
                status: 'success', 
                isOffline: true, 
                name: auth.name || firstName, 
                className: className,
                savedData: {} 
            };
        }
    },

    async submitProfile(taskName, profileData, summaryText, courseKey = 'HL9') {
        const url = this.getScriptUrl(courseKey);
        const pin = (profileData.pin || Session.getPin() || '').trim().toUpperCase();
        const name = (profileData.name || Session.getName() || '').trim();
        const className = profileData.className || Session.getClass();
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

        try {
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'submit_profile',
                    taskName: taskName,
                    className: className,
                    name: name,
                    pin: pin,
                    email: email,
                    pronouns: pronouns,
                    data: profileData,
                    summary: summaryText
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                Session.set(className, name, pin, email, pronouns);
            }
            return data;
        } catch (e) {
            console.warn("Submission error / saving locally:", e);
            const localKey = `submission_${className}_${pin}_${taskName}`;
            localStorage.setItem(localKey, JSON.stringify({
                task: taskName,
                time: new Date().toISOString(),
                data: profileData,
                summary: summaryText
            }));
            return { status: 'success', isOffline: true, message: 'Saved locally on device (offline mode).' };
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
    getClass() { return sessionStorage.getItem('bh_class') || '801'; },
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
