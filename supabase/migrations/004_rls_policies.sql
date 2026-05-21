-- CRM Ascend: RLS policies

ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Helper: active staff check
CREATE OR REPLACE FUNCTION is_active_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users su
    WHERE su.id = auth.uid()
      AND su.is_active = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_admin_staff()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users su
    WHERE su.id = auth.uid()
      AND su.is_active = true
      AND su.role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- staff_users
CREATE POLICY staff_users_select_own ON staff_users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR is_admin_staff());

CREATE POLICY staff_users_update_own ON staff_users
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Generic staff access for CRM tables
CREATE POLICY staff_all_leads ON leads
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_students ON students
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_products ON products
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_contracts ON contracts
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_contract_lines ON contract_lines
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_enrollments ON enrollments
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_services ON services
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_cases ON cases
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_case_comments ON case_comments
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_form_definitions ON form_definitions
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

CREATE POLICY staff_all_form_submissions ON form_submissions
  FOR ALL TO authenticated
  USING (is_active_staff())
  WITH CHECK (is_active_staff());

-- Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
