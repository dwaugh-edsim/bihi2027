/**
 * Node runner for the Digital Werewolf engine self-test.
 * Usage: node engine/selftest_node.js   (exit 0 = pass, 1 = fail)
 */
'use strict';

require('./story_content.js');
require('./story_engine.js');
const E = require('./werewolf_engine.js');

try {
  const res = E.runSelfTest();
  const failed = (res.results || []).filter(function (r) { return !r.ok; });
  console.log(JSON.stringify({
    ok: res.ok && failed.length === 0,
    passed: res.passed,
    failed: failed,
    winner: res.winner,
    rounds: res.rounds,
    engineVersion: E.ENGINE_VERSION
  }, null, 2));
  process.exit(res.ok && failed.length === 0 ? 0 : 1);
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: String(err && err.message || err) }));
  process.exit(1);
}
