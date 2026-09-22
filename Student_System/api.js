/**
 * Bicentennial Junior High School — Student Webhook API Client
 * Mr. Waugh (Room 8)
 * 
 * Supports Cross-Device State Persistence:
 * Logs in with PIN + Name and recovers all previous answers from Google Sheet.
 */

const CONFIG = {
    DEFAULT_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec',
    MIN_SERVER_VERSION: 'V6.0-2026-09-20',
    COURSES: {
        'CIT9': 'https://script.google.com/macros/s/AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec',
        'HL8':  'https://script.google.com/macros/s/AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec',
        'HL9':  'https://script.google.com/macros/s/AKfycby8XaHRRj07UUQ-4NTK7AH4s2qVp3GKe6XRyMA_tGLap52ZUWYg2faJbVhIB7Ea7_VJ/exec'
    }
};

// ==========================================
// EFFORT TELEMETRY (counts only — never content)
// Keystroke/paste counters + time-on-page, stamped into every submitProfile
// payload as data._telemetry so effort can be compared against output later.
// No keystroke text is ever recorded — just counts. Resets on page reload.
// (Pattern borrowed from the MM Studies Justice prototype, spring 2026.)
// ==========================================
const EffortTelemetry = {
    start: Date.now(),
    keystrokes: 0,
    pastes: 0,
    wired: false,
    wire() {
        if (this.wired || typeof document === 'undefined') return;
        this.wired = true;
        document.addEventListener('keydown', () => { this.keystrokes++; });
        document.addEventListener('paste', () => { this.pastes++; });
    },
    snapshot() {
        this.wire();
        return {
            keystrokes: this.keystrokes,
            pastes: this.pastes,
            duration_sec: Math.round((Date.now() - this.start) / 1000)
        };
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

    // ==========================================
    // SERVER-SIDE PIN RESOLUTION (privacy: the private PIN roster lives in
    // the GAS 'Roster_Private' tab, never in this public site's files)
    // ==========================================
    async resolveStudentRemote(pin, courseKey) {
        pin = (pin || '').trim().toUpperCase();
        if (!pin) return { ok: false, reason: 'empty' };
        // Skip-cache: once we learn the deployed GAS predates resolve_student
        // (or is unreachable), stop probing for a while so kid logins stay
        // instant via the roster fallback.
        try {
            const skipUntil = Number(sessionStorage.getItem('gas_resolve_skip_until') || 0);
            if (Date.now() < skipUntil) return { ok: false, reason: 'unsupported' };
        } catch (e) { /* storage unavailable */ }
        const url = this.getScriptUrl(courseKey);
        let lastError = null;
        for (let attempt = 1; attempt <= 2; attempt++) {
            const ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            const timer = ctrl ? setTimeout(() => ctrl.abort(), 4000) : null;
            try {
                const res = await fetch(
                    `${url}?action=resolve_student&pin=${encodeURIComponent(pin)}`,
                    ctrl ? { signal: ctrl.signal } : undefined
                );
                const data = await res.json();
                if (data && data.version) this.validateServerVersion(data.version);
                if (data && data.status === 'success' && typeof data.valid === 'boolean') {
                    if (!data.valid) return { ok: true, valid: false };
                    const info = {
                        className: String(data.className || 'General'),
                        firstName: String(data.firstName || ''),
                        lastInitial: String(data.lastInitial || ''),
                        demo: !!data.demo,
                        at: Date.now()
                    };
                    try { sessionStorage.setItem('gas_resolve_' + pin, JSON.stringify(info)); } catch (e) { /* storage full/private mode */ }
                    return Object.assign({ ok: true, valid: true }, info);
                }
                // Server answered but has no resolve_student (pre-V6.3 GAS):
                // stop probing for 30 minutes.
                try { sessionStorage.setItem('gas_resolve_skip_until', String(Date.now() + 30 * 60 * 1000)); } catch (e) { /* ignore */ }
                return { ok: false, reason: 'unsupported' };
            } catch (e) {
                lastError = e;
                if (attempt < 2) {
                    await new Promise(r => setTimeout(r, 400));
                }
            } finally {
                if (timer) clearTimeout(timer);
            }
        }
        console.warn('resolve_student unreachable after retries (offline?):', lastError);
        // Hard-timeout/network failures: stop probing for 10 minutes.
        try { sessionStorage.setItem('gas_resolve_skip_until', String(Date.now() + 10 * 60 * 1000)); } catch (e) { /* ignore */ }
        return { ok: false, reason: 'network' };
    },

    getCachedResolve(pin) {
        try {
            const raw = sessionStorage.getItem('gas_resolve_' + String(pin || '').trim().toUpperCase());
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    // Server-first PIN validation. Falls back to the legacy client-side roster
    // check whenever the GAS is unreachable or predates resolve_student, so
    // this rollout is safe on both old and new deployments.
    async validateStudent(className, firstName, pin) {
        pin = (pin || '').trim().toUpperCase();
        const enteredName = (firstName || '').trim();

        // 1. PIN is strictly mandatory
        if (!pin) {
            return {
                valid: false,
                message: "❌ Access Denied: Please enter your 3-letter student PIN."
            };
        }

        // 2. Teacher & testing demo overrides (stay client-side for offline use)
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

        // 4. Server-first: validate against the GAS private roster
        const remote = await this.resolveStudentRemote(pin);
        if (remote.ok && remote.valid) {
            const student = {
                homeroom: remote.className,
                first_name: remote.firstName || enteredName,
                last_name: remote.lastInitial ? remote.lastInitial + '.' : '',
                pin: pin,
                verified_server: true
            };
            return {
                valid: true,
                student: student,
                name: student.first_name,
                pin: pin,
                className: remote.className
            };
        }
        if (remote.ok && !remote.valid) {
            return {
                valid: false,
                message: `❌ Access Denied: PIN "${pin}" is not registered on the official class list.\n\nPlease check your 3-letter PIN slip or see Mr. Waugh.`
            };
        }

        // 5. Fallback: old GAS or offline — legacy roster check
        return this._validateStudentRoster(className, enteredName, pin);
    },

    // Legacy client-side roster validation (kept as the offline / old-GAS path)
    _validateStudentRoster(className, enteredName, pin) {
        enteredName = (enteredName || '').trim();

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
            // Check global roster — auto-resolve homeroom if student selected wrong class in dropdown
            const globalMatch = roster.find(s => (s.pin || '').trim().toUpperCase() === pin);
            if (globalMatch) {
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

        // Enforce Authorized Roster Verification (server-first, roster fallback)
        const auth = await this.validateStudent(className, firstName, pin);
        if (!auth.valid) {
            return { status: 'error', message: auth.message };
        }

        // Always prioritize the official homeroom from roster
        const effectiveClass = (auth.student && auth.student.homeroom) ? String(auth.student.homeroom).trim() : className;

        const url = this.getScriptUrl(courseKey);
        let lastError = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const getUrl = `${url}?action=login&className=${encodeURIComponent(effectiveClass)}&pin=${encodeURIComponent(pin)}&name=${encodeURIComponent(auth.name || firstName)}`;
                const res = await fetch(getUrl);
                const data = await res.json();
                if (data.status === 'success') {
                    if (data.version) this.validateServerVersion(data.version);
                    Session.set(effectiveClass, data.name || auth.name || firstName, pin, data.email || '', data.pronouns || '');
                    return data;
                } else if (data.status === 'error') {
                    return data;
                }
            } catch (e) {
                lastError = e;
                if (attempt < 3) {
                    await new Promise(r => setTimeout(r, 600 * attempt));
                }
            }
        }

        console.warn("GAS Cloud Fetch failed after retries (Offline / network issue):", lastError);
        Session.set(effectiveClass, auth.name || firstName, pin);
        return { 
            status: 'offline', 
            isOffline: true, 
            error: true,
            name: auth.name || firstName, 
            className: effectiveClass, 
            message: 'Could not connect to Google Sheets. Server busy or network hiccup.',
            savedData: null 
        };
    },

    // ==========================================
    // SERVER VERSION WATCHDOG & INTEGRITY GUARD
    // ==========================================
    _isVersionOlder(currentVer, minVer) {
        if (!currentVer) return true; // Unversioned (e.g. legacy V5) is always considered outdated
        minVer = minVer || CONFIG.MIN_SERVER_VERSION;
        if (currentVer === minVer) return false;

        const parse = (v) => {
            const m = String(v).trim().match(/^V?(\d+)(?:\.(\d+))?(?:-(\d{4}-\d{2}-\d{2}))?/i);
            if (!m) return { major: 0, minor: 0, date: '' };
            return {
                major: parseInt(m[1] || '0', 10),
                minor: parseInt(m[2] || '0', 10),
                date: m[3] || ''
            };
        };

        const c = parse(currentVer);
        const req = parse(minVer);

        if (c.major < req.major) return true;
        if (c.major > req.major) return false;
        if (c.minor < req.minor) return true;
        if (c.minor > req.minor) return false;
        if (req.date && c.date && c.date < req.date) return true;
        return false;
    },

    showVersionAlertBanner(reportedVersion, requiredVersion) {
        if (typeof document === 'undefined') return;
        if (document.getElementById('gas-version-alert-banner')) return; // already shown

        requiredVersion = requiredVersion || CONFIG.MIN_SERVER_VERSION;
        const displayVer = reportedVersion ? String(reportedVersion) : 'Legacy / Pre-V6 (Unversioned)';

        const banner = document.createElement('div');
        banner.id = 'gas-version-alert-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 9999999;
            background: #b91c1c;
            color: #ffffff;
            padding: 12px 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.45);
            line-height: 1.4;
            border-bottom: 3px solid #7f1d1d;
        `;
        banner.innerHTML = `
            <div style="max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 14px;">
                <span style="font-size: 26px; line-height: 1;">⚠️</span>
                <div>
                    <div style="font-size: 15px; letter-spacing: 0.2px;">
                        SYSTEM NOTICE: Please pause and tell <u>Mr. Waugh</u> you are seeing this screen.
                    </div>
                    <div style="font-size: 12px; font-weight: 500; opacity: 0.95; margin-top: 3px;">
                        Database Update Required: Page requires server <strong>${requiredVersion}</strong>, but Google Apps Script is running <strong>${displayVer}</strong>.
                    </div>
                </div>
            </div>
        `;
        document.body.prepend(banner);

        // Adjust top spacing so banner doesn't cover top navbar
        const currentPad = parseInt(window.getComputedStyle(document.body).paddingTop || '0', 10);
        document.body.style.paddingTop = (currentPad + 60) + 'px';
        console.error(`[StudentAPI] 🚨 Server version mismatch! Required: ${requiredVersion}, Reported: ${displayVer}`);
    },

    validateServerVersion(version) {
        if (!version || this._isVersionOlder(version, CONFIG.MIN_SERVER_VERSION)) {
            this.showVersionAlertBanner(version, CONFIG.MIN_SERVER_VERSION);
            return false;
        }
        return true;
    },

    async checkServerVersion(courseKey = 'CIT9') {
        const url = `${this.getScriptUrl(courseKey)}?action=get_health`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data && data.version) {
                return this.validateServerVersion(data.version);
            } else {
                this.showVersionAlertBanner('Pre-V6 (Legacy)', CONFIG.MIN_SERVER_VERSION);
                return false;
            }
        } catch (e) {
            // Offline or network block: do not show false alarm (offline banner/toast handles connection)
            return null;
        }
    },

    // In-memory state tracking to prevent duplicate/redundant saves during end-of-class crunch
    _lastSavedHashes: {},
    _inFlightSaves: {},

    // Fast hash to detect if payload has changed since last confirmed save
    _hashPayload(data) {
        try {
            const str = (typeof data === 'string') ? data : JSON.stringify(data);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0;
            }
            return hash.toString(36) + '_' + str.length;
        } catch(e) {
            return null;
        }
    },

    // Generate a unique request ID for idempotency
    _generateRequestId() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback for older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    },

    async submitProfile(taskName, profileData, summaryText, courseKey = 'CIT9', options = {}) {
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
        const auth = await this.validateStudent(className, name, pin);
        if (!auth.valid) {
            return { status: 'error', message: auth.message };
        }

        // Always prioritize the official homeroom from roster
        const effectiveClass = (auth.student && auth.student.homeroom) ? String(auth.student.homeroom).trim() : className;

        // Effort telemetry (counts only) rides every save. It is part of the payload
        // hash: counters only advance with real activity and autosaves only fire on
        // activity, so the unchanged-skip keeps its meaning.
        profileData._telemetry = EffortTelemetry.snapshot();

        const saveKey = `${pin}_${taskName}`;
        const currentHash = this._hashPayload(profileData);

        // END-OF-CLASS CRUNCH OPTIMIZATION:
        // 1. If payload is identical to last confirmed save and not forced, skip network call
        if (!options.force && currentHash && this._lastSavedHashes[saveKey] === currentHash) {
            console.log(`[api.js] End-of-class save skipped for "${taskName}": payload unchanged since last confirmed cloud save.`);
            return {
                status: 'submitted_successfully',
                task: taskName,
                unchanged: true,
                message: 'Data already synced with cloud.'
            };
        }

        // 2. If identical save is already in-flight with keepalive, do not double-dispatch
        if (this._inFlightSaves[saveKey] === currentHash) {
            console.log(`[api.js] In-flight save active with keepalive for "${taskName}": skipping duplicate dispatch.`);
            return {
                status: 'submitted_successfully',
                task: taskName,
                inFlight: true,
                message: 'Save already in progress.'
            };
        }

        this._inFlightSaves[saveKey] = currentHash;

        // Generate idempotency key to prevent double-writes on retry
        const requestId = this._generateRequestId();

        const payloadObj = {
            action: 'submit_profile',
            taskName: taskName,
            className: effectiveClass,
            name: name,
            pin: pin,
            email: email,
            pronouns: pronouns,
            data: profileData,
            summary: summaryText,
            requestId: requestId
        };
        const payloadStr = JSON.stringify(payloadObj);

        const localKey = `submission_${effectiveClass}_${pin}_${taskName}`;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: payloadStr,
                keepalive: true
            });
            const data = await res.json();
            if (data.status === 'success' || data.status === 'submitted_successfully') {
                this.validateServerVersion(data.version);
                this._lastSavedHashes[saveKey] = currentHash;
                Session.set(className, name, pin, email, pronouns);
                localStorage.setItem(localKey, JSON.stringify({
                    task: taskName,
                    time: new Date().toISOString(),
                    cloudSynced: true,
                    serverHash: data.hash || null,
                    serverByteLength: data.byteLength || null,
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

            // CHROMEBOOK REALITY: localStorage is wiped on logout. We cannot rely on
            // cross-session replay. Instead, verify the save landed RIGHT NOW (same session)
            // by scheduling a verifyCloudSave() GET after a short delay. The debounced
            // autosave will also re-fire within seconds, providing additional coverage.
            Session.set(className, name, pin, email, pronouns);

            // Same-session local backup (ephemeral — wiped on Chromebook logout)
            try {
                localStorage.setItem(localKey, JSON.stringify({
                    task: taskName,
                    time: new Date().toISOString(),
                    cloudSynced: false,
                    syncStatus: 'pending_verification',
                    requestId: requestId,
                    courseKey: courseKey,
                    data: profileData,
                    summary: summaryText
                }));
            } catch (storageErr) { /* localStorage may be unavailable */ }

            // IMMEDIATE IN-SESSION VERIFICATION: Fire a verifyCloudSave() GET after 3s
            // to confirm the no-cors POST actually landed. If it didn't, the next
            // debounced autosave (which fires every few seconds) will retry with a new
            // requestId because _lastSavedHashes is not stamped until confirmed here.
            const verifyPin = pin;
            const verifyClass = effectiveClass;
            const verifyCourse = courseKey;
            const verifyKey = localKey;
            const verifyHash = currentHash;
            const verifySaveKey = saveKey;
            setTimeout(async function() {
                try {
                    const check = await StudentAPI.verifyCloudSave(verifyClass, verifyPin, verifyCourse);
                    if (check && check.savedData && check.savedData._tasks && check.savedData._tasks[taskName]) {
                        console.log('[api.js] no-cors save CONFIRMED via verify check');
                        StudentAPI._lastSavedHashes[verifySaveKey] = verifyHash;
                        try {
                            const stored = JSON.parse(localStorage.getItem(verifyKey) || '{}');
                            stored.cloudSynced = true;
                            stored.syncStatus = 'confirmed';
                            localStorage.setItem(verifyKey, JSON.stringify(stored));
                        } catch(se) { /* ok */ }
                    } else {
                        console.warn('[api.js] no-cors save NOT YET confirmed — next autosave will retry');
                    }
                } catch (verifyErr) {
                    console.warn('[api.js] Verify check failed (network still down?):', verifyErr);
                }
            }, 3000);

            return { 
                status: 'submitted_successfully', 
                isNoCorsFallback: true,
                syncStatus: 'pending_verification',
                message: 'Cloud sync dispatched. Verifying in background...',
                task: taskName
            };
        } finally {
            delete this._inFlightSaves[saveKey];
        }
    },

    /**
     * Emergency Beacon Sync for Chromebook lid close / page unload.
     * Guaranteed transmission via fetch with keepalive or navigator.sendBeacon.
     * Skips silently if payload has not changed since the last confirmed cloud save.
     */
    sendEmergencyBeacon(taskName, profileData, summaryText, courseKey = 'CIT9') {
        const pin = (profileData.pin || Session.getPin() || '').trim().toUpperCase();
        if (!pin || pin.length < 3 || pin === '---' || pin === 'WAU' || pin === 'MRW') return false;

        // Effort telemetry rides emergency saves too (stamped before hashing)
        profileData._telemetry = EffortTelemetry.snapshot();

        const saveKey = `${pin}_${taskName}`;
        const currentHash = this._hashPayload(profileData);

        if (currentHash && this._lastSavedHashes[saveKey] === currentHash) {
            console.log(`[api.js] Emergency beacon skipped for "${taskName}": already synced with cloud.`);
            return false;
        }

        const url = this.getScriptUrl(courseKey);
        const className = profileData.className || profileData.class || Session.getClass() || 'General';
        const name = profileData.name || Session.getName() || '';
        const requestId = this._generateRequestId();

        const payloadObj = {
            action: 'submit_profile',
            taskName: taskName,
            className: className,
            name: name,
            pin: pin,
            email: profileData.email || Session.getEmail() || '',
            pronouns: profileData.pronouns || Session.getPronouns() || '',
            data: profileData,
            summary: summaryText || `Emergency Beacon (${taskName})`,
            requestId: requestId
        };
        const payloadStr = JSON.stringify(payloadObj);

        try {
            if (navigator.sendBeacon) {
                const blob = new Blob([payloadStr], { type: 'text/plain;charset=utf-8' });
                const queued = navigator.sendBeacon(url, blob);
                if (queued) {
                    this._lastSavedHashes[saveKey] = currentHash;
                    return true;
                } else {
                    delete this._lastSavedHashes[saveKey];
                    console.warn('[api.js] sendBeacon queue full; beacon not sent.');
                    return false;
                }
            } else {
                fetch(url, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: payloadStr,
                    keepalive: true
                });
                this._lastSavedHashes[saveKey] = currentHash;
                return true;
            }
        } catch (e) {
            delete this._lastSavedHashes[saveKey];
            console.warn('[api.js] Emergency beacon failed:', e);
            return false;
        }
    },

    async submitAssignment(taskName, assignmentData, summaryText, courseKey = 'HL8') {
        return this.submitProfile(taskName, assignmentData, summaryText, courseKey);
    },

    /**
     * Replay any pending (unverified) saves from localStorage.
     * 
     * CHROMEBOOK NOTE: This only works WITHIN the same login session (e.g., student
     * switches tabs and comes back). localStorage is wiped on Chromebook logout,
     * so this cannot recover saves across sessions. The primary safety nets are:
     * (1) Submissions_Log append (server-side, permanent, happens before merge)
     * (2) Immediate in-session verifyCloudSave() fired 3s after any no-cors save
     * (3) Debounced autosave retrying every few seconds while student is on the page
     */
    async replayPendingSaves() {
        const keysToReplay = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('submission_')) {
                try {
                    const entry = JSON.parse(localStorage.getItem(key));
                    if (entry && entry.syncStatus === 'pending_verification') {
                        keysToReplay.push({ key, entry });
                    }
                } catch (e) { /* skip */ }
            }
        }

        for (const { key, entry } of keysToReplay) {
            try {
                console.log('[api.js] Replaying pending save:', key);
                const result = await this.submitProfile(
                    entry.task,
                    entry.data,
                    entry.summary,
                    entry.courseKey || 'CIT9'
                );
                if (result.status === 'submitted_successfully' || result.deduplicated) {
                    // Confirmed — mark as synced
                    entry.cloudSynced = true;
                    entry.syncStatus = 'confirmed';
                    localStorage.setItem(key, JSON.stringify(entry));
                    console.log('[api.js] Pending save confirmed:', key);
                }
            } catch (replayErr) {
                console.warn('[api.js] Replay failed for', key, replayErr);
            }
        }
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
        // slim=1: GAS (once GAS_PATCH_slim_progress.md is applied) returns a
        // few-KB payload instead of full savedData blobs; deployments without
        // the patch ignore the param and return the full shape, which the
        // calling page normalizes either way.
        const getUrl = `${url}?action=get_class_progress&className=${encodeURIComponent(className)}&slim=1`;

        // GAS cold-starts after deploy can run 15-20s. Without a timeout the
        // browser fetch hangs and the page silently shows "no data". Use an
        // AbortController at 25s and one automatic retry.
        const fetchOnce = async () => {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 25000);
            try {
                const res = await fetch(getUrl, { signal: controller.signal, cache: 'no-store' });
                return await res.json();
            } finally {
                clearTimeout(timer);
            }
        };

        try {
            return await fetchOnce();
        } catch (err) {
            if (err && err.name === 'AbortError') {
                try {
                    return await fetchOnce(); // one retry for the cold-start case
                } catch (e2) {
                    console.warn('Bulk class progress fetch timed out twice:', e2);
                    return { status: 'error', error: 'timeout' };
                }
            }
            console.warn('Bulk class progress fetch failed:', err);
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

// Pages that guard with `if (window.StudentAPI)` need this: a top-level `const`
// never becomes a window property on its own.
if (typeof window !== 'undefined') {
    window.StudentAPI = StudentAPI;
    // Exposed for pages with custom dispatchers (e.g. the CIT9 dossier) to stamp
    // EffortTelemetry.snapshot() into their own payloads, and for debugging.
    if (!window.EffortTelemetry) window.EffortTelemetry = EffortTelemetry;
    // Count from page load — lazy wiring would miss the first burst of typing.
    EffortTelemetry.wire();
}

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

// Same-session replay of pending saves on tab-switch / visibility change.
// On Chromebooks, localStorage is wiped on logout — this only helps within
// the active session (e.g., student switches tabs and comes back).
// The real safety net is the immediate verifyCloudSave() fired 3s after no-cors saves.
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Automatically check server version integrity in background
        setTimeout(function() { StudentAPI.checkServerVersion(); }, 1200);
        setTimeout(function() { StudentAPI.replayPendingSaves(); }, 2000);
    });
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            setTimeout(function() { StudentAPI.replayPendingSaves(); }, 1000);
        }
    });
}

