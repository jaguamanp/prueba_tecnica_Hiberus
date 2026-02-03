-- init.sql
-- Crear tabla products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description LONGTEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- Crear tabla orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT NOT NULL,
    customer_id VARCHAR(100) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    shipping DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shipping_name VARCHAR(255) DEFAULT NULL,
    shipping_address LONGTEXT DEFAULT NULL,
    shipping_city VARCHAR(100) DEFAULT NULL,
    shipping_postal_code VARCHAR(20) DEFAULT NULL,
    shipping_phone VARCHAR(20) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY(id),
    INDEX idx_orders_customer_id (customer_id),
    INDEX idx_orders_status (status)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

-- Crear tabla order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT NOT NULL,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(id),
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;




-- Insert de productos iniciales
INSERT INTO products (name, description, price, stock, category, image, created_at, updated_at) VALUES
('Auriculares Inalámbricos Pro', 'Auriculares Bluetooth con cancelación de ruido activa, 30 horas de batería y sonido Hi-Fi premium.', 149.99, 25, 'Electrónica', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', NOW(), NOW()),
('Smartwatch Fitness Tracker', 'Reloj inteligente con monitor cardíaco, GPS integrado y resistente al agua hasta 50m.', 199.99, 18, 'Electrónica', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', NOW(), NOW()),
('Cámara Digital Mirrorless', 'Cámara sin espejo de 24MP con grabación 4K, estabilización de imagen y WiFi integrado.', 899.99, 8, 'Fotografía', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', NOW(), NOW()),
('Teclado Mecánico RGB', 'Teclado gaming mecánico con switches Cherry MX, retroiluminación RGB y reposamuñecas.', 129.99, 32, 'Gaming', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop', NOW(), NOW()),
('Mochila Laptop Premium', 'Mochila ergonómica para laptop de hasta 17", resistente al agua con puerto USB integrado.', 79.99, 45, 'Accesorios', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', NOW(), NOW()),
('Altavoz Bluetooth Portátil', 'Altavoz inalámbrico 360° con batería de 24 horas, resistente al agua IPX7.', 89.99, 28, 'Audio', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop', NOW(), NOW()),
('Monitor Gaming 27" 144Hz', 'Monitor IPS de 27 pulgadas, 1ms respuesta, 144Hz y compatible con G-Sync/FreeSync.', 349.99, 12, 'Gaming', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop', NOW(), NOW()),
('Tablet Pro 11"', 'Tablet con pantalla Retina de 11", chip M2, compatible con stylus y teclado magnético.', 799.99, 15, 'Electrónica', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', NOW(), NOW()),
('Drone 4K con Gimbal', 'Drone plegable con cámara 4K, estabilizador de 3 ejes y 30 minutos de vuelo.', 599.99, 7, 'Fotografía', 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop', NOW(), NOW()),
('Silla Gaming Ergonómica', 'Silla gaming con soporte lumbar, reposabrazos 4D y reclinable hasta 180°.', 299.99, 20, 'Gaming', 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop', NOW(), NOW()),
('Power Bank 20000mAh', 'Batería externa con carga rápida 65W, pantalla LED y compatible con laptops.', 59.99, 50, 'Accesorios', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', NOW(), NOW()),
('Webcam 4K Streaming', 'Cámara web 4K con micrófono dual, corrección de luz automática y ángulo de 90°.', 169.99, 22, 'Streaming', 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop', NOW(), NOW());
