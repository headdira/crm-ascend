-- Permite primeiro login criar própria linha em staff_users (id = auth.uid())

CREATE POLICY staff_users_insert_self ON staff_users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
