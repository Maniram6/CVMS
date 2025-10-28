-- =============================================
--  LOCATION TABLE
-- =============================================
CREATE TABLE location (
    city_name      VARCHAR(100) PRIMARY KEY,
    state_name     VARCHAR(100),
    country_name   VARCHAR(100)
);

-- =============================================
--  BRANCH TABLE
-- =============================================
CREATE TABLE branch (
    branch_name    VARCHAR(255) PRIMARY KEY,
    location       VARCHAR(100) NOT NULL REFERENCES location(city_name) ON DELETE CASCADE,
    address        TEXT
);

-- =============================================
--  CLIENT VISITS TABLE
-- =============================================
CREATE TABLE client_visits (
    client_visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    project             VARCHAR(150) NOT NULL,
    team                VARCHAR(100),
    visit_from_date     DATE NOT NULL,
    visit_to_date       DATE NOT NULL,

    branch_name         VARCHAR(255) NOT NULL REFERENCES branch(branch_name),
    location            VARCHAR(100) NOT NULL REFERENCES location(city_name),

    status              VARCHAR(30) DEFAULT 'ACTIVE',  -- ACTIVE / COMPLETED / CANCELLED

    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_visit_dates CHECK (visit_to_date >= visit_from_date)
);

-- =============================================
--  CLIENTS TABLE
-- =============================================
CREATE TABLE clients (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    
    client_name        VARCHAR(100) NOT NULL,
    email              VARCHAR(150) NOT NULL,
    contact_no         VARCHAR(20),
    designation        VARCHAR(100),

    created_by         VARCHAR(100),
    updated_by         VARCHAR(100),
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at         TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  ONSITE RESOURCES TABLE
-- =============================================
CREATE TABLE onsite_resources (
    onsite_resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,

    resource_name     VARCHAR(100) NOT NULL,
    resource_mail     VARCHAR(150) NOT NULL,
    resource_contact  VARCHAR(20),
    resource_role     VARCHAR(100),

    created_by        VARCHAR(100),
    updated_by        VARCHAR(100),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP WITH TIME ZONE
);




--- ENUM

INSERT INTO location (city_name, state_name, country_name) VALUES
('Hyderabad', 'Telangana', 'India'),
('Chennai', 'Tamil Nadu', 'India'),
('Bangalore', 'Karnataka', 'India');

INSERT INTO branch (branch_name, location, address) VALUES
('Hyderabad Branch 1', 'Hyderabad', 'Hitech City, Hyderabad'),
('Chennai Branch 1', 'Chennai', 'OMR Road, Chennai'),
('Chennai Branch 2', 'Chennai', 'Guindy Industrial Estate, Chennai'),
('Bangalore Branch 1', 'Bangalore', 'Whitefield, Bangalore'),
('Bangalore Branch 2', 'Bangalore', 'Electronic City, Bangalore');






-- ✅ INSERTING MOCK DATA

-- Client visits
INSERT INTO client_visits (client_visit_id, project, team, visit_from_date, visit_to_date, status, branch_name, location, created_by)
VALUES
('b3726cb5-6577-4f1d-baf6-0dc7a8c8b201', 'Apollo Upgrade', 'Team A', '2025-11-01', '2025-11-03', 'ACTIVE', 'Hyderabad Branch 1', 'Hyderabad', 'admin'),
('c7d5d823-9a53-4cb7-a21a-8e04f4c9a902', 'Apollo Upgrade', 'Team A', '2025-12-01', '2025-12-05', 'ACTIVE', 'Chennai Branch 1', 'Chennai', 'admin'),
('d4e7b86f-7b19-4661-b1f7-8f7468dbcb45', 'Project Orion',  'Team B', '2025-11-15', '2025-11-18', 'ACTIVE', 'Bangalore Branch 1', 'Bangalore', 'admin'),
('e8c3d579-68b0-4c3b-b31d-2d38b1a0cf9f', 'Luna Migration', 'Team C', '2025-11-20', '2025-11-22', 'ACTIVE', 'Chennai Branch 2', 'Chennai', 'admin');


-- Clients
INSERT INTO clients (client_id, client_visit_id, client_name, email, contact_no, designation, created_by)
VALUES
-- Visit 1 clients
('3df41b41-cc38-4af4-a71f-016c927e4b0a', 'b3726cb5-6577-4f1d-baf6-0dc7a8c8b201', 'John Carter', 'john.carter@apollo.com', '9876543210', 'CTO', 'admin'),
('50472a86-00cd-49a0-bc1f-2a88fc356a07', 'b3726cb5-6577-4f1d-baf6-0dc7a8c8b201', 'Emily Stone', 'emily.stone@apollo.com', '8765432109', 'Manager', 'admin'),

-- Visit 2 clients (same project, different duration)
('66f3a062-6efb-46ac-9c60-3ac1efb52bfa', 'c7d5d823-9a53-4cb7-a21a-8e04f4c9a902', 'David King', 'david.king@apollo.com', '9876501234', 'Director', 'admin'),

-- Visit 3 clients
('7ab64e91-23cf-440b-87c0-9f82f5b93261', 'd4e7b86f-7b19-4661-b1f7-8f7468dbcb45', 'Sophie Turner', 'sophie.turner@orion.io', '7890123456', 'VP Engineering', 'admin'),

-- Visit 4 clients
('8b3495b4-5b7e-4604-b89f-10b0f46adf9b', 'e8c3d579-68b0-4c3b-b31d-2d38b1a0cf9f', 'Michael Brown', 'michael.brown@luna.org', '8901234567', 'Product Head', 'admin');

-- Onsite resources
INSERT INTO onsite_resources (onsite_resource_id, client_visit_id, resource_name, resource_mail, resource_contact, resource_role, created_by)
VALUES
-- Visit 1 resources
('c9e65f7d-f7cb-4a6f-a64f-6f8c2b71998a', 'b3726cb5-6577-4f1d-baf6-0dc7a8c8b201', 'Alice Johnson', 'alice.j@company.com', '9012345678', 'Onsite Engineer', 'admin'),
('e5a67948-0b5c-43e2-9502-4b2f0bdb258a', 'b3726cb5-6577-4f1d-baf6-0dc7a8c8b201', 'Robert Smith', 'robert.s@company.com', '9123456780', 'Account Manager', 'admin'),

-- Visit 2 resources
('f36a76e2-1293-4c41-a2e0-4b5b313ebabb', 'c7d5d823-9a53-4cb7-a21a-8e04f4c9a902', 'Linda Ray', 'linda.r@company.com', '9234567890', 'Solution Architect', 'admin'),

-- Visit 3 resources
('a84bc939-c23f-4b4d-9498-f3f9d8cf55c2', 'd4e7b86f-7b19-4661-b1f7-8f7468dbcb45', 'Tom Hanks', 'tom.h@company.com', '9345678901', 'Support Lead', 'admin'),

-- Visit 4 resources
('b92f3c41-d8e8-4f22-8cc0-86e0a8ff15e3', 'e8c3d579-68b0-4c3b-b31d-2d38b1a0cf9f', 'Kate Winslet', 'kate.w@company.com', '9456789012', 'Implementation Specialist', 'admin');