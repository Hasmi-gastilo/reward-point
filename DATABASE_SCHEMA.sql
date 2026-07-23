-- ============================================
-- REWARD POINT - DATABASE SCHEMA
-- PostgreSQL Database untuk Supabase
-- ============================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: admins
-- ============================================
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: members
-- ============================================
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_number VARCHAR(50) UNIQUE NOT NULL,
    photo TEXT,
    fullname VARCHAR(255) NOT NULL,
    total_point INTEGER DEFAULT 0 CHECK (total_point >= 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: rewards
-- ============================================
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    point_required INTEGER NOT NULL CHECK (point_required > 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: point_history
-- ============================================
CREATE TABLE point_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('plus', 'minus')),
    point INTEGER NOT NULL CHECK (point > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: redeem_history
-- ============================================
CREATE TABLE redeem_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
    point_used INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: banners
-- ============================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    image TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: settings
-- ============================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_name VARCHAR(255) DEFAULT 'Reward Point',
    logo TEXT,
    primary_color VARCHAR(7) DEFAULT '#2563EB',
    secondary_color VARCHAR(7) DEFAULT '#F59E0B',
    footer_text TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES untuk Performance
-- ============================================
CREATE INDEX idx_members_member_number ON members(member_number);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_rewards_category ON rewards(category_id);
CREATE INDEX idx_rewards_status ON rewards(status);
CREATE INDEX idx_point_history_member ON point_history(member_id);
CREATE INDEX idx_redeem_history_member ON redeem_history(member_id);
CREATE INDEX idx_redeem_history_reward ON redeem_history(reward_id);

-- ============================================
-- FUNCTION: Generate Member Number
-- ============================================
CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    new_member_number VARCHAR(50);
BEGIN
    -- Get the next number
    SELECT COALESCE(MAX(CAST(SUBSTRING(member_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_number
    FROM members;
    
    -- Generate member number with format: MBR0001
    new_member_number := 'MBR' || LPAD(next_number::TEXT, 4, '0');
    
    NEW.member_number := new_member_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto Generate Member Number
-- ============================================
CREATE TRIGGER trigger_generate_member_number
BEFORE INSERT ON members
FOR EACH ROW
WHEN (NEW.member_number IS NULL OR NEW.member_number = '')
EXECUTE FUNCTION generate_member_number();

-- ============================================
-- FUNCTION: Update Member Total Points
-- ============================================
CREATE OR REPLACE FUNCTION update_member_points()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'plus' THEN
        UPDATE members
        SET total_point = total_point + NEW.point
        WHERE id = NEW.member_id;
    ELSIF NEW.type = 'minus' THEN
        UPDATE members
        SET total_point = GREATEST(total_point - NEW.point, 0)
        WHERE id = NEW.member_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER: Auto Update Member Points
-- ============================================
CREATE TRIGGER trigger_update_member_points
AFTER INSERT ON point_history
FOR EACH ROW
EXECUTE FUNCTION update_member_points();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeem_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read members, rewards, categories, banners, settings
CREATE POLICY "Public read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public read rewards" ON rewards FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (status = 'active');
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

-- Policy: Only authenticated users (admin) can modify
CREATE POLICY "Admin full access members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access rewards" ON rewards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access point_history" ON point_history FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access redeem_history" ON redeem_history FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- INITIAL DATA
-- ============================================
-- Insert default settings
INSERT INTO settings (website_name, footer_text, contact_email, contact_phone, contact_address)
VALUES (
    'Reward Point',
    'Platform reward point yang memudahkan Anda menukarkan bintang dengan hadiah menarik.',
    'info@rewardpoint.com',
    '+62 812-3456-7890',
    'Jakarta, Indonesia'
);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
('Elektronik', 'fa-laptop'),
('Fashion', 'fa-tshirt'),
('Makanan & Minuman', 'fa-utensils'),
('Voucher', 'fa-ticket-alt'),
('Alat Tulis', 'fa-pen'),
('Olahraga', 'fa-basketball-ball');

-- Note: Admin account harus dibuat melalui Supabase Auth Dashboard
-- atau menggunakan API signup dengan role admin
