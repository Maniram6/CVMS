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
--  PROJECT TABLE
-- =============================================

CREATE TABLE project (
    project_name VARCHAR(150) PRIMARY KEY,
    team VARCHAR(100),
    swon_number VARCHAR(100)
)

-- =============================================
--  COORDINATOR TABLE
-- =============================================
CREATE TABLE coordinator (
    coordinator_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coordinator_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    contact_no VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  BILLING TABLE
-- =============================================
CREATE TABLE billing (
    billing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    billing_type VARCHAR(50) NOT NULL, -- CLIENT_BILLING / INTERNAL_BILLING etc.
    billing_ownership VARCHAR(255),
    billing_details TEXT,
    billing_amount DECIMAL(15,2),
    billing_currency VARCHAR(10) DEFAULT 'INR',
    
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  ACCOMMODATION TABLE
-- =============================================
CREATE TABLE accommodation (
    accommodation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_type VARCHAR(100) NOT NULL, -- HOTEL, GUEST_HOUSE, SERVICE_APARTMENT, etc.
    accommodation_name VARCHAR(255),
    address TEXT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room_type VARCHAR(100),
    room_number VARCHAR(50),
    
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_accommodation_dates CHECK (check_out_date >= check_in_date)
);

-- =============================================
--  TRANSPORT TABLE
-- =============================================
CREATE TABLE transport (
    transport_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_type VARCHAR(100) NOT NULL,
    number_of_vehicles INTEGER DEFAULT 1,
    driver_name VARCHAR(100),
    driver_contact VARCHAR(20),
    vehicle_number VARCHAR(50),
    arrangement_type VARCHAR(100),
    remarks TEXT,
    
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  TRAVEL DETAILS TABLE
-- =============================================
CREATE TABLE travel_details (
    travel_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    travel_mode VARCHAR(50) NOT NULL, -- FLIGHT, TRAIN, BUS, CAR, etc.
    
    -- Transportation details
    transport_number VARCHAR(100) NOT NULL, -- Flight no, Train no, Bus no, etc.
    ticket_number VARCHAR(100),
    pnr_number VARCHAR(100),
    
    -- Sector information
    sector_from VARCHAR(100) NOT NULL,
    sector_to VARCHAR(100) NOT NULL,
    
    -- Separate date and time fields for departure
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    departure_date_time TIMESTAMP WITH TIME ZONE, -- Combined field for queries
    
    -- Separate date and time fields for arrival
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    arrival_date_time TIMESTAMP WITH TIME ZONE, -- Combined field for queries
    
    -- Additional details
    seat_number VARCHAR(50),
    travel_class VARCHAR(50), -- ECONOMY, BUSINESS, FIRST, SLEEPER, AC, etc.
    travel_type VARCHAR(20) NOT NULL, -- ARRIVAL / DEPARTURE
    terminal_station VARCHAR(100), -- Terminal number or station name
    
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_travel_dates CHECK (arrival_date >= departure_date),
    CONSTRAINT chk_travel_times CHECK (
        arrival_date > departure_date OR 
        (arrival_date = departure_date AND arrival_time >= departure_time)
    )
);




-- =============================================
--  CLIENT VISITS TABLE (MODIFIED)
-- =============================================
CREATE TABLE client_visits (
    client_visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    project_id VARCHAR(150) NOT NULL REFERENCES project(project_name),
    visit_from_date DATE NOT NULL,
    visit_to_date DATE NOT NULL,

    office_branch_name VARCHAR(255) REFERENCES branch(branch_name),
    location VARCHAR(100) NOT NULL REFERENCES location(city_name),

    status VARCHAR(30) DEFAULT 'ACTIVE',  -- ACTIVE / COMPLETED / CANCELLED

    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT chk_visit_dates CHECK (visit_to_date >= visit_from_date)
);

-- =============================================
--  CLIENTS TABLE
-- =============================================
CREATE TABLE clients (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    contact_no VARCHAR(20),
    designation VARCHAR(100),

    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  ONSITE RESOURCES TABLE
-- =============================================
CREATE TABLE onsite_resources (
    onsite_resource_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    resource_name VARCHAR(100) NOT NULL,
    resource_mail VARCHAR(150) NOT NULL,
    resource_contact VARCHAR(20),
    resource_role VARCHAR(100),

    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
--  MAPPING TABLES (Many-to-Many Relationships)
-- =============================================

-- Clients to Client Visits
CREATE TABLE client_visit_clients_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    UNIQUE (client_id, client_visit_id)
);

-- Onsite Resources to Client Visits
CREATE TABLE client_visit_onsite_resources_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    onsite_resource_id UUID NOT NULL REFERENCES onsite_resources(onsite_resource_id) ON DELETE CASCADE,
    UNIQUE (client_visit_id, onsite_resource_id)
);

-- Coordinators to Client Visits
CREATE TABLE client_visit_coordinators_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    coordinator_id UUID NOT NULL REFERENCES coordinator(coordinator_id) ON DELETE CASCADE,
    UNIQUE (client_visit_id, coordinator_id)
);

-- Billing to Client Visits
CREATE TABLE client_visit_billing_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    billing_id UUID NOT NULL REFERENCES billing(billing_id) ON DELETE CASCADE,
    UNIQUE (client_visit_id, billing_id)
);

-- Accommodation to Client Visits
CREATE TABLE client_visit_accommodation_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE, -- Fixed typo here
    accommodation_id UUID NOT NULL REFERENCES accommodation(accommodation_id) ON DELETE CASCADE,
    UNIQUE (client_visit_id, accommodation_id)
);

-- Transport to Client Visits
CREATE TABLE client_visit_transport_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    transport_id UUID NOT NULL REFERENCES transport(transport_id) ON DELETE CASCADE,
    UNIQUE (client_visit_id, transport_id)
);

-- Travel Details to Client Visits
CREATE TABLE client_visit_travel_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_visit_id UUID NOT NULL REFERENCES client_visits(client_visit_id) ON DELETE CASCADE,
    travel_detail_id UUID NOT NULL REFERENCES travel_details(travel_detail_id) ON DELETE CASCADE,
    travel_purpose VARCHAR(20) NOT NULL, -- ARRIVAL / DEPARTURE
    UNIQUE (client_visit_id, travel_detail_id)
);


-- 1. Location data
INSERT INTO location (city_name, state_name, country_name) VALUES 
('Mumbai', 'Maharashtra', 'India'),
('Delhi', 'Delhi', 'India'),
('Chennai', 'Tamil Nadu', 'India'),
('Bangalore', 'Karnataka', 'India');

-- 2. Branch data
INSERT INTO branch (branch_name, location, address) VALUES 
('TCS Mumbai HQ', 'Mumbai', 'TCS House, Mumbai'),
('TCS Delhi Branch', 'Delhi', 'DLF Cyber City, Delhi'),
('TCS Bangalore Tech Park', 'Bangalore', 'Electronic City, Bangalore');

-- 3. Coordinator data
INSERT INTO coordinator (coordinator_name, employee_id, contact_no, email) VALUES 
('Rajesh Kumar', 'EMP001', '9876543210', 'rajesh.kumar@tcs.com'),
('Priya Sharma', 'EMP002', '9876543211', 'priya.sharma@tcs.com');

-- 4. Clients data (can be inserted anytime as independent entities)
INSERT INTO clients (client_name, email, contact_no, designation) VALUES 
('Amit Patel', 'amit.patel@client.com', '9876543212', 'Senior Manager'),
('Neha Singh', 'neha.singh@client.com', '9876543213', 'Project Lead');

-- 5. Onsite Resources data
INSERT INTO onsite_resources (resource_name, resource_mail, resource_contact, resource_role) VALUES 
('Sanjay Verma', 'sanjay.verma@tcs.com', '9876543214', 'Tech Lead'),
('Anjali Mehta', 'anjali.mehta@tcs.com', '9876543215', 'Developer');


-- 6. Create Client Visit (core record)
INSERT INTO client_visits (project, team, visit_from_date, visit_to_date, office_branch_name, location, swon_number) 
VALUES ('Project Alpha', 'Development Team', '2024-01-15', '2024-01-20', 'TCS Mumbai HQ', 'Mumbai', 'SWON-2024-001');

-- 7. Travel Details (Arrival and Departure)
INSERT INTO travel_details (travel_mode, transport_number, ticket_number, sector_from, sector_to, departure_date, departure_time, arrival_date, arrival_time, travel_class, travel_type) 
VALUES 
('FLIGHT', 'AI-101', 'TK123456', 'DEL', 'BOM', '2024-01-15', '08:00:00', '2024-01-15', '10:30:00', 'ECONOMY', 'ARRIVAL'),
('FLIGHT', 'AI-102', 'TK123457', 'BOM', 'DEL', '2024-01-20', '18:00:00', '2024-01-20', '20:30:00', 'ECONOMY', 'DEPARTURE');

-- 8. Accommodation
INSERT INTO accommodation (accommodation_type, accommodation_name, check_in_date, check_out_date, room_type, room_number) 
VALUES ('HOTEL', 'Grand Hotel', '2024-01-15', '2024-01-20', 'DELUXE', '501');

-- 9. Transport
INSERT INTO transport (vehicle_type, number_of_vehicles, driver_name, driver_contact, vehicle_number) 
VALUES ('7 Seater', 1, 'Ramesh Kumar', '9876543216', 'MH01-AB-1234');

-- 10. Billing
INSERT INTO billing (billing_type, billing_ownership, billing_amount, billing_currency) 
VALUES ('CLIENT_BILLING', 'Project Alpha Account', 50000.00, 'INR');


-- 11. Map all entities to the client visit
-- Get the IDs from previous inserts (you'll need to store these in your application)
INSERT INTO client_visit_clients_map (client_visit_id, client_id) VALUES 
('client_visit_uuid', 'client_uuid_1'),
('client_visit_uuid', 'client_uuid_2');

INSERT INTO client_visit_coordinators_map (client_visit_id, coordinator_id) VALUES 
('client_visit_uuid', 'coordinator_uuid');

INSERT INTO client_visit_travel_map (client_visit_id, travel_detail_id, travel_purpose) VALUES 
('client_visit_uuid', 'arrival_travel_uuid', 'ARRIVAL'),
('client_visit_uuid', 'departure_travel_uuid', 'DEPARTURE');

INSERT INTO client_visit_accommodation_map (client_visit_id, accommodation_id) VALUES 
('client_visit_uuid', 'accommodation_uuid');

INSERT INTO client_visit_transport_map (client_visit_id, transport_id) VALUES 
('client_visit_uuid', 'transport_uuid');

INSERT INTO client_visit_billing_map (client_visit_id, billing_id) VALUES 
('client_visit_uuid', 'billing_uuid');

INSERT INTO client_visit_onsite_resources_map (client_visit_id, onsite_resource_id) VALUES 
('client_visit_uuid', 'onsite_resource_uuid_1'),
('client_visit_uuid', 'onsite_resource_uuid_2');