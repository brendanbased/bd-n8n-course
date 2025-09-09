-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    avatar TEXT,
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    order_number INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    order_number INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements JSONB NOT NULL DEFAULT '[]',
    video_url TEXT,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure only one of lesson_id or project_id is set
    CONSTRAINT check_progress_type CHECK (
        (lesson_id IS NOT NULL AND project_id IS NULL) OR
        (lesson_id IS NULL AND project_id IS NOT NULL)
    ),
    
    -- Unique constraint to prevent duplicate progress entries
    UNIQUE(user_id, lesson_id),
    UNIQUE(user_id, project_id)
);

-- Discord roles table for role management
CREATE TABLE discord_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    discord_role_id VARCHAR(255) UNIQUE NOT NULL,
    module_completion_required INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements/badges table
CREATE TABLE user_achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL, -- 'module_complete', 'lesson_complete', 'project_complete', 'streak', etc.
    achievement_data JSONB NOT NULL DEFAULT '{}',
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_type, achievement_data)
);

-- Insert initial course data
INSERT INTO modules (id, title, description, order_number) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'N8n Fundamentals', 'Learn the basics of N8n automation platform, interface navigation, and core concepts.', 1),
('550e8400-e29b-41d4-a716-446655440002', 'Working with Triggers', 'Master different types of triggers and how to use them effectively in your workflows.', 2),
('550e8400-e29b-41d4-a716-446655440003', 'Data Transformation', 'Learn how to manipulate, transform, and process data within your N8n workflows.', 3),
('550e8400-e29b-41d4-a716-446655440004', 'API Integration', 'Connect N8n with external services and APIs to create powerful integrations.', 4),
('550e8400-e29b-41d4-a716-446655440005', 'Advanced Workflows', 'Build complex workflows with conditional logic, loops, and advanced patterns.', 5),
('550e8400-e29b-41d4-a716-446655440006', 'Production and Best Practices', 'Deploy, monitor, and maintain N8n workflows in production environments.', 6);

-- Insert lessons for Module 1
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Introduction to N8n', 'Understanding what N8n is and its role in automation', 1),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'N8n Interface Overview', 'Navigating the N8n interface and understanding the workflow editor', 2),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Basic Workflow Concepts', 'Understanding nodes, connections, and data flow in N8n', 3);

-- Insert lessons for Module 2
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Manual vs Automatic Triggers', 'Understanding the difference between manual and automatic triggers', 1),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Webhook Triggers', 'Setting up and using webhook triggers for real-time automation', 2),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Schedule and Polling Triggers', 'Using cron schedules and polling triggers for time-based automation', 3);

-- Insert lessons for Module 3
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Understanding Data Structure', 'How N8n handles data and the JSON format', 1),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Using the Set Node', 'Transforming and restructuring data with the Set node', 2),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Function and Code Nodes', 'Writing custom JavaScript for complex data transformations', 3);

-- Insert lessons for Module 4
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'HTTP Request Node', 'Making API calls and handling responses', 1),
('650e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', 'Authentication Methods', 'Implementing various authentication methods for APIs', 2),
('650e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Error Handling and Retries', 'Building robust workflows with proper error handling', 3);

-- Insert lessons for Module 5
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440005', 'Conditional Logic and Branching', 'Using IF nodes and Switch nodes for workflow control', 1),
('650e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', 'Loops and Iterations', 'Processing arrays and implementing loops in workflows', 2),
('650e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', 'Sub-workflows and Modularity', 'Creating reusable workflow components', 3);

-- Insert lessons for Module 6
INSERT INTO lessons (id, module_id, title, description, order_number) VALUES
('650e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440006', 'Deployment Strategies', 'Different ways to deploy N8n in production', 1),
('650e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440006', 'Monitoring and Logging', 'Setting up monitoring and logging for production workflows', 2),
('650e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440006', 'Security and Best Practices', 'Security considerations and workflow optimization', 3);

-- Insert projects for each module
INSERT INTO projects (id, module_id, title, description, requirements) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Your First Automation', 'Create a simple workflow that demonstrates basic N8n concepts', 
 '["Create a workflow with at least 3 nodes", "Use a trigger node to start the workflow", "Process data through at least one transformation", "Output the result to a destination node"]'),

('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Multi-Trigger Workflow', 'Build a workflow that uses multiple trigger types',
 '["Implement at least 2 different trigger types", "Create conditional logic based on trigger source", "Handle different data formats from various triggers", "Set up proper error handling for each trigger type"]'),

('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Data Processing Pipeline', 'Create a comprehensive data transformation workflow',
 '["Process raw data from an external source", "Clean and validate the data", "Transform data into multiple output formats", "Implement error handling for invalid data", "Use both Set nodes and Function nodes"]'),

('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Multi-Service Integration', 'Build a workflow that integrates multiple external services',
 '["Connect to at least 3 different APIs", "Implement proper authentication for each service", "Handle rate limiting and API errors gracefully", "Create a data synchronization workflow", "Add monitoring and alerting for failures"]'),

('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Complex Business Process Automation', 'Automate a complex business process with multiple decision points',
 '["Implement complex conditional logic", "Use loops to process multiple items", "Create modular sub-workflows", "Handle multiple data sources and destinations", "Implement comprehensive logging and monitoring"]'),

('750e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 'Production-Ready Automation System', 'Deploy a complete automation system with monitoring and security',
 '["Deploy N8n in a production environment", "Implement comprehensive monitoring and alerting", "Set up proper security measures and access controls", "Create documentation and runbooks", "Implement backup and disaster recovery procedures"]');

-- Insert Discord roles for progression
INSERT INTO discord_roles (name, discord_role_id, module_completion_required) VALUES
('N8n Beginner', 'DISCORD_ROLE_ID_1', 1),
('N8n Intermediate', 'DISCORD_ROLE_ID_2', 3),
('N8n Advanced', 'DISCORD_ROLE_ID_3', 5),
('N8n Expert', 'DISCORD_ROLE_ID_4', 6);

-- Create indexes for better performance
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_projects_module_id ON projects(module_id);
CREATE INDEX idx_users_discord_id ON users(discord_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
