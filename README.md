# 2Star Staffing — Employee App (PWA)

Installable mobile web app for employees: view payslips, payroll history,
ESIC and bank details. Uses the **same backend and database** as the admin
dashboard.

## Run

```bash
npm install
npm run dev        # http://localhost:8081
```

Backend must be running (`npm run dev` in `2starllp-backend`, port 3000).

## Login

Mobile number + password. **First-time password = the employee's mobile
number.** Employees can reset it from "Forgot password?" (OTP goes to the
employee's registered email).

## Install as an app

PWA install works on `localhost` and on any **HTTPS** domain.
- Android/Chrome: menu → "Install app" / "Add to Home screen"
- iPhone/Safari: Share → "Add to Home Screen"

## Build

```bash
npm run build && npm run preview
```
