# BalanceIQ Test Cases

## TC_AUTH_001

Module: Authentication

Scenario: User Login

Input: Valid Email and Password

Expected Result: JWT token generated successfully

Actual Result: Token generated successfully

Status: PASS

---

## TC_AUTH_002

Module: Authentication

Scenario: Get Current User Profile

Input: Valid User Email

Expected Result: User profile returned successfully

Actual Result: Profile returned successfully

Status: PASS

---

## TC_ACT_001

Module: Activity Tracking

Scenario: Start Session

Input: Employee starts shift

Expected Result: Session starts successfully

Actual Result: Session started successfully

Status: PASS

---

## TC_ACT_002

Module: Activity Tracking

Scenario: End Session

Input: Employee ends shift

Expected Result: Session ends successfully

Actual Result: Session ended successfully

Status: PASS

---

## TC_BUR_001

Module: Burnout Prediction

Scenario: Burnout Assessment

Input: Employee activity information

Expected Result: Burnout risk level generated

Actual Result: Burnout risk generated successfully

Status: PASS

---

## TC_DASH_001

Module: Dashboard Analytics

Scenario: Get Employee Dashboard

Expected Result: Dashboard information returned

Actual Result: Dashboard information returned successfully

Status: PASS

---

## TC_DASH_002

Module: Dashboard Analytics

Scenario: Get Team Summary

Expected Result: Team summary returned

Actual Result: Team summary returned successfully

Status: PASS

---

## TC_DASH_003

Module: Dashboard Analytics

Scenario: Get High Risk Employees

Expected Result: High-risk employee list returned

Actual Result: Employee list returned successfully

Status: PASS

---

## TC_DASH_004

Module: Dashboard Analytics

Scenario: Get All Employees

Expected Result: Employee list returned

Actual Result: Employee list returned successfully

Status: PASS

---

## TC_DASH_005

Module: Dashboard Analytics

Scenario: Get Department Summary

Expected Result: Department analytics returned

Actual Result: Department analytics returned successfully

Status: PASS

---

## TC_APP_001

Module: Spring Boot Application

Scenario: Application Context Load

Expected Result: Spring context loads successfully

Actual Result: Context loaded successfully

Status: PASS

---

## Summary

Total Test Cases: 11

Passed: 11

Failed: 0

Overall Result: SUCCESS
