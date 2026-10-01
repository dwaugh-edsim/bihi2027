/**
 * where_teacher_review.js
 * Teacher Review & Marking Console for "The WHERE Project — Places Portfolio"
 * Activated via PIN "TST" or URL parameter ?pin=TST.
 *
 * Integrates:
 * - Full Grade 9 student roster and snapshot submissions across 901, 902, 903
 * - 7-point Nova Scotia rubric grading (4, 3+, 3, 2+, 2, 1+, 1)
 * - Private teacher feedback comments with draft and approval workflows
 * - Live Google Apps Script backend synchronization and offline draft caching
 * - Fast student-to-student navigation with keyboard shortcuts
 */

(function (window, document) {
    'use strict';

    const TASK_NAME = 'The WHERE Project — Places Portfolio';
    const RUBRIC_SCALE = [
        { grade: '4', label: 'Excellent', classModifier: 'g4' },
        { grade: '3+', label: 'Very Good', classModifier: 'g3p' },
        { grade: '3', label: 'Good', classModifier: 'g3' },
        { grade: '2+', label: 'Fair', classModifier: 'g2p' },
        { grade: '2', label: 'Needs Improvement', classModifier: 'g2' },
        { grade: '1+', label: 'Limited', classModifier: 'g1p' },
        { grade: '1', label: 'Very Limited', classModifier: 'g1' }
    ];

    const DEFAULT_COORDS = {
        p1: [44.6655, -63.5677],
        p2: [44.6680, -63.5700],
        p3: [14.5995, 120.9842],
        p4: [35.6762, 139.6503]
    };

    const State = {
        isActive: false,
        currentPin: '',
        classFilter: 'ALL',
        statusFilter: 'ALL',
        searchQuery: '',
        readOnly: true,
        teacherPin: '',
        students: [],
        feedbackCache: {},
        liveCloudData: {}
    };

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getTeacherPin() {
        if (!State.teacherPin) {
            try {
                State.teacherPin = sessionStorage.getItem('r8_where_tpin') || 'TST';
            } catch (e) {
                State.teacherPin = 'TST';
            }
        }
        return State.teacherPin;
    }

    function setTeacherPin(pin) {
        State.teacherPin = pin.trim();
        try {
            sessionStorage.setItem('r8_where_tpin', State.teacherPin);
        } catch (e) {}
    }

    function normalizeSubmission(raw, pin) {
        const p = pin.toUpperCase();
        const studentName = raw.name || raw.first_name || p;
        const homeroom = String(raw.class || raw.className || '901').replace(/[^0-9]/g, '');

        const p1 = raw.p1 || {};
        const p2 = raw.p2 || {};
        const p3 = raw.p3 || {};
        const p4 = raw.p4 || {};
        const p5 = raw.p5 || {};

        const p1Desc = (p1.desc || raw.where_personal || raw.cat1_personal || '').trim();
        const p2Desc = (p2.desc || raw.where_community || raw.cat2_community || '').trim();
        const p3Desc = (p3.desc || raw.where_global || raw.cat3_global || '').trim();
        const p4Desc = (p4.desc || raw.where_aspirational || raw.cat4_aspirational || '').trim();
        const p5Desc = (p5.desc || raw.cat5_music || '').trim();
        const p5Yt = (p5.yt || raw.youtube_url || '').trim();

        const p1Title = (p1.title || (p1Desc ? 'Personal Place' : '')).trim();
        const p2Title = (p2.title || (p2Desc ? 'Community Place' : '')).trim();
        const p3Title = (p3.title || (p3Desc ? 'Global Place' : '')).trim();
        const p4Title = (p4.title || (p4Desc ? 'Aspirational Place' : '')).trim();
        const p5Title = (p5.title || (p5Desc || p5Yt ? 'Soundtrack of My Life' : '')).trim();

        let filledCount = 0;
        if (p1Desc || p1Title) filledCount++;
        if (p2Desc || p2Title) filledCount++;
        if (p3Desc || p3Title) filledCount++;
        if (p4Desc || p4Title) filledCount++;

        const hasWriting = filledCount > 0 || (p5Desc.length > 5);
        const hasCoords = !!(
            (p1.coords && (p1.coords[0] !== DEFAULT_COORDS.p1[0] || p1.coords[1] !== DEFAULT_COORDS.p1[1])) ||
            (p2.coords && (p2.coords[0] !== DEFAULT_COORDS.p2[0] || p2.coords[1] !== DEFAULT_COORDS.p2[1])) ||
            (p3.coords && (p3.coords[0] !== DEFAULT_COORDS.p3[0] || p3.coords[1] !== DEFAULT_COORDS.p3[1])) ||
            (p4.coords && (p4.coords[0] !== DEFAULT_COORDS.p4[0] || p4.coords[1] !== DEFAULT_COORDS.p4[1]))
        );

        return {
            pin: p,
            name: studentName,
            class: homeroom,
            submissionSource: raw.submission_source || (filledCount >= 4 ? 'WHERE Studio' : 'Intake / Recovery'),
            updatedAt: raw.updated_at || raw.updated || '',
            filledCount: filledCount,
            hasWriting: hasWriting,
            hasCoords: hasCoords,
            hasSoundtrack: !!(p5Desc || p5Yt),
            data: {
                pin: p,
                name: studentName,
                class: homeroom,
                p1: { title: p1Title, desc: p1Desc, img: p1.img || '', coords: p1.coords || DEFAULT_COORDS.p1 },
                p2: { title: p2Title, desc: p2Desc, img: p2.img || '', coords: p2.coords || DEFAULT_COORDS.p2 },
                p3: { title: p3Title, desc: p3Desc, img: p3.img || '', coords: p3.coords || DEFAULT_COORDS.p3 },
                p4: { title: p4Title, desc: p4Desc, img: p4.img || '', coords: p4.coords || DEFAULT_COORDS.p4 },
                p5: { title: p5Title, desc: p5Desc, yt: p5Yt }
            }
        };
    }

    function buildStudentList() {
        const pool = {};
        const rawInitial = window.ROOM8_WHERE_INITIAL_DATA || {};

        Object.keys(rawInitial).forEach(pin => {
            pool[pin.toUpperCase()] = normalizeSubmission(rawInitial[pin], pin);
        });

        const liveCloud = State.liveCloudData || {};
        Object.keys(liveCloud).forEach(pin => {
            const upPin = pin.toUpperCase();
            if (!pool[upPin]) {
                pool[upPin] = normalizeSubmission(liveCloud[pin], pin);
            } else {
                const normalized = normalizeSubmission(liveCloud[pin], pin);
                if (normalized.hasWriting && (!pool[upPin].hasWriting || normalized.filledCount >= pool[upPin].filledCount)) {
                    pool[upPin] = normalized;
                }
            }
        });

        const roster = window.MASTER_ROSTER_DATA || [];
        roster.forEach(r => {
            if (r.pin && ['901', '902', '903'].includes(String(r.homeroom || '').trim())) {
                const upPin = r.pin.toUpperCase();
                if (!pool[upPin]) {
                    pool[upPin] = {
                        pin: upPin,
                        name: `${r.first_name || ''} ${r.last_name || ''}`.trim(),
                        class: String(r.homeroom || '901').trim(),
                        submissionSource: 'Not Submitted',
                        updatedAt: '',
                        filledCount: 0,
                        hasWriting: false,
                        hasCoords: false,
                        hasSoundtrack: false,
                        data: {
                            pin: upPin,
                            name: r.first_name || upPin,
                            class: String(r.homeroom || '901').trim(),
                            p1: { title: '', desc: '', img: '', coords: DEFAULT_COORDS.p1 },
                            p2: { title: '', desc: '', img: '', coords: DEFAULT_COORDS.p2 },
                            p3: { title: '', desc: '', img: '', coords: DEFAULT_COORDS.p3 },
                            p4: { title: '', desc: '', img: '', coords: DEFAULT_COORDS.p4 },
                            p5: { title: '', desc: '', yt: '' }
                        }
                    };
                }
            }
        });

        const list = Object.values(pool);
        list.sort((a, b) => {
            if (a.class !== b.class) return a.class.localeCompare(b.class);
            return a.name.localeCompare(b.name);
        });

        State.students = list;
    }

    function getFilteredStudents() {
        return State.students.filter(student => {
            if (State.classFilter !== 'ALL' && student.class !== State.classFilter) {
                return false;
            }
            if (State.statusFilter === 'WRITING' && !student.hasWriting) {
                return false;
            }
            if (State.statusFilter === 'PINS' && (student.hasWriting || !student.hasCoords)) {
                return false;
            }
            if (State.statusFilter === 'EMPTY' && (student.hasWriting || student.hasCoords)) {
                return false;
            }
            if (State.searchQuery) {
                const q = State.searchQuery.toLowerCase();
                const matched = student.name.toLowerCase().includes(q) ||
                    student.pin.toLowerCase().includes(q) ||
                    student.class.toLowerCase().includes(q);
                if (!matched) return false;
            }
            return true;
        });
    }

    function getStudentFeedback(pin) {
        if (!pin) return { grade: '', overall: '', status: 'ungraded', updatedAt: '' };
        if (State.feedbackCache[pin]) return State.feedbackCache[pin];

        try {
            const cachedLocal = localStorage.getItem(`r8_where_feedback_${pin}`);
            if (cachedLocal) {
                const parsed = JSON.parse(cachedLocal);
                State.feedbackCache[pin] = parsed;
                return parsed;
            }
        } catch (e) {}

        const fallback = { grade: '', overall: '', status: 'ungraded', updatedAt: '' };
        State.feedbackCache[pin] = fallback;
        return fallback;
    }

    function setStudentFeedback(pin, feedbackObj) {
        State.feedbackCache[pin] = feedbackObj;
        try {
            localStorage.setItem(`r8_where_feedback_${pin}`, JSON.stringify(feedbackObj));
        } catch (e) {}
    }

    function injectReviewStyles() {
        if (document.getElementById('where-teacher-review-styles')) return;
        const style = document.createElement('style');
        style.id = 'where-teacher-review-styles';
        style.textContent = `
            .tst-review-panel {
                background: #ffffff;
                border: 2px solid #2563eb;
                border-radius: 8px;
                margin-bottom: 20px;
                padding: 16px 20px;
                box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08);
                font-family: var(--font-body, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
            }
            .tst-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 12px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 10px;
            }
            .tst-badge-title {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-family: var(--font-heading, serif);
                font-size: 1.1rem;
                font-weight: 700;
                color: #1e3a8a;
            }
            .tst-tag-live {
                font-family: var(--font-mono, monospace);
                font-size: 0.72rem;
                font-weight: 700;
                background: #dbeafe;
                color: #1d4ed8;
                border: 1px solid #bfdbfe;
                padding: 2px 8px;
                border-radius: 4px;
                letter-spacing: 0.04em;
            }
            .tst-filter-pills {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                align-items: center;
            }
            .tst-pill-btn {
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                color: #475569;
                font-size: 0.8rem;
                font-weight: 600;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.12s ease;
            }
            .tst-pill-btn:hover {
                border-color: #94a3b8;
                color: #1e293b;
            }
            .tst-pill-btn.active {
                background: #1e293b;
                border-color: #1e293b;
                color: #ffffff;
            }
            .tst-nav-row {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-wrap: wrap;
                margin-bottom: 14px;
            }
            .tst-select {
                flex: 1;
                min-width: 280px;
                padding: 8px 12px;
                font-size: 0.92rem;
                font-weight: 600;
                border: 1.5px solid #94a3b8;
                border-radius: 6px;
                background: #ffffff;
                color: #0f172a;
            }
            .tst-select:focus {
                outline: 2px solid #2563eb;
                border-color: #2563eb;
            }
            .tst-nav-btn {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                color: #1e293b;
                padding: 7px 14px;
                font-size: 0.86rem;
                font-weight: 700;
                border-radius: 6px;
                cursor: pointer;
            }
            .tst-nav-btn:hover {
                background: #e2e8f0;
            }
            .tst-meta-strip {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
                font-size: 0.82rem;
                color: #64748b;
                background: #f8fafc;
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid #e2e8f0;
                margin-bottom: 14px;
            }
            .tst-meta-item {
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            .tst-meta-item strong {
                color: #334155;
            }
            .tst-grading-card {
                background: #fafbfc;
                border: 1px solid #d5dbe3;
                border-radius: 6px;
                padding: 12px 16px;
            }
            .tst-grade-scale {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin: 8px 0 12px;
            }
            .tst-grade-btn {
                background: #ffffff;
                border: 1.5px solid #cbd5e1;
                color: #334155;
                font-family: var(--font-heading, serif);
                font-size: 1rem;
                font-weight: 700;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.12s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 48px;
            }
            .tst-grade-btn .lbl {
                font-family: var(--font-body, sans-serif);
                font-size: 0.62rem;
                font-weight: 600;
                color: #64748b;
            }
            .tst-grade-btn:hover {
                transform: translateY(-1px);
                border-color: #94a3b8;
            }
            .tst-grade-btn.selected.g4 { background: #dcfce7; border-color: #15803d; color: #15803d; }
            .tst-grade-btn.selected.g3p { background: #ecfccb; border-color: #65a30d; color: #4d7c0f; }
            .tst-grade-btn.selected.g3 { background: #f7fee7; border-color: #65a30d; color: #4d7c0f; }
            .tst-grade-btn.selected.g2p { background: #fef9c3; border-color: #ca8a04; color: #a16207; }
            .tst-grade-btn.selected.g2 { background: #fef3c7; border-color: #b45309; color: #92400e; }
            .tst-grade-btn.selected.g1p { background: #fee2e2; border-color: #dc2626; color: #b91c1c; }
            .tst-grade-btn.selected.g1 { background: #fef2f2; border-color: #b91c1c; color: #991b1b; }
            .tst-comment-area {
                width: 100%;
                box-sizing: border-box;
                font-family: var(--font-body, sans-serif);
                font-size: 0.9rem;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                padding: 8px 10px;
                min-height: 70px;
                margin-top: 6px;
                resize: vertical;
            }
            .tst-comment-area:focus {
                outline: 2px solid #2563eb;
                border-color: #2563eb;
            }
            .tst-action-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 10px;
            }
            .tst-status-badge {
                font-family: var(--font-mono, monospace);
                font-size: 0.76rem;
                font-weight: 700;
                padding: 4px 10px;
                border-radius: 4px;
                border: 1px solid #cbd5e1;
                background: #f1f5f9;
                color: #475569;
            }
            .tst-status-badge.approved {
                background: #dcfce7;
                border-color: #86efac;
                color: #15803d;
            }
            .tst-status-badge.draft {
                background: #eff6ff;
                border-color: #bfdbfe;
                color: #1d4ed8;
            }
            .tst-save-btn {
                background: #1d4ed8;
                border: 1px solid #1e40af;
                color: #ffffff;
                font-weight: 700;
                font-size: 0.86rem;
                padding: 6px 14px;
                border-radius: 6px;
                cursor: pointer;
            }
            .tst-save-btn:hover {
                background: #1e40af;
            }
            .tst-approve-btn {
                background: #15803d;
                border: 1px solid #166534;
                color: #ffffff;
                font-weight: 700;
                font-size: 0.86rem;
                padding: 6px 14px;
                border-radius: 6px;
                cursor: pointer;
            }
            .tst-approve-btn:hover {
                background: #166534;
            }
            .tst-save-btn:disabled, .tst-approve-btn:disabled {
                opacity: 0.6;
                cursor: wait;
            }
        `;
        document.head.appendChild(style);
    }

    function renderReviewPanel() {
        injectReviewStyles();
        let container = document.getElementById('whereTeacherReviewPanel');
        if (!container) {
            container = document.createElement('div');
            container.id = 'whereTeacherReviewPanel';
            container.className = 'tst-review-panel';
            const mountTarget = document.querySelector('.main-box');
            if (mountTarget) {
                mountTarget.parentNode.insertBefore(container, mountTarget);
            } else {
                document.body.insertBefore(container, document.body.firstChild);
            }
        }

        const filtered = getFilteredStudents();
        const total = State.students.length;
        const writingCount = State.students.filter(s => s.hasWriting).length;
        const pinsCount = State.students.filter(s => s.hasCoords && !s.hasWriting).length;

        let currentIndex = -1;
        if (State.currentPin && State.currentPin !== 'EXEMPLAR') {
            currentIndex = filtered.findIndex(s => s.pin === State.currentPin);
        }

        const optionsHtml = filtered.map((s, idx) => {
            const isSel = s.pin === State.currentPin;
            const fb = getStudentFeedback(s.pin);
            const statusMarker = fb.status === 'approved' ? ' [Marked]' : fb.status === 'draft' ? ' [Draft]' : '';
            const gradeMarker = fb.grade ? ` (${fb.grade})` : '';
            const writingLabel = s.hasWriting ? `${s.filledCount}/4 places` : (s.hasCoords ? 'pins only' : 'not attempted');
            return `<option value="${s.pin}" ${isSel ? 'selected' : ''}>[Class ${s.class}] ${s.name} (${s.pin}) — ${writingLabel}${gradeMarker}${statusMarker}</option>`;
        }).join('');

        const exemplarSel = State.currentPin === 'EXEMPLAR' ? 'selected' : '';

        const currentStudent = State.students.find(s => s.pin === State.currentPin);
        const currentFeedback = getStudentFeedback(State.currentPin);

        container.innerHTML = `
            <div class="tst-panel-header">
                <div class="tst-badge-title">
                    <span>Teacher Review &amp; Marking Console</span>
                    <span class="tst-tag-live">TEACHER MODE</span>
                </div>
                <div class="tst-filter-pills">
                    <span style="font-size:0.8rem; font-weight:700; color:#64748b;">Class:</span>
                    <button type="button" class="tst-pill-btn ${State.classFilter === 'ALL' ? 'active' : ''}" onclick="WhereTeacherReview.setClassFilter('ALL')">All (${total})</button>
                    <button type="button" class="tst-pill-btn ${State.classFilter === '901' ? 'active' : ''}" onclick="WhereTeacherReview.setClassFilter('901')">901</button>
                    <button type="button" class="tst-pill-btn ${State.classFilter === '902' ? 'active' : ''}" onclick="WhereTeacherReview.setClassFilter('902')">902</button>
                    <button type="button" class="tst-pill-btn ${State.classFilter === '903' ? 'active' : ''}" onclick="WhereTeacherReview.setClassFilter('903')">903</button>
                    <span style="margin-left:8px; font-size:0.8rem; font-weight:700; color:#64748b;">Status:</span>
                    <button type="button" class="tst-pill-btn ${State.statusFilter === 'ALL' ? 'active' : ''}" onclick="WhereTeacherReview.setStatusFilter('ALL')">All</button>
                    <button type="button" class="tst-pill-btn ${State.statusFilter === 'WRITING' ? 'active' : ''}" onclick="WhereTeacherReview.setStatusFilter('WRITING')">With Writing (${writingCount})</button>
                    <button type="button" class="tst-pill-btn ${State.statusFilter === 'PINS' ? 'active' : ''}" onclick="WhereTeacherReview.setStatusFilter('PINS')">Pins Only (${pinsCount})</button>
                </div>
            </div>

            <div class="tst-nav-row">
                <button type="button" class="tst-nav-btn" onclick="WhereTeacherReview.prevStudent()" title="Keyboard: [">&#9664; Prev</button>
                <select class="tst-select" id="tstStudentDropdown" onchange="WhereTeacherReview.selectStudent(this.value)">
                    <option value="EXEMPLAR" ${exemplarSel}>Exemplar: Mr. Waugh Model (Dartmouth &bull; Alderney &bull; Gwangju)</option>
                    ${optionsHtml}
                </select>
                <button type="button" class="tst-nav-btn" onclick="WhereTeacherReview.nextStudent()" title="Keyboard: ]">Next &#9654;</button>
                <input type="text" placeholder="Search student or PIN..." value="${escapeHtml(State.searchQuery)}"
                    oninput="WhereTeacherReview.setSearch(this.value)"
                    style="max-width:180px; padding:7px 10px; font-size:0.86rem; border:1px solid #cbd5e1; border-radius:6px;">
            </div>

            ${currentStudent ? `
            <div class="tst-meta-strip">
                <div class="tst-meta-item"><strong>Student:</strong> ${escapeHtml(currentStudent.name)} (${escapeHtml(currentStudent.pin)})</div>
                <div class="tst-meta-item"><strong>Class:</strong> ${escapeHtml(currentStudent.class)}</div>
                <div class="tst-meta-item"><strong>Content:</strong> ${currentStudent.filledCount}/4 places written</div>
                <div class="tst-meta-item"><strong>Source:</strong> ${escapeHtml(currentStudent.submissionSource)}</div>
                ${currentStudent.updatedAt ? `<div class="tst-meta-item"><strong>Updated:</strong> ${escapeHtml(currentStudent.updatedAt.slice(0, 10))}</div>` : ''}
                <div class="tst-meta-item" style="margin-left:auto;">
                    <a href="WHERE_Grade9_Marking_Console.html?class=${currentStudent.class}" target="_blank" style="color:#2563eb; text-decoration:none; font-weight:700;">Open Full Marking Console &rarr;</a>
                </div>
            </div>

            <div class="tst-grading-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                    <span style="font-size:0.82rem; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:#475569;">
                        Nova Scotia 7-Point Rubric Mark &bull; Private Student Feedback
                    </span>
                    <button type="button" class="tst-pill-btn" onclick="WhereTeacherReview.clearGrade()" style="font-size:0.75rem;">Clear Grade</button>
                </div>
                <div class="tst-grade-scale">
                    ${RUBRIC_SCALE.map(r => {
                        const isSel = currentFeedback.grade === r.grade;
                        return `
                            <button type="button" class="tst-grade-btn ${r.classModifier} ${isSel ? 'selected' : ''}"
                                onclick="WhereTeacherReview.setGrade('${r.grade}')">
                                <span>${r.grade}</span>
                                <span class="lbl">${r.label}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
                <label style="display:block; font-size:0.82rem; font-weight:700; color:#475569; margin-top:6px;">
                    Feedback Comment for ${escapeHtml(currentStudent.name)}:
                </label>
                <textarea class="tst-comment-area" id="tstTeacherComment"
                    placeholder="Private feedback, strengths, and curriculum connections for ${escapeHtml(currentStudent.name)}..."
                    oninput="WhereTeacherReview.onCommentChange(this.value)">${escapeHtml(currentFeedback.overall || '')}</textarea>
                <div class="tst-action-row">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="tst-status-badge ${currentFeedback.status}">${currentFeedback.status === 'approved' ? 'Approved &amp; Finalized' : currentFeedback.status === 'draft' ? 'Draft Saved' : 'Not Graded'}</span>
                        <span id="tstSaveMessage" style="font-size:0.8rem; font-family:monospace; color:#64748b;">${currentFeedback.updatedAt ? 'Saved ' + new Date(currentFeedback.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button type="button" class="tst-save-btn" id="tstSaveDraftBtn" onclick="WhereTeacherReview.saveFeedback('draft')">Save Draft</button>
                        <button type="button" class="tst-approve-btn" id="tstApproveBtn" onclick="WhereTeacherReview.saveFeedback('approved')">Approve Mark</button>
                    </div>
                </div>
            </div>
            ` : `
            <div class="tst-meta-strip">
                <div class="tst-meta-item"><strong>Currently Viewing:</strong> Mr. Waugh's Classroom Exemplar Model</div>
                <div class="tst-meta-item">Use the dropdown or Next / Prev buttons above to review student work.</div>
            </div>
            `}
        `;
    }

    function populateStudentIntoStudio(student) {
        if (!student) return;

        if (typeof window.clearAllFormFields === 'function') {
            window.clearAllFormFields();
        }

        const firstNameInput = document.getElementById('firstNameInput');
        const classSelect = document.getElementById('classSelect');
        const pinInput = document.getElementById('pinInput');

        if (firstNameInput) firstNameInput.value = student.name;
        if (classSelect) classSelect.value = student.class;
        if (pinInput) pinInput.value = student.pin;

        if (window.PlacesSession) {
            window.PlacesSession.set(student.class, student.name, student.pin);
        }

        const badge = document.getElementById('badgeStudent');
        if (badge) {
            badge.innerText = `REVIEWING: ${student.name} • Class ${student.class} (PIN: ${student.pin})`;
        }

        if (typeof window.applyDraftData === 'function') {
            window.applyDraftData(student.data);
        }

        ['p1', 'p2', 'p3', 'p4'].forEach(k => {
            const p = student.data[k];
            if (p && p.coords && Array.isArray(p.coords) && p.coords.length === 2) {
                if (typeof window.setMapCoords === 'function') {
                    window.setMapCoords(k, p.coords[0], p.coords[1]);
                }
            }
            if (typeof window.updateImagePreview === 'function') {
                window.updateImagePreview(k);
            }
        });

        if (typeof window.updateYouTubePreview === 'function') {
            window.updateYouTubePreview();
        }

        if (typeof window.loadStudentBrainstorm === 'function') {
            window.loadStudentBrainstorm({ first_name: student.name, homeroom: student.class }, student.pin);
        }

        const activePane = document.querySelector('.tab-pane.active');
        if (activePane && activePane.id === 'tab-review') {
            if (typeof window.renderPortfolioView === 'function') {
                window.renderPortfolioView();
            }
            if (typeof window.updatePortfolioMasterMap === 'function') {
                window.updatePortfolioMasterMap();
            }
        }
    }

    async function syncCloudFeedback() {
        if (!window.StudentAPI) return;
        try {
            const url = `${window.StudentAPI.getScriptUrl('CIT9')}?action=get_feedback&taskName=${encodeURIComponent(TASK_NAME)}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.feedback) {
                Object.keys(data.feedback).forEach(pin => {
                    const row = data.feedback[pin];
                    const gradeVal = (row.feedback && row.feedback.questions && row.feedback.questions.final_grade && row.feedback.questions.final_grade.text) || '';
                    const overallVal = (row.feedback && row.feedback.overall) || '';
                    setStudentFeedback(pin.toUpperCase(), {
                        grade: gradeVal,
                        overall: overallVal,
                        status: row.status || 'draft',
                        updatedAt: row.updated || new Date().toISOString()
                    });
                });
                renderReviewPanel();
            }
        } catch (e) {
            console.warn('Silent cloud feedback sync completed with local cache precedence:', e);
        }
    }

    async function syncCloudProgress() {
        if (!window.StudentAPI) return;
        try {
            const res = await window.StudentAPI.getClassProgress('ALL', 'CIT9');
            if (res && res.status === 'success' && Array.isArray(res.students)) {
                res.students.forEach(row => {
                    const pin = (row.pin || '').toUpperCase();
                    if (!pin) return;
                    const d = row.savedData ? (row.savedData.data || row.savedData) : {};
                    if (d.p1 || d.p2 || d.p3 || d.p4 || d.where_personal || d.cat1_personal) {
                        State.liveCloudData[pin] = d;
                    }
                });
                buildStudentList();
                renderReviewPanel();
            }
        } catch (e) {
            console.warn('Silent cloud progress check completed:', e);
        }
    }

    const WhereTeacherReview = {
        activate: function () {
            State.isActive = true;

            const workFs = document.getElementById('workFieldset');
            if (workFs) workFs.disabled = false;

            const gate = document.getElementById('loginGateBanner');
            if (gate) gate.style.display = 'none';

            const pinInput = document.getElementById('pinInput');
            if (pinInput) pinInput.value = 'TST';

            const firstNameInput = document.getElementById('firstNameInput');
            if (firstNameInput && !firstNameInput.value) firstNameInput.value = 'Teacher (Testing & Marking)';

            const badge = document.getElementById('badgeStudent');
            if (badge) {
                badge.innerText = 'TEACHER MODE • Reviewing Submissions';
                badge.style.background = '#dbeafe';
                badge.style.borderColor = '#93c5fd';
                badge.style.color = '#1e40af';
            }

            const cloudStatus = document.getElementById('cloudStatusPill');
            if (cloudStatus) {
                cloudStatus.innerHTML = 'Teacher Review Live';
                cloudStatus.style.background = '#ecfdf5';
                cloudStatus.style.borderColor = '#86efac';
                cloudStatus.style.color = '#166534';
            }

            buildStudentList();

            if (!State.currentPin) {
                const firstWithWriting = State.students.find(s => s.hasWriting);
                if (firstWithWriting) {
                    this.selectStudent(firstWithWriting.pin);
                } else {
                    this.selectStudent('EXEMPLAR');
                }
            } else {
                renderReviewPanel();
            }

            setTimeout(syncCloudFeedback, 300);
            setTimeout(syncCloudProgress, 600);

            if (typeof window.showToast === 'function') {
                window.showToast('Teacher Review Mode Active. Loading student submissions...');
            }
        },

        selectStudent: function (pin) {
            State.currentPin = pin;
            if (pin === 'EXEMPLAR') {
                if (typeof window.loadWaughExemplar === 'function') {
                    window.loadWaughExemplar();
                }
                const badge = document.getElementById('badgeStudent');
                if (badge) badge.innerText = 'TEACHER MODE • Viewing Waugh Model Exemplar';
            } else {
                const student = State.students.find(s => s.pin === pin);
                if (student) {
                    populateStudentIntoStudio(student);
                }
            }
            renderReviewPanel();
        },

        prevStudent: function () {
            const filtered = getFilteredStudents();
            if (!filtered.length) return;
            let idx = filtered.findIndex(s => s.pin === State.currentPin);
            if (idx <= 0) {
                this.selectStudent(filtered[filtered.length - 1].pin);
            } else {
                this.selectStudent(filtered[idx - 1].pin);
            }
        },

        nextStudent: function () {
            const filtered = getFilteredStudents();
            if (!filtered.length) return;
            let idx = filtered.findIndex(s => s.pin === State.currentPin);
            if (idx === -1 || idx >= filtered.length - 1) {
                this.selectStudent(filtered[0].pin);
            } else {
                this.selectStudent(filtered[idx + 1].pin);
            }
        },

        setClassFilter: function (cls) {
            State.classFilter = cls;
            renderReviewPanel();
        },

        setStatusFilter: function (status) {
            State.statusFilter = status;
            renderReviewPanel();
        },

        setSearch: function (val) {
            State.searchQuery = val;
            renderReviewPanel();
        },

        setGrade: function (grade) {
            if (!State.currentPin || State.currentPin === 'EXEMPLAR') return;
            const current = getStudentFeedback(State.currentPin);
            const nextGrade = current.grade === grade ? '' : grade;
            const nextStatus = current.status === 'approved' ? 'approved' : 'draft';
            setStudentFeedback(State.currentPin, {
                ...current,
                grade: nextGrade,
                status: nextGrade ? nextStatus : (current.overall ? nextStatus : 'ungraded'),
                updatedAt: new Date().toISOString()
            });
            renderReviewPanel();
        },

        clearGrade: function () {
            if (!State.currentPin || State.currentPin === 'EXEMPLAR') return;
            const current = getStudentFeedback(State.currentPin);
            setStudentFeedback(State.currentPin, {
                ...current,
                grade: '',
                status: current.overall ? current.status : 'ungraded',
                updatedAt: new Date().toISOString()
            });
            renderReviewPanel();
        },

        onCommentChange: function (text) {
            if (!State.currentPin || State.currentPin === 'EXEMPLAR') return;
            const current = getStudentFeedback(State.currentPin);
            setStudentFeedback(State.currentPin, {
                ...current,
                overall: text,
                status: current.status === 'approved' ? 'approved' : 'draft'
            });
        },

        saveFeedback: async function (status) {
            if (!State.currentPin || State.currentPin === 'EXEMPLAR') return;
            const pin = State.currentPin;
            const student = State.students.find(s => s.pin === pin);
            if (!student) return;

            const commentArea = document.getElementById('tstTeacherComment');
            const commentVal = commentArea ? commentArea.value.trim() : (getStudentFeedback(pin).overall || '');
            const currentGrade = getStudentFeedback(pin).grade || '';

            const saveMsg = document.getElementById('tstSaveMessage');
            if (saveMsg) saveMsg.textContent = 'Saving feedback...';

            const draftBtn = document.getElementById('tstSaveDraftBtn');
            const approveBtn = document.getElementById('tstApproveBtn');
            if (draftBtn) draftBtn.disabled = true;
            if (approveBtn) approveBtn.disabled = true;

            const payloadQuestions = {};
            if (currentGrade) {
                payloadQuestions.final_grade = { text: currentGrade, status: 'graded' };
            }

            const feedbackRecord = {
                overall: commentVal,
                questions: payloadQuestions
            };

            const tPin = getTeacherPin();
            let cloudOk = false;

            if (window.StudentAPI) {
                try {
                    const postBody = {
                        action: 'save_feedback',
                        pin: pin,
                        name: student.name,
                        section: student.class,
                        task: TASK_NAME,
                        status: status,
                        teacherPin: tPin,
                        feedback: feedbackRecord
                    };

                    const scriptUrl = window.StudentAPI.getScriptUrl('CIT9');
                    const res = await fetch(scriptUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                        body: JSON.stringify(postBody)
                    });
                    const resJson = await res.json();
                    if (resJson.status === 'feedback_saved' || resJson.status === 'success') {
                        cloudOk = true;
                    }
                } catch (e) {
                    console.warn('Cloud feedback save notice:', e);
                }
            }

            const updatedIso = new Date().toISOString();
            setStudentFeedback(pin, {
                grade: currentGrade,
                overall: commentVal,
                status: status,
                updatedAt: updatedIso
            });

            if (draftBtn) draftBtn.disabled = false;
            if (approveBtn) approveBtn.disabled = false;

            renderReviewPanel();

            if (typeof window.showToast === 'function') {
                const statusLabel = status === 'approved' ? 'approved and finalized' : 'saved as draft';
                const destLabel = cloudOk ? 'saved to cloud and local storage' : 'saved locally';
                window.showToast(`Mark for ${student.name} ${statusLabel} (${destLabel}).`);
            }
        }
    };

    // Global keyboard listener for fast flip through submissions
    window.addEventListener('keydown', function (e) {
        if (!State.isActive) return;
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

        if (e.key === '[' || (e.altKey && e.key === 'ArrowLeft')) {
            e.preventDefault();
            WhereTeacherReview.prevStudent();
        } else if (e.key === ']' || (e.altKey && e.key === 'ArrowRight')) {
            e.preventDefault();
            WhereTeacherReview.nextStudent();
        }
    });

    window.WhereTeacherReview = WhereTeacherReview;

})(window, document);
