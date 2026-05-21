-- CRM Ascend: enums
CREATE TYPE lead_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'disqualified',
  'converted'
);

CREATE TYPE student_status AS ENUM (
  'prospect',
  'active',
  'inactive'
);

CREATE TYPE product_type AS ENUM (
  'course',
  'mentorship',
  'addon',
  'bundle',
  'other'
);

CREATE TYPE contract_status AS ENUM (
  'draft',
  'active',
  'suspended',
  'ended',
  'cancelled'
);

CREATE TYPE enrollment_status AS ENUM (
  'pending',
  'active',
  'suspended',
  'ended'
);

CREATE TYPE case_status AS ENUM (
  'new',
  'in_progress',
  'waiting_customer',
  'resolved',
  'closed'
);

CREATE TYPE case_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE staff_role AS ENUM (
  'admin',
  'sales',
  'support',
  'finance',
  'read_only'
);
