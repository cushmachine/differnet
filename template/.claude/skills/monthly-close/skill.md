---
name: Monthly Close
description: Checklist and automation for end-of-month operational and financial close
owner: system
visibility: [finance]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "last business day of month at 9am"
secrets: []
---

# Monthly Close

End-of-month operational close process. Combines automated data pulls with
manual review checkpoints.

## Timeline
- **T-3 days**: Pre-close data review
- **T-1 day**: Final reconciliation
- **T-0 (last business day)**: Close and report

## Steps

### 1. Pre-close data review (assisted)
Pull data from connected systems and flag anomalies:
- Revenue by channel from `map/supply-chain.yml` channels
- Vendor spend from `map/counterparties.yml`
- Outstanding POs and invoices

Check for:
- Transactions missing from expected sources
- Unusual amounts (>2 standard deviations from trailing 3-month average)
- Unreconciled items from previous months

### 2. Inventory reconciliation (assisted)
Compare physical inventory counts against system records:
- Read current stock levels from inventory system (if integrated)
- Compare against `map/supply-chain.yml` reorder rules
- Flag discrepancies > 5%

### 3. Vendor payment review (documented)
- [ ] Review all vendor invoices received this month
- [ ] Match invoices to POs and delivery receipts
- [ ] Flag disputed items
- [ ] Approve payment batch (human action)

### 4. Revenue recognition (documented)
- [ ] Verify all orders shipped have been invoiced
- [ ] Reconcile payment processor (Stripe) with accounting system
- [ ] Handle refunds and chargebacks
- [ ] Post revenue entries (human action)

### 5. Contract and renewal check (full)
Scan `map/counterparties.yml` for:
- Contracts renewing in the next 60 days
- Create reminders or tasks for contract review
- Update memory pages for affected vendors/partners

### 6. Generate close report (full)
Write to `output/monthly-close-YYYY-MM.md`:
- Revenue summary by channel
- Top vendor spend
- Inventory status and alerts
- Anomalies found and their resolution status
- Action items carried to next month

### 7. Memory update (full)
Append a timeline entry to relevant memory pages noting:
- Month-end financial snapshot
- Key decisions made during close
- Issues discovered and their resolution
