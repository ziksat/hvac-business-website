-- HVAC Business Website Seed Data
-- For initial setup and testing

-- Insert default admin user (password: Admin123!)
-- Password hash is for 'Admin123!' using bcrypt with 12 rounds
INSERT INTO Users (email, password, firstName, lastName, role, isActive)
VALUES ('admin@hvacbusiness.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4/OL.3xYFfmBPq7i', 'Admin', 'User', 'admin', 1);

-- Insert sample services
INSERT INTO Services (name, description, shortDescription, price, duration, icon, isActive, sortOrder, features) VALUES
('AC Repair', 'Professional air conditioning repair services for all makes and models. Our certified technicians diagnose and fix issues quickly to restore your comfort.', 'Fast and reliable AC repair for all brands', 150.00, 90, 'build', 1, 1, '["Same-day service available","All brands serviced","90-day warranty on repairs","Free diagnostic with repair"]'),
('Heating Repair', 'Expert furnace and heating system repair. We service gas, electric, and oil heating systems to keep your home warm all winter.', 'Complete heating system repair services', 150.00, 90, 'whatshot', 1, 2, '["Gas, electric, and oil systems","Emergency service available","Safety inspections included","Parts warranty included"]'),
('AC Installation', 'Complete air conditioning installation services. We help you choose the right system for your home and install it professionally.', 'Professional AC installation and replacement', 3500.00, 480, 'ac_unit', 1, 3, '["Free in-home estimate","Energy-efficient options","Financing available","10-year parts warranty"]'),
('Furnace Installation', 'Professional furnace installation and replacement. Energy-efficient options available with financing.', 'Expert furnace installation services', 3000.00, 480, 'local_fire_department', 1, 4, '["High-efficiency models","Rebate assistance","Professional installation","Extended warranties available"]'),
('HVAC Maintenance', 'Regular maintenance to keep your HVAC system running efficiently. Includes inspection, cleaning, and tune-up.', 'Preventive maintenance for optimal performance', 99.00, 60, 'settings', 1, 5, '["21-point inspection","Filter replacement","Coil cleaning","Priority scheduling"]'),
('Duct Cleaning', 'Professional air duct cleaning to improve indoor air quality and system efficiency.', 'Thorough duct cleaning for cleaner air', 299.00, 180, 'air', 1, 6, '["Complete system cleaning","Sanitization available","Improves air quality","Increases efficiency"]'),
('Heat Pump Services', 'Installation, repair, and maintenance of heat pump systems for year-round comfort.', 'Heat pump installation and repair', 200.00, 120, 'swap_vert', 1, 7, '["Heating and cooling solution","Energy efficient","Year-round comfort","Expert installation"]'),
('Emergency Services', '24/7 emergency HVAC repair services. We are here when you need us most.', '24/7 emergency repair services', 250.00, 120, 'warning', 1, 8, '["Available 24/7","Fast response time","All major repairs","No extra weekend charge"]');

-- Insert sample testimonials
INSERT INTO Testimonials (customerName, content, rating, serviceType, isApproved) VALUES
('John Smith', 'Excellent service! The technician was professional, knowledgeable, and fixed our AC quickly. Highly recommend!', 5, 'AC Repair', 1),
('Sarah Johnson', 'Very impressed with the installation team. They were clean, efficient, and explained everything clearly. Our new furnace works great!', 5, 'Furnace Installation', 1),
('Mike Williams', 'Called for emergency service on a Sunday and they came within an hour. Fixed the problem and charged a fair price. Will definitely use again.', 5, 'Emergency Services', 1),
('Emily Davis', 'Best HVAC company I have ever used. They provide excellent preventive maintenance that keeps our system running perfectly.', 5, 'HVAC Maintenance', 1),
('Robert Brown', 'Professional, punctual, and fair pricing. The technician took time to explain the issue and gave us options. Great experience!', 4, 'Heating Repair', 1);

-- Insert default settings
INSERT INTO Settings ([key], value) VALUES
('companyName', 'Your HVAC Company'),
('companyPhone', '(555) 123-4567'),
('companyEmail', 'info@yourhvaccompany.com'),
('companyAddress', '123 Main Street'),
('companyCity', 'Your City'),
('companyState', 'ST'),
('companyZip', '12345'),
('businessHours', '{"monday": "8:00 AM - 6:00 PM", "tuesday": "8:00 AM - 6:00 PM", "wednesday": "8:00 AM - 6:00 PM", "thursday": "8:00 AM - 6:00 PM", "friday": "8:00 AM - 6:00 PM", "saturday": "9:00 AM - 2:00 PM", "sunday": "Closed"}'),
('emergencyPhone', '(555) 123-4567'),
('serviceAreas', 'We proudly serve Your City and surrounding areas including: Nearby Town 1, Nearby Town 2, Nearby Town 3'),
('licenseNumber', 'HVAC-12345'),
('insuranceInfo', 'Fully licensed, bonded, and insured'),
('facebookUrl', 'https://facebook.com/yourhvaccompany'),
('googleMapsUrl', 'https://maps.google.com'),
('metaDescription', 'Professional HVAC services including AC repair, heating installation, and 24/7 emergency services. Serving Your City and surrounding areas.');

-- Insert default page content
INSERT INTO PageContent (pageId, title, metaTitle, metaDescription, sections) VALUES
('home', 'Welcome to Your HVAC Company', 'Your HVAC Company - Professional Heating & Cooling Services', 'Expert HVAC services including AC repair, heating installation, and maintenance. Serving Your City with 24/7 emergency services.', '{"hero":{"title":"Your Comfort Is Our Priority","subtitle":"Professional HVAC services you can trust","ctaText":"Schedule Service","ctaLink":"/book-service"},"features":[{"title":"24/7 Emergency Service","description":"We are available around the clock for your HVAC emergencies"},{"title":"Licensed & Insured","description":"Fully licensed, bonded, and insured for your peace of mind"},{"title":"Satisfaction Guaranteed","description":"We stand behind our work with a 100% satisfaction guarantee"}]}'),
('about', 'About Us', 'About Your HVAC Company - Our Story & Values', 'Learn about Your HVAC Company history, our experienced team, and our commitment to quality HVAC services.', '{"intro":"With over 20 years of experience, we have been providing top-quality HVAC services to our community.","mission":"Our mission is to provide reliable, efficient, and affordable heating and cooling solutions while delivering exceptional customer service.","values":["Integrity in every interaction","Quality workmanship","Customer satisfaction","Continuous improvement"]}'),
('services', 'Our Services', 'HVAC Services - AC Repair, Heating, Installation & Maintenance', 'Complete HVAC services including AC repair, furnace installation, heat pump services, duct cleaning, and 24/7 emergency repairs.', '{"intro":"We offer a full range of HVAC services to keep your home comfortable year-round."}'),
('contact', 'Contact Us', 'Contact Your HVAC Company - Get in Touch', 'Contact us for all your HVAC needs. Call for emergency service or fill out our form for a free estimate.', '{"intro":"We are here to help with all your heating and cooling needs. Reach out to us today!"}');

-- Insert sample blog posts
INSERT INTO BlogPosts (title, slug, content, excerpt, isPublished, publishDate, tags, authorId) VALUES
('5 Signs Your AC Needs Repair', 'signs-ac-needs-repair', '<p>Is your air conditioner showing signs of trouble? Here are five warning signs that indicate your AC may need professional repair:</p><h2>1. Weak Airflow</h2><p>If you notice weak or reduced airflow from your vents, it could indicate a problem with your compressor or ductwork.</p><h2>2. Warm Air</h2><p>When your AC is blowing warm air instead of cool, check your thermostat settings first. If it is set correctly, you may have a compressor issue or refrigerant leak.</p><h2>3. Strange Noises</h2><p>Unusual sounds like grinding, squealing, or banging often indicate mechanical problems that need immediate attention.</p><h2>4. High Humidity</h2><p>Your AC should moderate humidity levels. If your home feels sticky, your system may need repair.</p><h2>5. Frequent Cycling</h2><p>If your AC turns on and off more frequently than usual, it may be struggling to maintain temperature.</p><p>Do not wait until your AC breaks down completely. Contact us for a professional inspection!</p>', 'Learn the warning signs that your air conditioner needs professional repair before it breaks down completely.', 1, GETDATE(), '["AC Repair","Tips","Maintenance"]', 1),
('Prepare Your HVAC for Winter', 'prepare-hvac-winter', '<p>As temperatures drop, it is important to prepare your heating system for the winter months ahead. Here is your essential winter HVAC checklist:</p><h2>Schedule a Professional Tune-Up</h2><p>Have a professional inspect and service your furnace before the heating season begins.</p><h2>Replace Your Air Filter</h2><p>A clean filter improves efficiency and air quality. Replace it monthly during heavy use.</p><h2>Check Your Thermostat</h2><p>Consider upgrading to a programmable or smart thermostat to save energy.</p><h2>Inspect Your Ductwork</h2><p>Look for leaks, gaps, or damage that could reduce efficiency.</p><h2>Clear Around Outdoor Units</h2><p>Remove debris, leaves, and vegetation from around your heat pump or outdoor unit.</p><p>Schedule your winter tune-up today to ensure a warm, comfortable home all season!</p>', 'Get your heating system ready for winter with this essential preparation checklist.', 1, GETDATE(), '["Heating","Winter","Maintenance","Tips"]', 1),
('Benefits of Regular HVAC Maintenance', 'benefits-regular-hvac-maintenance', '<p>Regular HVAC maintenance is one of the best investments you can make for your home comfort system. Here is why:</p><h2>Lower Energy Bills</h2><p>A well-maintained system operates more efficiently, reducing your monthly energy costs by up to 30%.</p><h2>Fewer Repairs</h2><p>Regular inspections catch small problems before they become expensive repairs.</p><h2>Longer System Life</h2><p>Proper maintenance can extend your HVAC systems lifespan by several years.</p><h2>Better Air Quality</h2><p>Clean filters and coils mean cleaner air circulating through your home.</p><h2>Warranty Protection</h2><p>Many manufacturers require regular maintenance to keep warranties valid.</p><p>Sign up for our maintenance plan and enjoy year-round comfort with peace of mind!</p>', 'Discover how regular HVAC maintenance saves money and extends the life of your system.', 1, GETDATE(), '["Maintenance","Energy Savings","Tips"]', 1);

-- Insert sample customers
INSERT INTO Customers (firstName, lastName, email, phone, address, city, state, zipCode, notes) VALUES
('John', 'Smith', 'john.smith@email.com', '(555) 111-2222', '456 Oak Street', 'Your City', 'ST', '12345', 'Prefers morning appointments'),
('Sarah', 'Johnson', 'sarah.j@email.com', '(555) 222-3333', '789 Maple Avenue', 'Your City', 'ST', '12345', 'Has two AC units'),
('Mike', 'Williams', 'mike.w@email.com', '(555) 333-4444', '321 Pine Road', 'Nearby Town', 'ST', '12346', 'Commercial customer');

-- Insert sample equipment
INSERT INTO Equipment (customerId, type, brand, model, serialNumber, installationDate, warrantyExpiry, maintenanceDue, notes) VALUES
(1, 'Central AC', 'Carrier', '24ACC636A003', 'CAR-2020-12345', '2020-06-15', '2025-06-15', DATEADD(month, -1, GETDATE()), 'Installed by our team'),
(1, 'Gas Furnace', 'Lennox', 'SL280UHV', 'LEN-2020-67890', '2020-06-15', '2025-06-15', DATEADD(month, -1, GETDATE()), 'High-efficiency model'),
(2, 'Central AC', 'Trane', 'XR15', 'TRN-2019-11111', '2019-05-20', '2024-05-20', DATEADD(month, 1, GETDATE()), 'Unit 1 - Main floor'),
(2, 'Central AC', 'Trane', 'XR15', 'TRN-2019-22222', '2019-05-20', '2024-05-20', DATEADD(month, 1, GETDATE()), 'Unit 2 - Second floor'),
(3, 'Commercial HVAC', 'York', 'YC2D', 'YRK-2021-33333', '2021-03-10', '2026-03-10', DATEADD(month, 2, GETDATE()), 'Rooftop unit - commercial building');

-- Insert sample service history
INSERT INTO ServiceHistory (customerId, serviceId, serviceDate, technician, notes, cost) VALUES
(1, 5, DATEADD(month, -6, GETDATE()), 'Tech John', 'Annual maintenance completed. System running well.', 99.00),
(1, 1, DATEADD(month, -3, GETDATE()), 'Tech Mike', 'Replaced capacitor. AC now cooling properly.', 185.00),
(2, 5, DATEADD(month, -4, GETDATE()), 'Tech John', 'Serviced both units. Replaced filters.', 149.00),
(3, 5, DATEADD(month, -2, GETDATE()), 'Tech Sarah', 'Commercial maintenance completed.', 199.00);
