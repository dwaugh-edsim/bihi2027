#!/usr/bin/env python3
"""Room 8 sync check — "will the work I did here be at school?"

A file reaches the other machine only if ALL THREE are true:

  1. it lives in a repo that is cloned on BOTH machines,
  2. it is NOT ignored by that repo's .gitignore,
  3. it is committed AND pushed.

This checks 1-3 for both repos and names anything that fails, so nothing can
silently stay behind. Run it before you close a session:

    python scripts/sync_check.py                    # from the public repo
    python ../bihi2027/scripts/sync_check.py        # from anywhere

Exit code 0 = everything will travel. 1 = something will not.
"""

import os
import subprocess
import sys

# File patterns that are NEVER content — safe to be untracked/ignored.
NOISE = ('__pycache__', '*.pyc', '.zcode', '.DS_Store', 'Thumbs.db',
         '~$*', '*.tmp', '*.bak', 'node_modules', '.kilo', '*.code-workspace')

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.dirname(HERE)
PRIVATE = os.path.normpath(os.path.join(PUBLIC, '..', 'bihipri-27'))

# Paths ignored HERE on purpose, whose real (traveling) copy lives in the private repo.
# Keyed by public prefix -> private prefix. Anything ignored in the public repo that
# resolves through here is fine IF the private copy is tracked.
PAIRED = {'Private_Student_Data/': 'Private_Student_Data-priv/'}

OK, WARN, BAD = '\u2705', '\u26a0\ufe0f', '\u274c'


def paired_private_path(pub_rel):
    rel = pub_rel.replace('\\', '/')
    for pub_pfx, priv_pfx in PAIRED.items():
        if rel.startswith(pub_pfx):
            return priv_pfx + rel[len(pub_pfx):]
    return None


def git(repo, *args):
    """Run git in `repo`; return stdout lines, or None if the repo is unusable."""
    try:
        out = subprocess.run(['git', '-C', repo] + list(args),
                             capture_output=True, text=True, timeout=60)
    except Exception:
        return None
    if out.returncode != 0 and not out.stdout.strip():
        return None
    return [l for l in out.stdout.splitlines() if l.strip()]


def is_noise(path):
    parts = path.replace('\\', '/').split('/')
    for p in parts:
        for pat in NOISE:
            if pat.startswith('*'):
                if p.endswith(pat[1:]):
                    return True
            elif p == pat or (pat.endswith('*') and p.startswith(pat[:-1])):
                return True
    return False


def check(repo, label, required):
    if not os.path.isdir(os.path.join(repo, '.git')):
        level = BAD if required else WARN
        print('%s %s: NOT CLONED on this machine (%s)' % (level, label, repo))
        if required:
            print('   -> anything you put there cannot reach the other machine.')
            print('   -> clone it:  git clone <url> "%s"' % repo)
        return 1 if required else 0

    problems = 0
    print('%s %s (%s)' % (OK, label, repo))

    branch = (git(repo, 'branch', '--show-current') or ['?'])[0]
    git(repo, 'fetch', '--quiet', 'origin')          # tolerate offline failure

    ahead = git(repo, 'log', '--oneline', 'origin/%s..HEAD' % branch) or []
    behind = git(repo, 'log', '--oneline', 'HEAD..origin/%s' % branch) or []
    if ahead:
        print('   %s %d commit(s) NOT PUSHED — the other machine cannot see them:' % (BAD, len(ahead)))
        for l in ahead[:8]:
            print('        ' + l)
        problems += len(ahead)
    if behind:
        print('   %s %d commit(s) on the remote you have NOT PULLED — pull before working:' % (WARN, len(behind)))
        for l in behind[:8]:
            print('        ' + l)
        problems += 1

    # Files that exist here but are not committed -> will NOT travel.
    untracked = git(repo, 'ls-files', '--others', '--exclude-standard') or []
    ignored = git(repo, 'ls-files', '--others', '--ignored', '--exclude-standard') or []
    untracked = [f for f in untracked if not is_noise(f)]
    ignored = [f for f in ignored if not is_noise(f)]

    if untracked:
        print('   %s %d file(s) exist here but are NOT COMMITTED — they will NOT travel:' % (BAD, len(untracked)))
        for f in untracked[:12]:
            print('        ' + f)
        if len(untracked) > 12:
            print('        … and %d more' % (len(untracked) - 12))
        print('        fix:  git add <file> && git commit && git push')
        problems += len(untracked)
    if ignored:
        paired, stranded = [], []
        private_ok = os.path.isdir(os.path.join(PRIVATE, '.git'))
        for f in ignored:
            p = paired_private_path(f) if repo == PUBLIC else None
            if p and private_ok and git(PRIVATE, 'ls-files', p):
                paired.append((f, p))
            else:
                stranded.append(f)
        if paired:
            print('   %s %d file(s) ignored here ON PURPOSE — and tracked in the private repo, so they travel:' % (OK, len(paired)))
            for f, p in paired[:6]:
                print('        %s  ->  bihipri-27/%s' % (f, p))
        if stranded:
            print('   %s %d file(s) are IGNORED here and NOT tracked anywhere — they will NOT travel:' % (BAD, len(stranded)))
            for f in stranded[:12]:
                print('        ' + f)
            print('        fix:  move it to the private repo (and commit there), or un-ignore that path')
            problems += len(stranded)

    if not problems:
        print('   %s clean — everything here is committed, pushed, and travelable' % OK)
    return problems


def main():
    pub = check(PUBLIC, 'PUBLIC  bihi2027 (student-facing)', required=True)
    priv = check(PRIVATE, 'PRIVATE bihipri-27 (planning, keys, tools, audits)', required=True)

    print()
    if pub + priv == 0:
        print('%s VERDICT: everything you worked on will be at the other machine.' % OK)
        return 0
    print('%s VERDICT: %d issue(s) above will NOT reach the other machine.' % (BAD, pub + priv))
    return 1


if __name__ == '__main__':
    sys.exit(main())