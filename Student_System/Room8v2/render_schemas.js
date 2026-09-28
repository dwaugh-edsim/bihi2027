/**
 * Room 8 v2 — GAS Station Render Schemas                R8-SCHEMAS-0.1.0
 *
 * Declarative rendering configs for assignments that the Station doesn't
 * already know how to render. Loaded by gas_station.html as a plain <script>.
 *
 * Schema format matches the legacy schema shape (legacyMarkSheet()):
 *   { title, badge?, sections: [{ num, title, hint?, fields: [{ key, label, type, ... }] }] }
 *
 * Field types:
 *   text/textarea  — string field, shown in mk-val box
 *   chips          — array shown as chip row
 *   array          — array shown as numbered items with optional per-item labels
 *   sorter         — object of {pick, why} entries, rendered as a B/F card table
 *                    Config: cards: { key: { name, desc } }
 *   ratings        — 4-level scale track (existing)
 *   place          — map card (existing)
 *   map            — key-value object (existing)
 *   checks         — checkbox multi-select (existing)
 *   quiz           — knowledge-check questions (existing)
 */
window.R8_SCHEMAS = {

  // =====================================================================
  //  HL8 · Unit 1 · Junction — Exhibit 1: Strategy Matrix
  // =====================================================================
  'HL8 Junction Exhibit 1 \u2014 Strategy Matrix': {
    title: 'Exhibit 1 \u2014 The Strategy Matrix',
    badge: 'HL8 \u00b7 JUNCTION \u00b7 EXHIBIT 1',
    sections: [
      {
        num: '1', title: 'Alarm Watch',
        hint: 'From Side A \u2014 the moments Sam\u2019s smoke detector fired.',
        fields: [
          { key: 'alarm', label: 'Alarm moments (in order)', type: 'text' }
        ]
      },
      {
        num: '2', title: 'The Chain',
        hint: 'Sam posts the clapback at 10:47 PM. Three dominoes that fall.',
        fields: [
          { key: 'chain', label: 'Dominoes', type: 'array',
            items: [
              { label: 'Domino 1' },
              { label: 'Domino 2' },
              { label: 'Domino 3' }
            ] }
        ]
      },
      {
        num: '3', title: 'The Sorter',
        hint: 'B = breaks the chain, F = feeds the fire.',
        fields: [
          { key: 'sorter', label: 'B/F Sort', type: 'sorter',
            cards: {
              grounding: { name: 'THE GROUNDING PAUSE',
                desc: 'Phone face-down, feet flat, sixty seconds. Count 5-4-3-2-1. Then decide.' },
              boundary:  { name: 'THE BOUNDARY TEXT',
                desc: '\u201cNot doing this tonight. See you at practice.\u201d Then exit the chat.' },
              kitchen:   { name: 'PHONE IN THE KITCHEN',
                desc: 'The physical circuit breaker. Charger stays downstairs tonight.' },
              clapback:  { name: 'THE CLAPBACK',
                desc: 'Public retaliation \u2014 firing back an angry, defensive counter-attack into the 40-person chat at 10:47 PM.' },
              scroll:    { name: 'SCROLL TO CALM DOWN',
                desc: 'Keep reading the chat. \u201cJust to see what they say next.\u201d' },
              adult:     { name: 'TRUSTED ADULT, FIRST LIGHT',
                desc: 'Tell Coach \u2014 or Mom \u2014 the real story before school.' }
            } }
        ]
      },
      {
        num: '4', title: 'Exit Ticket \u2014 Your Call',
        hint: 'Sam should (name one card) \u2014 two sentences, using \u201calarm\u201d or \u201cstrategist\u201d.',
        fields: [
          { key: 'call', label: 'Your Call', type: 'text' }
        ]
      }
    ]
  },

  // =====================================================================
  //  HL8 · Unit 1 · Junction — Exhibit 2: Tipping Point
  // =====================================================================
  'HL8 Junction Exhibit 2 \u2014 Tipping Point': {
    title: 'Exhibit 2 \u2014 The Tipping-Point Tally',
    badge: 'HL8 \u00b7 JUNCTION \u00b7 EXHIBIT 2',
    sections: [
      {
        num: '1', title: 'The Tally',
        hint: 'How many fires is Sam carrying on Friday morning? The exact moment the stack tipped.',
        fields: [
          { key: 'fires', label: 'Fires and the tipping moment', type: 'text' }
        ]
      },
      {
        num: '2', title: 'The Cascade',
        hint: 'Sam changes nothing. Three real events over the next four days \u2014 not feelings, events.',
        fields: [
          { key: 'cascade', label: 'Cascade timeline', type: 'array',
            items: [
              { label: 'By Saturday' },
              { label: 'By Sunday' },
              { label: 'By Monday' }
            ] }
        ]
      },
      {
        num: '3', title: 'The Sorter',
        hint: 'B = puts the fire out, F = feeds it.',
        fields: [
          { key: 'sorter', label: 'B/F Sort', type: 'sorter',
            cards: {
              boundary: { name: 'THE BOUNDARY SCRIPT',
                desc: 'Assertive. \u201cI can\u2019t do Thursday. Here\u2019s exactly what I can do by Monday.\u201d Said once, calmly \u2014 then stops explaining.' },
              absorb:   { name: 'SAY NOTHING, ABSORB IT ALL',
                desc: 'Passive. Take the missing share, take the late shift, take the silent treatment \u2014 and tell nobody it is heavy.' },
              snap:     { name: 'THE SNAP',
                desc: 'Aggressive. Explode at the squad, at Rae, or at the teacher. Get the anger out of the body, land it on whoever is closest.' },
              onefire:  { name: 'PICK ONE FIRE',
                desc: 'Triage. Name the single most urgent fire and put that one out today, properly. The rest is allowed to wait until tomorrow.' },
              written:  { name: 'THE WRITTEN ASK',
                desc: 'Reply today, in writing, with a real plan attached. A paper trail beats a panic email at 2 AM.' },
              adult:    { name: 'THE ADULT KNOCK',
                desc: 'Bring a trusted adult in today. A load that gets shared stops being a load.' }
            } }
        ]
      },
      {
        num: '4', title: 'Exit Ticket \u2014 Your Call',
        hint: 'Sam should (name one card) \u2014 two sentences, and say whether that move is assertive, passive, or aggressive.',
        fields: [
          { key: 'call', label: 'Your Call', type: 'text' }
        ]
      }
    ]
  }

};
