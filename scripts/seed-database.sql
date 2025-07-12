-- Create sample organizations
INSERT INTO "Organization" (id, name, "createdAt") VALUES
('org1', 'Acme Corporation', NOW()),
('org2', 'TechStart Inc', NOW());

-- Create sample stages for each organization
INSERT INTO "Stage" (id, name, position, "organizationId", "createdAt", "updatedAt") VALUES
('stage1', 'New Lead', 1, 'org1', NOW(), NOW()),
('stage2', 'Qualified', 2, 'org1', NOW(), NOW()),
('stage3', 'Proposal', 3, 'org1', NOW(), NOW()),
('stage4', 'Negotiation', 4, 'org1', NOW(), NOW()),
('stage5', 'Closed Won', 5, 'org1', NOW(), NOW()),
('stage6', 'Closed Lost', 6, 'org1', NOW(), NOW()),
('stage7', 'Prospect', 1, 'org2', NOW(), NOW()),
('stage8', 'Demo', 2, 'org2', NOW(), NOW()),
('stage9', 'Trial', 3, 'org2', NOW(), NOW()),
('stage10', 'Contract', 4, 'org2', NOW(), NOW()),
('stage11', 'Customer', 5, 'org2', NOW(), NOW());

-- Note: You'll need to manually link your Clerk user ID to organizations
-- Replace 'your-clerk-user-id' with your actual Clerk user ID
-- INSERT INTO "User" (id, email, name, role) VALUES
-- ('your-clerk-user-id', 'your-email@example.com', 'Your Name', 'ADMIN');

-- INSERT INTO "UserOrganization" (id, "userId", "organizationId") VALUES
-- ('uo1', 'your-clerk-user-id', 'org1'),
-- ('uo2', 'your-clerk-user-id', 'org2');

-- Sample leads
INSERT INTO "Lead" (id, name, email, phone, source, status, "stageId", "organizationId", "dateAdded", "createdAt", "updatedAt") VALUES
('lead1', 'John Smith', 'john@example.com', '+1-555-0101', 'ORGANIC', 'ACTIVE', 'stage1', 'org1', NOW(), NOW(), NOW()),
('lead2', 'Sarah Johnson', 'sarah@example.com', '+1-555-0102', 'PAID', 'ACTIVE', 'stage2', 'org1', NOW(), NOW(), NOW()),
('lead3', 'Mike Davis', 'mike@example.com', '+1-555-0103', 'REFERRAL', 'ACTIVE', 'stage3', 'org1', NOW(), NOW(), NOW()),
('lead4', 'Emily Brown', 'emily@example.com', '+1-555-0104', 'ORGANIC', 'COMPLETED', 'stage5', 'org1', NOW(), NOW(), NOW()),
('lead5', 'David Wilson', 'david@example.com', '+1-555-0105', 'PAID', 'INACTIVE', 'stage6', 'org1', NOW(), NOW(), NOW());
