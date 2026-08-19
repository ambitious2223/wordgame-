# Git Commands Quick Reference

## First Time Setup (Already Done)
```bash
git init
git config user.email "ambitious2223@users.noreply.github.com"
git config user.name "ambitious2223"
git remote add origin https://github.com/ambitious2223/wordgame-.git
```

## Daily Workflow

### Check Status
```bash
git status
```

### Add All Changes
```bash
git add .
```

### Commit with Message
```bash
git commit -m "Your message here"
```

### Push to GitHub
```bash
git push
```

### Pull Latest
```bash
git pull
```

## Quick Commit (One-liner)
```bash
git add .; git commit -m "message"; git push
```

## View Log
```bash
git log --oneline -10
```

## Create New Branch
```bash
git checkout -b feature-name
```

## Switch Branch
```bash
git checkout main
```

## Delete Branch
```bash
git branch -d feature-name
```

## View Remote
```bash
git remote -v
```

## Force Pull (Overwrite local)
```bash
git fetch origin; git reset --hard origin/main
```

---

**Repository:** https://github.com/ambitious2223/wordgame-.git
**Branch:** main
**Last Updated:** 2026-08-19
