"""
SHIFTBASE — MASTER TEST SUITE
Covers: Auth, Schema, AI Proposal, Approval, Dry-Run, Execution,
        Quarantine, Rollback, Audit Trail
Scenarios: Best, Medium, Worst, Failure, Complex Stress Test
"""

import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

# ============================================================
# SCENARIO DATASETS
# ============================================================

BEST_CASE = {
    "source_schema": {
        "name": "products_v1",
        "fields": [
            {"name": "product_id", "type": "integer", "nullable": False},
            {"name": "product_name", "type": "string", "nullable": False},
            {"name": "price", "type": "string", "nullable": False},
        ]
    },
    "target_schema": {
        "name": "products_v2",
        "fields": [
            {"name": "id", "type": "integer", "nullable": False},
            {"name": "name", "type": "string", "nullable": False},
            {"name": "price_usd", "type": "float", "nullable": False},
        ]
    },
    "sample_records": [
        {"product_id": 1, "product_name": "Laptop Pro", "price": "999.99"},
        {"product_id": 2, "product_name": "Wireless Mouse", "price": "29.50"},
        {"product_id": 3, "product_name": "USB-C Hub", "price": "45.00"},
    ],
    "expected_migrated": 3,
    "expected_quarantined": 0,
    "expected_risk": "low",
}

MEDIUM_CASE = {
    "source_schema": {
        "name": "employees_legacy",
        "fields": [
            {"name": "emp_id", "type": "integer", "nullable": False},
            {"name": "full_name", "type": "string", "nullable": False},
            {"name": "hire_date", "type": "string", "nullable": True},
            {"name": "salary", "type": "string", "nullable": True},
            {"name": "department", "type": "string", "nullable": True},
            {"name": "bio", "type": "string", "nullable": True},
        ]
    },
    "target_schema": {
        "name": "employees_modern",
        "fields": [
            {"name": "id", "type": "integer", "nullable": False},
            {"name": "first_name", "type": "string", "nullable": False},
            {"name": "last_name", "type": "string", "nullable": False},
            {"name": "joined_at", "type": "string", "nullable": False},
            {"name": "annual_salary", "type": "integer", "nullable": False, "default": 0},
            {"name": "team", "type": "string", "nullable": True},
            {"name": "summary", "type": "string", "nullable": True, "max_length": 50},
        ]
    },
    "sample_records": [
        {"emp_id": 1, "full_name": "Alice Johnson", "hire_date": "01/15/2020", "salary": "85000", "department": "Engineering", "bio": "Senior backend developer."},
        {"emp_id": 2, "full_name": "Bob Smith", "hire_date": "06/22/2021", "salary": "72000", "department": "Marketing", "bio": "Content strategist."},
        {"emp_id": 3, "full_name": "Madonna", "hire_date": "11/05/2022", "salary": "68000", "department": "Design", "bio": "UI designer."},
        {"emp_id": 4, "full_name": "Eve Davis", "hire_date": None, "salary": "77000", "department": "Sales", "bio": "Account executive."},
        {"emp_id": 5, "full_name": "Frank Miller", "hire_date": "08/30/2023", "salary": "not_a_number", "department": "HR", "bio": "Recruiter."},
    ],
    "expected_migrated_min": 2,
    "expected_quarantined_min": 2,
    "expected_risk": "medium",
}

WORST_CASE = {
    "source_schema": {
        "name": "legacy_orders",
        "fields": [
            {"name": "order_num", "type": "string", "nullable": False},
            {"name": "customer_name", "type": "string", "nullable": True},
            {"name": "total_amount", "type": "string", "nullable": True},
            {"name": "order_status", "type": "string", "nullable": True},
            {"name": "notes", "type": "string", "nullable": True},
        ]
    },
    "target_schema": {
        "name": "modern_transactions",
        "fields": [
            {"name": "transaction_id", "type": "integer", "nullable": False},
            {"name": "buyer_email", "type": "string", "nullable": False},
            {"name": "amount_cents", "type": "integer", "nullable": False},
            {"name": "payment_status", "type": "string", "nullable": False, "allowed_values": ["paid", "pending", "refunded"]},
            {"name": "created_at", "type": "string", "nullable": False},
            {"name": "shipping_address", "type": "string", "nullable": False},
        ]
    },
    "sample_records": [
        {"order_num": "ORD-001", "customer_name": "John Doe", "total_amount": "150.00", "order_status": "completed", "notes": "Rush"},
        {"order_num": "ORD-002", "customer_name": None, "total_amount": "89.99", "order_status": "paid", "notes": None},
        {"order_num": "ORD-003", "customer_name": "Jane Smith", "total_amount": "free", "order_status": "shipped", "notes": "Gift"},
        {"order_num": "ORD-004", "customer_name": "Bob Wilson", "total_amount": "200.50", "order_status": "cancelled", "notes": "Changed mind"},
        {"order_num": "ORD-005", "customer_name": "Alice Brown", "total_amount": None, "order_status": "pending", "notes": "Awaiting stock"},
    ],
    "expected_migrated": 0,
    "expected_quarantined": 5,
    "expected_risk": "high",
}

FAILURE_CASE = {
    "source_schema": {
        "name": "iot_sensor_readings",
        "fields": [
            {"name": "sensor_id", "type": "string", "nullable": False},
            {"name": "temperature_c", "type": "string", "nullable": False},
            {"name": "humidity_pct", "type": "string", "nullable": False},
        ]
    },
    "target_schema": {
        "name": "hr_employee_directory",
        "fields": [
            {"name": "employee_id", "type": "integer", "nullable": False},
            {"name": "full_name", "type": "string", "nullable": False},
            {"name": "date_of_birth", "type": "string", "nullable": False},
            {"name": "department", "type": "string", "nullable": False},
            {"name": "salary_usd", "type": "integer", "nullable": False},
        ]
    },
    "sample_records": [
        {"sensor_id": "TEMP-001", "temperature_c": "ERR_OVERFLOW", "humidity_pct": "NaN"},
        {"sensor_id": "TEMP-002", "temperature_c": None, "humidity_pct": None},
        {"sensor_id": None, "temperature_c": "72.5", "humidity_pct": "45.2"},
    ],
    "expected_migrated": 0,
    "expected_quarantined": 3,
    "expected_risk": "high",
}

COMPLEX_CASE = {
    "source_schema": {
        "name": "legacy_employee_records",
        "fields": [
            {"name": "emp_id", "type": "string", "nullable": False},
            {"name": "full_name", "type": "string", "nullable": False},
            {"name": "hire_date", "type": "string", "nullable": True},
            {"name": "annual_salary", "type": "string", "nullable": True},
            {"name": "dept_code", "type": "string", "nullable": True},
            {"name": "biography", "type": "string", "nullable": True},
            {"name": "email_addr", "type": "string", "nullable": True},
            {"name": "is_active", "type": "string", "nullable": True},
        ]
    },
    "target_schema": {
        "name": "modern_staff_directory",
        "fields": [
            {"name": "id", "type": "integer", "nullable": False},
            {"name": "first_name", "type": "string", "nullable": False},
            {"name": "last_name", "type": "string", "nullable": False},
            {"name": "joined_at", "type": "string", "nullable": False},
            {"name": "salary_usd", "type": "integer", "nullable": False, "default": 0},
            {"name": "department", "type": "string", "nullable": True},
            {"name": "bio_summary", "type": "string", "nullable": True, "max_length": 80},
            {"name": "email", "type": "string", "nullable": False},
            {"name": "status", "type": "string", "nullable": False, "allowed_values": ["active", "inactive", "on_leave"]},
        ]
    },
    "sample_records": [
        {"emp_id": "1001", "full_name": "Alice Johnson", "hire_date": "01/15/2020", "annual_salary": "85000", "dept_code": "Engineering", "biography": "Senior backend developer with 8 years of experience in distributed systems and cloud infrastructure.", "email_addr": "alice@company.com", "is_active": "active"},
        {"emp_id": "1002", "full_name": "  Bob   Smith  ", "hire_date": "06/22/2021", "annual_salary": "72000", "dept_code": "Marketing", "biography": "Content strategist.", "email_addr": "bob@company.com", "is_active": "active"},
        {"emp_id": "1003", "full_name": "Carol Anne Williams", "hire_date": "03/10/2019", "annual_salary": "95000", "dept_code": "Engineering", "biography": "Tech lead specializing in React and Node.js with extensive experience in cloud-native microservices architecture.", "email_addr": "carol@company.com", "is_active": "inactive"},
        {"emp_id": "1004", "full_name": "Madonna", "hire_date": "11/05/2022", "annual_salary": "68000", "dept_code": "Design", "biography": "UI designer.", "email_addr": "madonna@company.com", "is_active": "active"},
        {"emp_id": "1005", "full_name": "Eve Davis", "hire_date": None, "annual_salary": "77000", "dept_code": "Sales", "biography": "Account executive.", "email_addr": "eve@company.com", "is_active": "active"},
        {"emp_id": "1006", "full_name": "Frank Miller", "hire_date": "08/30/2023", "annual_salary": "not_a_number", "dept_code": "HR", "biography": "Recruiter.", "email_addr": "frank@company.com", "is_active": "active"},
        {"emp_id": "1007", "full_name": "Grace Lee", "hire_date": "02/14/2021", "annual_salary": "91000", "dept_code": "Engineering", "biography": "Full-stack developer.", "email_addr": None, "is_active": "on_leave"},
        {"emp_id": "1008", "full_name": "Hank OBrien", "hire_date": "13/45/2023", "annual_salary": "64000", "dept_code": "Support", "biography": "Customer support lead.", "email_addr": "hank@company.com", "is_active": "fired"},
        {"emp_id": "1009", "full_name": "Ivy Chen", "hire_date": "09/01/2020", "annual_salary": "105000", "dept_code": "Engineering", "biography": "VP of Engineering.", "email_addr": "ivy@company.com", "is_active": "active"},
        {"emp_id": "ABC", "full_name": "Jake Torres", "hire_date": "04/15/2022", "annual_salary": "58000", "dept_code": "Operations", "biography": "Operations coordinator.", "email_addr": "jake@company.com", "is_active": "active"},
    ],
    "expected_migrated_min": 3,
    "expected_quarantined_min": 4,
    "expected_risk": "medium",
}


# ============================================================
# HELPER: PIPELINE RUNNER
# ============================================================

async def run_full_pipeline(client, scenario, scenario_name):
    resp = await client.post("/api/schemas/init", json={
        "source_schema": scenario["source_schema"],
        "target_schema": scenario["target_schema"],
        "sample_records": scenario["sample_records"],
    })
    assert resp.status_code == 200, f"Init failed: {resp.text}"
    plan_id = resp.json()["plan_id"]

    resp = await client.post(f"/api/plans/{plan_id}/propose")
    assert resp.status_code == 200, f"Propose failed: {resp.text}"
    proposal = resp.json()

    resp = await client.post(f"/api/plans/{plan_id}/approve", json={"approved_by": "test_lead"})
    assert resp.status_code == 200, f"Approve failed: {resp.text}"

    resp = await client.post(f"/api/migration/{plan_id}/dry-run")
    assert resp.status_code == 200, f"Dry-run failed: {resp.text}"
    dry_run = resp.json()

    resp = await client.post(f"/api/migration/{plan_id}/execute")
    assert resp.status_code == 200, f"Execute failed: {resp.text}"
    execution = resp.json()

    resp = await client.get(f"/api/migration/{plan_id}/verify")
    assert resp.status_code == 200
    verify = resp.json()

    resp = await client.post(f"/api/migration/{plan_id}/rollback")
    assert resp.status_code == 200, f"Rollback failed: {resp.text}"

    resp = await client.get(f"/api/audit/{plan_id}")
    assert resp.status_code == 200
    audit = resp.json()

    return {
        "plan_id": plan_id,
        "mappings_count": len(proposal["mappings"]),
        "overall_risk": proposal["overall_risk"],
        "dry_run_balanced": dry_run["verification"]["balanced"],
        "exec_status": execution["status"],
        "exec_target": execution["counts"]["target"],
        "exec_quarantined": execution["counts"]["quarantined"],
        "exec_balanced": execution["verification"]["balanced"],
        "verify_balanced": verify["balanced"],
        "audit_events": audit["total"],
    }


# ============================================================
# TEST CASES
# ============================================================

class TestSystemAndAuth:
    @pytest.mark.asyncio
    async def test_health_check(self, client):
        resp = await client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json()["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_auth_lifecycle(self, client):
        resp = await client.post("/api/auth/signup", json={
            "username": "tester101",
            "email": "tester101@shiftbase.io",
            "password": "password123"
        })
        assert resp.status_code == 200

        resp = await client.post("/api/auth/login", json={
            "username": "tester101",
            "password": "password123"
        })
        assert resp.status_code == 200

        resp = await client.get("/api/auth/me")
        assert resp.status_code == 200

        resp = await client.post("/api/auth/logout")
        assert resp.status_code == 200


class TestScenarios:
    @pytest.mark.asyncio
    async def test_best_case(self, client):
        r = await run_full_pipeline(client, BEST_CASE, "BEST")
        assert r["exec_status"] == "completed"
        assert r["exec_target"] == 3
        assert r["exec_quarantined"] == 0
        assert r["verify_balanced"] is True
        print(f"\n  [BEST CASE] 3 Migrated, 0 Quarantined -> PASSED")

    @pytest.mark.asyncio
    async def test_medium_case(self, client):
        r = await run_full_pipeline(client, MEDIUM_CASE, "MEDIUM")
        assert r["exec_status"] == "completed"
        assert r["exec_target"] >= 2
        assert r["exec_quarantined"] >= 2
        assert r["verify_balanced"] is True
        print(f"\n  [MEDIUM CASE] {r['exec_target']} Migrated, {r['exec_quarantined']} Quarantined -> PASSED")

    @pytest.mark.asyncio
    async def test_worst_case(self, client):
        r = await run_full_pipeline(client, WORST_CASE, "WORST")
        assert r["exec_status"] == "completed"
        assert r["exec_target"] == 0
        assert r["exec_quarantined"] == 5
        assert r["verify_balanced"] is True
        print(f"\n  [WORST CASE] 0 Migrated, 5 Quarantined (100% Isolated) -> PASSED")

    @pytest.mark.asyncio
    async def test_failure_case(self, client):
        r = await run_full_pipeline(client, FAILURE_CASE, "FAILURE")
        assert r["exec_status"] == "completed"
        assert r["exec_target"] == 0
        assert r["exec_quarantined"] == 3
        assert r["verify_balanced"] is True
        print(f"\n  [FAILURE CASE] 0 Migrated, 3 Quarantined -> PASSED")

    @pytest.mark.asyncio
    async def test_complex_case(self, client):
        r = await run_full_pipeline(client, COMPLEX_CASE, "COMPLEX")
        assert r["exec_status"] == "completed"
        assert r["exec_target"] >= 2
        assert r["exec_quarantined"] >= 4
        assert r["verify_balanced"] is True
        print(f"\n  [COMPLEX CASE] {r['exec_target']} Migrated, {r['exec_quarantined']} Quarantined -> PASSED")


class TestGuards:
    @pytest.mark.asyncio
    async def test_unapproved_execution_blocked(self, client):
        resp = await client.post("/api/schemas/init", json={
            "source_schema": BEST_CASE["source_schema"],
            "target_schema": BEST_CASE["target_schema"],
            "sample_records": BEST_CASE["sample_records"][:1],
        })
        plan_id = resp.json()["plan_id"]
        resp = await client.post(f"/api/migration/{plan_id}/execute")
        assert resp.status_code == 403

    @pytest.mark.asyncio
    async def test_duplicate_execution_blocked(self, client):
        resp = await client.post("/api/schemas/init", json={
            "source_schema": BEST_CASE["source_schema"],
            "target_schema": BEST_CASE["target_schema"],
            "sample_records": BEST_CASE["sample_records"][:1],
        })
        plan_id = resp.json()["plan_id"]
        await client.post(f"/api/plans/{plan_id}/propose")
        await client.post(f"/api/plans/{plan_id}/approve", json={"approved_by": "tester"})
        await client.post(f"/api/migration/{plan_id}/execute")
        resp = await client.post(f"/api/migration/{plan_id}/execute")
        assert resp.status_code in [403, 409]  # 403 if plan status changed, 409 if dedup fires first
