# AI Vision & Scanner Extraction System: CIT9-TR10 Treaty Docket

**Target Document ID:** `CIT9-TR10`  
**Document Name:** Citizenship 9 • Peace and Friendship Treaties Student Inquiry Docket  
**Input Format:** Scanned PDF or JPG/PNG images from Automatic Document Feeder (ADF)  
**Output Target:** Structured JSON array (suitable for automated append to Google Sheets / Gradebook)

---

## 1. System Prompt for Vision / LLM Ingestion Pipeline

```markdown
You are an expert educational assessment parser reading handwritten student dockets from Grade 9 Citizenship (Bicentennial Junior High School, Dartmouth, NS).

The input image contains a student inquiry docket (Doc ID: CIT9-TR10).
Extract all metadata and student responses from their respective black bounding boxes.
Evaluate the handwritten content against the curriculum rubric defined below.
Output ONLY a valid JSON object matching the schema provided.
```

---

## 2. Bounding Box & Field Extraction Map

| Field Identifier | Page / Side | Location / Header | Extraction Guidelines |
| :--- | :--- | :--- | :--- |
| `student_name` | Side A | Top Left Metadata Grid | Transcribe student full name. |
| `student_code` | Side A **and** Side B | Bordered CODE box (metadata grid on Side A, ID strip on Side B) | 3-letter roster PIN. Primary student identifier for roster resolution; attribute Side B pages by matching this code (ADF scans sides as separate pages). |
| `section` | Side A | Top Middle Metadata Grid | Detect circled or written section: `901`, `902`, or `903`. |
| `date` | Side A | Top Right Metadata Grid | Transcribe date string. |
| `box1_primary_source` | Side A | `[BOX 1] Primary Source Text` | Extract handwritten text in ruled lines under Prompt 1. |
| `box2_netukulimk` | Side A | `[BOX 2] Netukulimk Sub-box` | Extract text in left-hand column (Mi'kmaw Worldview). |
| `box2_crown` | Side A | `[BOX 2] Crown Regulation Sub-box` | Extract text in right-hand column (State Regulation). |
| `box3_marshall_precedent`| Side B | `[BOX 3] The Modern Precedent` | Extract text answering the 1999 Marshall / 2020 fishery prompt. |
| `box4_privilege_right` | Side B | `[BOX 4] Part A` | Extract text identifying one privilege/right under treaties. |
| `box4_responsibility` | Side B | `[BOX 4] Part B` | Extract text identifying one active civic responsibility. |

---

## 3. Rubric Matrix (18 Points Total)

### Box 1: Primary Source Parse (0–4 Points)
* **4 Points (Exemplary):** Accurately notes that treaties did NOT surrender/cede land AND identifies the truckhouse/trade clause as a reciprocal promise of coexistence and necessaries.
* **3 Points (Proficient):** Notes no land surrender OR explains the trade promise clearly, with minor omission.
* **2 Points (Approaching):** Identifies general peace/friendship agreement, but confuses it with land sale or fails to mention trade.
* **0–1 Points (Beginning / Insufficient):** Blank, illegible, or historically incorrect (e.g., claims Mi'kmaq sold their territory).

### Box 2: Worldview Clash (0–4 Points)
* **4 Points (Exemplary):** Clearly contrasts *Netukulimk* (reciprocal stewardship, taking only what is needed, preserving for future generations) with Crown regulation (commercial exploitation, state licensing, quotas, economic ownership).
* **3 Points (Proficient):** Explains both concepts, but contrast is surface-level (e.g., "Indigenous people like nature, government uses rules").
* **2 Points (Approaching):** Explains one worldview accurately, but leaves the other vague or incomplete.
* **0–1 Points (Beginning / Insufficient):** Incomplete or inaccurate definitions of both concepts.

### Box 3: Donald Marshall Jr. & Moderate Livelihood (0–4 Points)
* **4 Points (Exemplary):** Connects the historical timeline: 1760 truckhouse clause $\rightarrow$ Section 35 constitutional protection $\rightarrow$ 1999 Marshall acquittal (*moderate livelihood*) $\rightarrow$ the 2020 tension over who holds regulatory authority.
* **3 Points (Proficient):** Explains Donald Marshall Jr.'s acquittal based on treaty rights, but connection to 2020 or the truckhouse clause is partial.
* **2 Points (Approaching):** Mentions Marshall was allowed to fish, but lacks legal grounding or connection to the treaty.
* **0–1 Points (Beginning / Insufficient):** Vague, missing, or factually confused.

### Box 4: Civic Synthesis ("We Are All Treaty People") (0–6 Points)
* **Part A: Right / Privilege (0–3 Points):**
  * *3 pts:* Articulates that non-Indigenous citizens live, work, and share unceded land peacefully because of these treaties.
  * *2 pts:* General mention of living in Nova Scotia peacefully.
  * *0–1 pts:* Vague or confused with standard Charter rights.
* **Part B: Active Responsibility (0–3 Points):**
  * *3 pts:* Identifies a concrete civic responsibility (e.g., learning truth, respecting Section 35 rights, holding government to the Honour of the Crown, advocating for equitable resource sharing).
  * *2 pts:* General mention of "being respectful" or "following rules."
  * *0–1 pts:* Passive response or claims non-Indigenous people have no responsibilities.

---

## 4. Expected JSON Output Schema

```json
{
  "doc_id": "CIT9-TR10",
  "student_name": "String",
  "student_code": "ABC",
  "section": "901 | 902 | 903",
  "date": "YYYY-MM-DD",
  "transcriptions": {
    "box1_primary_source": "Transcribed student handwriting",
    "box2_netukulimk": "Transcribed student handwriting",
    "box2_crown": "Transcribed student handwriting",
    "box3_marshall_precedent": "Transcribed student handwriting",
    "box4_privilege_right": "Transcribed student handwriting",
    "box4_responsibility": "Transcribed student handwriting"
  },
  "scores": {
    "box1_score": 4,
    "box2_score": 3,
    "box3_score": 4,
    "box4_part_a_score": 3,
    "box4_part_b_score": 3,
    "total_score": 17
  },
  "feedback_summary": "1-2 sentence constructive teacher comment summarizing strengths and one growth point.",
  "scanner_flags": {
    "low_confidence_handwriting": false,
    "blank_fields_detected": [],
    "manual_review_recommended": false
  }
}
```
