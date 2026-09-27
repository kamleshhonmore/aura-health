# Security Specification: Aura Health Firebase Security Architecture

## 1. Data Invariants
1. **Master Gate**: All user health records (`dailyLogs`, `cycles`, `assessments`, `ayurvedicProfile`) reside strictly under `/users/{userId}/...`. A user may only read, list, create, update, or delete records if and only if `request.auth.uid == userId`.
2. **Identity Integrity**: Incoming documents must have `userId == request.auth.uid` or `uid == request.auth.uid`. Cross-user injection is prohibited.
3. **No Blanket Reads**: Every query must be scoped to the authenticated user's own path. Default deny-all prevents accidental cross-collection exposure.
4. **Data Type and Boundary Enforcement**:
   - `date` path and field must conform to `YYYY-MM-DD` (regex and length checks).
   - Notes field limited to 1,000 characters to prevent wallet-drain resource poisoning.
   - Symptoms and moods arrays must have bounded lengths (<= 30 elements).
   - Numerical fields like `waterGlasses`, `riskScore`, and temperatures must be numeric and non-negative.
5. **No Self-Assigned Privileges**: The user cannot escalate privileges or write to administrative collections.
6. **Immutable Critical Fields**: Document keys like `userId` and `date` cannot be mutated on update (`incoming().userId == existing().userId`).

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Cross-Tenant Profile Hijack**: Malicious authenticated user `attacker123` attempts to write `users/victim456`. -> **REJECTED** (uid mismatch).
2. **Orphan Log Write**: Attempting to write a `dailyLogs` entry where `incoming().userId != request.auth.uid`. -> **REJECTED**.
3. **Ghost / Shadow Field Injection**: Injecting arbitrary internal keys `isAdmin: true` into `users/{userId}`. -> **REJECTED** (validation helper checks allowed keys).
4. **Denial of Wallet Buffer Overrun**: Submitting a 5MB junk string in `notes`. -> **REJECTED** (`size() <= 1000`).
5. **Array Exhaustion Attack**: Submitting 50,000 array elements in `symptoms`. -> **REJECTED** (`size() <= 30`).
6. **ID Poisoning / Path Traversal**: Requesting document with malicious path `users/victim..%2F..admin`. -> **REJECTED** (`isValidId()` constraint).
7. **Negative or Absurd Value Injection**: Submitting `waterGlasses: -9999` or `waterGlasses: "eight"`. -> **REJECTED** (type check `is int && >= 0`).
8. **Invalid Date Format Tampering**: Submitting `date: "not-a-date"`. -> **REJECTED** (regex check `matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')`).
9. **Anonymous / Unauthenticated Read**: Unauthenticated request attempting to read `users/user1/dailyLogs`. -> **REJECTED** (`isSignedIn()`).
10. **Immutable Field Tampering**: Updating an existing cycle and changing `userId` to someone else. -> **REJECTED** (`incoming().userId == existing().userId`).
11. **Risk Score Spoofing Out of Bounds**: Sending `riskScore: 99999` on PCOS assessment. -> **REJECTED** (`riskScore >= 0 && riskScore <= 100`).
12. **Blanket Collection Scraping**: Performing collectionGroup query across all users' daily logs. -> **REJECTED** (no collectionGroup read permitted).
