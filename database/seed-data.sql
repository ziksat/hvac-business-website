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

-- =====================================================
-- HVAC Parts & Supplies Inventory
-- =====================================================

-- Air Filters
INSERT INTO Inventory (sku, name, description, category, brand, unitCost, sellingPrice, quantityOnHand, reorderPoint, reorderQuantity, location, supplier, isActive) VALUES
('FLT-16251-MERV8', '16x25x1 MERV 8 Air Filter', 'Standard pleated air filter for residential HVAC systems. MERV 8 rating captures dust, pollen, and pet dander.', 'Air Filters', 'FilterBuy', 4.50, 12.99, 100, 25, 50, 'Aisle A-1', 'HVAC Supply Co', 1),
('FLT-16251-MERV11', '16x25x1 MERV 11 Air Filter', 'High-efficiency pleated filter. Captures finer particles including mold spores and dust mite debris.', 'Air Filters', 'FilterBuy', 6.00, 16.99, 75, 20, 40, 'Aisle A-1', 'HVAC Supply Co', 1),
('FLT-16251-MERV13', '16x25x1 MERV 13 Air Filter', 'Hospital-grade filtration. Captures bacteria, smoke, and virus carriers.', 'Air Filters', 'FilterBuy', 9.00, 24.99, 50, 15, 30, 'Aisle A-1', 'HVAC Supply Co', 1),
('FLT-20201-MERV8', '20x20x1 MERV 8 Air Filter', 'Standard pleated filter for 20x20 returns. Ideal for residential use.', 'Air Filters', 'Honeywell', 5.00, 14.99, 80, 20, 40, 'Aisle A-2', 'HVAC Supply Co', 1),
('FLT-20251-MERV8', '20x25x1 MERV 8 Air Filter', 'Common size pleated filter for larger HVAC systems.', 'Air Filters', 'Honeywell', 5.50, 15.99, 90, 25, 50, 'Aisle A-2', 'HVAC Supply Co', 1),
('FLT-20254-MERV11', '20x25x4 MERV 11 Deep Pleat Filter', 'Extended life deep pleat filter. Lasts up to 6 months.', 'Air Filters', 'Lennox', 22.00, 54.99, 30, 10, 20, 'Aisle A-3', 'HVAC Supply Co', 1),
('FLT-16254-MERV16', '16x25x4 MERV 16 Hospital Grade Filter', 'Maximum filtration for allergy and asthma sufferers.', 'Air Filters', 'Carrier', 35.00, 89.99, 20, 5, 15, 'Aisle A-3', 'HVAC Supply Co', 1),

-- Capacitors
('CAP-35-440', '35/5 MFD 440V Dual Run Capacitor', 'Dual run capacitor for AC compressor and fan motor. Universal replacement.', 'Capacitors', 'Titan Pro', 8.50, 24.99, 40, 10, 20, 'Aisle B-1', 'GEMCO Supply', 1),
('CAP-45-440', '45/5 MFD 440V Dual Run Capacitor', 'Common replacement capacitor for 2-3 ton AC units.', 'Capacitors', 'Titan Pro', 9.00, 27.99, 35, 10, 20, 'Aisle B-1', 'GEMCO Supply', 1),
('CAP-55-440', '55/5 MFD 440V Dual Run Capacitor', 'Heavy-duty capacitor for larger compressors.', 'Capacitors', 'Titan Pro', 11.00, 32.99, 25, 8, 15, 'Aisle B-1', 'GEMCO Supply', 1),
('CAP-60-440', '60/5 MFD 440V Dual Run Capacitor', 'For 4-5 ton residential and light commercial units.', 'Capacitors', 'Titan Pro', 12.50, 36.99, 20, 5, 10, 'Aisle B-1', 'GEMCO Supply', 1),
('CAP-START-88108', '88-108 MFD Start Capacitor', 'Motor start capacitor for compressor startup.', 'Capacitors', 'Supco', 7.00, 19.99, 30, 8, 15, 'Aisle B-2', 'GEMCO Supply', 1),
('CAP-START-145175', '145-175 MFD Start Capacitor', 'High-torque start capacitor for larger motors.', 'Capacitors', 'Supco', 9.50, 26.99, 25, 5, 10, 'Aisle B-2', 'GEMCO Supply', 1),

-- Contactors & Relays
('CON-1P-30A', '1-Pole 30 Amp Contactor 24V Coil', 'Single pole contactor for AC units. Universal replacement.', 'Contactors & Relays', 'Packard', 12.00, 34.99, 25, 8, 15, 'Aisle B-3', 'GEMCO Supply', 1),
('CON-2P-40A', '2-Pole 40 Amp Contactor 24V Coil', 'Standard AC contactor for residential systems.', 'Contactors & Relays', 'Packard', 15.00, 42.99, 30, 10, 20, 'Aisle B-3', 'GEMCO Supply', 1),
('RLY-SPST-24V', 'SPST Relay 24V Coil', 'Single pole single throw relay for HVAC controls.', 'Contactors & Relays', 'White-Rodgers', 8.00, 22.99, 20, 5, 10, 'Aisle B-3', 'GEMCO Supply', 1),
('RLY-DPDT-24V', 'DPDT Relay 24V Coil', 'Double pole double throw relay. Ice maker, heat pump applications.', 'Contactors & Relays', 'White-Rodgers', 12.00, 32.99, 15, 5, 10, 'Aisle B-3', 'GEMCO Supply', 1),
('RLY-TIME-DELAY', 'Time Delay Relay 1-180 Seconds', 'Adjustable time delay relay for compressor protection.', 'Contactors & Relays', 'ICM Controls', 18.00, 49.99, 12, 4, 8, 'Aisle B-4', 'GEMCO Supply', 1),

-- Motors & Blowers
('MTR-COND-1/4', '1/4 HP Condenser Fan Motor', 'Universal condenser fan motor. 1075 RPM, 208-230V.', 'Motors & Blowers', 'US Motors', 65.00, 149.99, 15, 5, 10, 'Aisle C-1', 'Motors Plus', 1),
('MTR-COND-1/3', '1/3 HP Condenser Fan Motor', 'Standard replacement condenser motor for 2-3 ton units.', 'Motors & Blowers', 'US Motors', 75.00, 169.99, 12, 4, 8, 'Aisle C-1', 'Motors Plus', 1),
('MTR-COND-1/2', '1/2 HP Condenser Fan Motor', 'Heavy-duty condenser motor for larger systems.', 'Motors & Blowers', 'US Motors', 95.00, 199.99, 10, 3, 6, 'Aisle C-1', 'Motors Plus', 1),
('MTR-BLOWER-1/2', '1/2 HP Direct Drive Blower Motor', 'Indoor blower motor. 4-speed, 115V.', 'Motors & Blowers', 'Fasco', 85.00, 189.99, 10, 3, 6, 'Aisle C-2', 'Motors Plus', 1),
('MTR-BLOWER-3/4', '3/4 HP Direct Drive Blower Motor', 'Variable speed indoor blower motor.', 'Motors & Blowers', 'Fasco', 120.00, 259.99, 8, 3, 5, 'Aisle C-2', 'Motors Plus', 1),
('MTR-ECM-1HP', '1 HP ECM Blower Motor', 'High-efficiency ECM motor. Programmable, variable speed.', 'Motors & Blowers', 'Genteq', 280.00, 549.99, 5, 2, 4, 'Aisle C-3', 'Motors Plus', 1),
('MTR-DRAFT-IND', 'Draft Inducer Motor Assembly', 'Replacement inducer motor for furnaces. Universal kit.', 'Motors & Blowers', 'Fasco', 145.00, 299.99, 6, 2, 4, 'Aisle C-3', 'Motors Plus', 1),

-- Thermostats
('TSTAT-BASIC', 'Basic Non-Programmable Thermostat', 'Simple heat/cool thermostat. Battery or hardwired.', 'Thermostats', 'Honeywell', 18.00, 44.99, 25, 8, 15, 'Aisle D-1', 'HVAC Supply Co', 1),
('TSTAT-PROG-5-2', '5-2 Day Programmable Thermostat', 'Weekday/weekend programming. Easy to use interface.', 'Thermostats', 'Honeywell', 35.00, 79.99, 20, 6, 12, 'Aisle D-1', 'HVAC Supply Co', 1),
('TSTAT-PROG-7DAY', '7-Day Programmable Thermostat', 'Full week programming with touchscreen display.', 'Thermostats', 'Honeywell', 55.00, 119.99, 15, 5, 10, 'Aisle D-1', 'HVAC Supply Co', 1),
('TSTAT-WIFI-BASIC', 'WiFi Smart Thermostat', 'Basic WiFi thermostat with app control. Works with Alexa.', 'Thermostats', 'Emerson', 85.00, 179.99, 12, 4, 8, 'Aisle D-2', 'HVAC Supply Co', 1),
('TSTAT-NEST-E', 'Nest Thermostat E', 'Smart learning thermostat. Energy saving features.', 'Thermostats', 'Google Nest', 120.00, 249.99, 8, 3, 6, 'Aisle D-2', 'HVAC Supply Co', 1),
('TSTAT-ECOBEE-LITE', 'ecobee Lite Smart Thermostat', 'Smart thermostat with room sensors. HomeKit compatible.', 'Thermostats', 'ecobee', 135.00, 279.99, 8, 3, 6, 'Aisle D-2', 'HVAC Supply Co', 1),

-- Refrigerant & Chemicals
('REF-R410A-25', 'R-410A Refrigerant 25 lb Cylinder', 'Factory sealed R-410A refrigerant. For modern AC systems.', 'Refrigerants & Chemicals', 'Chemours', 175.00, 349.99, 20, 5, 10, 'Aisle E-1', 'Refrigerant Depot', 1),
('REF-R22-30', 'R-22 Refrigerant 30 lb Cylinder', 'R-22 Freon for legacy systems. EPA certified handlers only.', 'Refrigerants & Chemicals', 'Chemours', 450.00, 899.99, 10, 3, 5, 'Aisle E-1', 'Refrigerant Depot', 1),
('REF-R134A-30', 'R-134a Refrigerant 30 lb Cylinder', 'Automotive and some HVAC applications.', 'Refrigerants & Chemicals', 'DuPont', 95.00, 189.99, 15, 4, 8, 'Aisle E-1', 'Refrigerant Depot', 1),
('OIL-PAG-QT', 'PAG Compressor Oil 1 Quart', 'Universal PAG oil for AC compressors.', 'Refrigerants & Chemicals', 'Nu-Calgon', 12.00, 29.99, 25, 8, 15, 'Aisle E-2', 'HVAC Supply Co', 1),
('COIL-CLEANER-GAL', 'Evaporator Coil Cleaner 1 Gallon', 'No-rinse foaming coil cleaner. Biodegradable.', 'Refrigerants & Chemicals', 'Nu-Calgon', 18.00, 42.99, 30, 10, 20, 'Aisle E-2', 'HVAC Supply Co', 1),
('COND-CLEANER-GAL', 'Condenser Coil Cleaner 1 Gallon', 'Heavy-duty outdoor coil cleaner. Dissolves grime.', 'Refrigerants & Chemicals', 'Nu-Calgon', 22.00, 49.99, 25, 8, 15, 'Aisle E-2', 'HVAC Supply Co', 1),
('DRAIN-TABS-200', 'Condensate Drain Pan Tablets 200ct', 'Prevents algae and slime in drain pans and lines.', 'Refrigerants & Chemicals', 'Pan Tablets', 25.00, 59.99, 20, 5, 10, 'Aisle E-3', 'HVAC Supply Co', 1),

-- Furnace Parts
('IGN-HSI-UNIV', 'Universal Hot Surface Ignitor', 'Replacement HSI for most furnace brands. 80-120V.', 'Furnace Parts', 'White-Rodgers', 18.00, 44.99, 30, 10, 20, 'Aisle F-1', 'GEMCO Supply', 1),
('IGN-PILOT-UNIV', 'Universal Pilot Ignition Kit', 'Standing pilot ignition kit with thermocouple.', 'Furnace Parts', 'Robertshaw', 28.00, 69.99, 15, 5, 10, 'Aisle F-1', 'GEMCO Supply', 1),
('SENSOR-FLAME', 'Flame Sensor Rod', 'Universal flame sensor for gas furnaces.', 'Furnace Parts', 'Honeywell', 8.00, 19.99, 40, 15, 30, 'Aisle F-1', 'GEMCO Supply', 1),
('VALVE-GAS-24V', '24V Gas Valve Universal', 'Standard replacement gas valve. Natural gas.', 'Furnace Parts', 'White-Rodgers', 85.00, 179.99, 8, 3, 6, 'Aisle F-2', 'GEMCO Supply', 1),
('VALVE-GAS-LP', 'LP Gas Conversion Valve', 'Natural gas to LP conversion valve kit.', 'Furnace Parts', 'Honeywell', 45.00, 99.99, 10, 3, 6, 'Aisle F-2', 'GEMCO Supply', 1),
('LIMIT-ROLLOUT', 'Rollout Limit Switch 350°F', 'Safety limit switch for furnace burner compartment.', 'Furnace Parts', 'Therm-O-Disc', 12.00, 29.99, 25, 8, 15, 'Aisle F-2', 'GEMCO Supply', 1),
('LIMIT-HIGH-200', 'High Limit Switch 200°F', 'Furnace high temperature limit switch.', 'Furnace Parts', 'Therm-O-Disc', 10.00, 24.99, 30, 10, 20, 'Aisle F-2', 'GEMCO Supply', 1),
('PRESS-SWITCH', 'Pressure Switch Universal', 'Draft pressure switch for induced draft furnaces.', 'Furnace Parts', 'Honeywell', 22.00, 54.99, 20, 6, 12, 'Aisle F-3', 'GEMCO Supply', 1),

-- Compressors
('COMP-SCROLL-2T', '2 Ton Scroll Compressor R-410A', 'Replacement scroll compressor for residential AC.', 'Compressors', 'Copeland', 550.00, 999.99, 4, 2, 3, 'Aisle G-1', 'Compressor World', 1),
('COMP-SCROLL-3T', '3 Ton Scroll Compressor R-410A', 'Mid-size residential scroll compressor.', 'Compressors', 'Copeland', 650.00, 1199.99, 3, 1, 2, 'Aisle G-1', 'Compressor World', 1),
('COMP-SCROLL-4T', '4 Ton Scroll Compressor R-410A', 'Large residential scroll compressor.', 'Compressors', 'Copeland', 750.00, 1399.99, 3, 1, 2, 'Aisle G-1', 'Compressor World', 1),
('COMP-SCROLL-5T', '5 Ton Scroll Compressor R-410A', 'Heavy-duty residential/light commercial compressor.', 'Compressors', 'Copeland', 850.00, 1599.99, 2, 1, 2, 'Aisle G-1', 'Compressor World', 1),

-- Ductwork & Accessories
('DUCT-FLEX-6X25', '6" x 25ft Insulated Flex Duct', 'R-8 insulated flexible duct. UL listed.', 'Ductwork & Accessories', 'Dundas Jafine', 35.00, 79.99, 20, 5, 10, 'Aisle H-1', 'HVAC Supply Co', 1),
('DUCT-FLEX-8X25', '8" x 25ft Insulated Flex Duct', 'R-8 insulated flexible duct for larger runs.', 'Ductwork & Accessories', 'Dundas Jafine', 45.00, 99.99, 15, 5, 10, 'Aisle H-1', 'HVAC Supply Co', 1),
('DUCT-FLEX-10X25', '10" x 25ft Insulated Flex Duct', 'R-8 insulated trunk line flexible duct.', 'Ductwork & Accessories', 'Dundas Jafine', 55.00, 119.99, 12, 4, 8, 'Aisle H-1', 'HVAC Supply Co', 1),
('DUCT-TAPE-3X60', 'UL Listed Foil Duct Tape 3" x 60yd', 'Aluminum foil HVAC tape. Meets building codes.', 'Ductwork & Accessories', '3M', 12.00, 27.99, 50, 15, 30, 'Aisle H-2', 'HVAC Supply Co', 1),
('DUCT-MASTIC-GAL', 'Duct Mastic Sealant 1 Gallon', 'Water-based duct sealant. Fiber reinforced.', 'Ductwork & Accessories', 'Hardcast', 18.00, 39.99, 25, 8, 15, 'Aisle H-2', 'HVAC Supply Co', 1),
('REGISTER-4X10', 'Steel Floor Register 4x10 White', 'Two-way air register with damper.', 'Ductwork & Accessories', 'Hart & Cooley', 8.00, 18.99, 40, 10, 20, 'Aisle H-3', 'HVAC Supply Co', 1),
('REGISTER-6X12', 'Steel Floor Register 6x12 White', 'Standard floor register with adjustable damper.', 'Ductwork & Accessories', 'Hart & Cooley', 10.00, 22.99, 35, 10, 20, 'Aisle H-3', 'HVAC Supply Co', 1),
('GRILLE-RET-20X20', 'Return Air Grille 20x20 White', 'Steel return air grille with filter frame.', 'Ductwork & Accessories', 'Hart & Cooley', 22.00, 49.99, 20, 5, 10, 'Aisle H-3', 'HVAC Supply Co', 1),

-- Control Boards & Modules
('BOARD-FURNACE-UNIV', 'Universal Furnace Control Board', 'Replacement integrated furnace control. Most brands.', 'Control Boards', 'ICM Controls', 85.00, 189.99, 8, 3, 5, 'Aisle I-1', 'GEMCO Supply', 1),
('BOARD-DEFROST', 'Heat Pump Defrost Control Board', 'Universal defrost timer board for heat pumps.', 'Control Boards', 'ICM Controls', 55.00, 129.99, 10, 4, 6, 'Aisle I-1', 'GEMCO Supply', 1),
('BOARD-FAN-CTRL', 'Fan Control Board', 'Timed fan control for furnace blower.', 'Control Boards', 'ICM Controls', 35.00, 79.99, 12, 4, 8, 'Aisle I-1', 'GEMCO Supply', 1),
('MODULE-IGN', 'Ignition Control Module', 'Direct spark or hot surface ignition module.', 'Control Boards', 'Honeywell', 65.00, 149.99, 8, 3, 5, 'Aisle I-2', 'GEMCO Supply', 1),
('XFMR-40VA', '40VA Transformer 120V to 24V', 'Standard HVAC control transformer. Foot mount.', 'Control Boards', 'Packard', 12.00, 29.99, 35, 10, 20, 'Aisle I-2', 'GEMCO Supply', 1),

-- Line Sets & Copper
('LINESET-3/8-3/4-25', '3/8 x 3/4 x 25ft Mini Split Line Set', 'Pre-charged line set with flare fittings. Insulated.', 'Line Sets & Copper', 'Kooline', 85.00, 179.99, 10, 3, 6, 'Aisle J-1', 'GEMCO Supply', 1),
('LINESET-3/8-3/4-50', '3/8 x 3/4 x 50ft Mini Split Line Set', 'Extended length pre-charged line set.', 'Line Sets & Copper', 'Kooline', 145.00, 299.99, 8, 2, 4, 'Aisle J-1', 'GEMCO Supply', 1),
('COPPER-3/8-50', '3/8" ACR Copper Tubing 50ft', 'Soft copper tubing for refrigerant lines.', 'Line Sets & Copper', 'Mueller', 75.00, 159.99, 10, 3, 6, 'Aisle J-2', 'GEMCO Supply', 1),
('COPPER-3/4-50', '3/4" ACR Copper Tubing 50ft', 'Suction line copper for AC installations.', 'Line Sets & Copper', 'Mueller', 125.00, 259.99, 8, 2, 4, 'Aisle J-2', 'GEMCO Supply', 1),

-- Safety Equipment & Tools
('LEAK-DET-ELEC', 'Electronic Refrigerant Leak Detector', 'Heated sensor leak detector. R-410A, R-22 compatible.', 'Tools & Safety', 'Inficon', 145.00, 299.99, 5, 2, 3, 'Aisle K-1', 'Tools Direct', 1),
('GAUGE-MANIFOLD', 'Digital Manifold Gauge Set', 'R-410A digital manifold with hoses. Bluetooth enabled.', 'Tools & Safety', 'Yellow Jacket', 280.00, 549.99, 4, 2, 3, 'Aisle K-1', 'Tools Direct', 1),
('VACUUM-PUMP-4CFM', '4 CFM Vacuum Pump', 'Two-stage vacuum pump for AC installation.', 'Tools & Safety', 'Robinair', 195.00, 399.99, 4, 2, 3, 'Aisle K-1', 'Tools Direct', 1),
('RECOV-UNIT', 'Refrigerant Recovery Machine', 'Portable recovery unit for R-410A and R-22.', 'Tools & Safety', 'Appion', 650.00, 1299.99, 2, 1, 2, 'Aisle K-2', 'Tools Direct', 1),
('SCALE-REFRIG', 'Refrigerant Charging Scale', 'Digital refrigerant scale. 220 lb capacity.', 'Tools & Safety', 'Yellow Jacket', 145.00, 299.99, 4, 2, 3, 'Aisle K-2', 'Tools Direct', 1),

-- Mini Split Systems
('MINI-9K-115V', '9,000 BTU Mini Split System', 'Ductless mini split. 115V, 19 SEER. Heat and cool.', 'Mini Split Systems', 'MrCool', 650.00, 1199.99, 5, 2, 3, 'Aisle L-1', 'Equipment Direct', 1),
('MINI-12K-115V', '12,000 BTU Mini Split System', 'Single zone ductless system. WiFi ready.', 'Mini Split Systems', 'MrCool', 750.00, 1399.99, 5, 2, 3, 'Aisle L-1', 'Equipment Direct', 1),
('MINI-18K-230V', '18,000 BTU Mini Split System', 'Larger single zone. 230V, 20 SEER efficiency.', 'Mini Split Systems', 'MrCool', 950.00, 1799.99, 4, 2, 3, 'Aisle L-1', 'Equipment Direct', 1),
('MINI-24K-230V', '24,000 BTU Mini Split System', 'High capacity single zone. Heat pump.', 'Mini Split Systems', 'MrCool', 1150.00, 2199.99, 3, 1, 2, 'Aisle L-1', 'Equipment Direct', 1),
('MINI-36K-MULTI', '36,000 BTU Multi-Zone System', '3-zone outdoor unit. Add indoor heads separately.', 'Mini Split Systems', 'MrCool', 1800.00, 3499.99, 2, 1, 2, 'Aisle L-2', 'Equipment Direct', 1);

-- Insert sample technicians
INSERT INTO Technicians (firstName, lastName, email, phone, hireDate, certifications, skills, hourlyRate, status, color) VALUES
('John', 'Martinez', 'john.m@hvacpro.com', '(555) 111-0001', '2019-03-15', '["EPA 608 Universal","NATE Certified","R-410A Certified"]', '["HVAC Installation","AC Repair","Furnace Repair","Heat Pumps"]', 35.00, 'active', '#2196F3'),
('Mike', 'Johnson', 'mike.j@hvacpro.com', '(555) 111-0002', '2020-06-01', '["EPA 608 Universal","NATE Certified"]', '["HVAC Maintenance","AC Repair","Duct Work"]', 32.00, 'active', '#4CAF50'),
('Sarah', 'Williams', 'sarah.w@hvacpro.com', '(555) 111-0003', '2021-01-10', '["EPA 608 Universal","NATE Certified","BPI Certified"]', '["HVAC Installation","Commercial Systems","Energy Audits"]', 38.00, 'active', '#FF9800');
