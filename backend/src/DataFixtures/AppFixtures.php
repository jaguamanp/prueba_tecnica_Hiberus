<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $products = [
            [
                'name' => 'Auriculares Inalámbricos Pro',
                'description' => 'Auriculares Bluetooth con cancelación de ruido activa, 30 horas de batería y sonido Hi-Fi premium.',
                'price' => '149.99',
                'stock' => 25,
                'category' => 'Electrónica',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Smartwatch Fitness Tracker',
                'description' => 'Reloj inteligente con monitor cardíaco, GPS integrado y resistente al agua hasta 50m.',
                'price' => '199.99',
                'stock' => 18,
                'category' => 'Electrónica',
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Cámara Digital Mirrorless',
                'description' => 'Cámara sin espejo de 24MP con grabación 4K, estabilización de imagen y WiFi integrado.',
                'price' => '899.99',
                'stock' => 8,
                'category' => 'Fotografía',
                'image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Teclado Mecánico RGB',
                'description' => 'Teclado gaming mecánico con switches Cherry MX, retroiluminación RGB y reposamuñecas.',
                'price' => '129.99',
                'stock' => 32,
                'category' => 'Gaming',
                'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Mochila Laptop Premium',
                'description' => 'Mochila ergonómica para laptop de hasta 17", resistente al agua con puerto USB integrado.',
                'price' => '79.99',
                'stock' => 45,
                'category' => 'Accesorios',
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Altavoz Bluetooth Portátil',
                'description' => 'Altavoz inalámbrico 360° con batería de 24 horas, resistente al agua IPX7.',
                'price' => '89.99',
                'stock' => 28,
                'category' => 'Audio',
                'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Monitor Gaming 27" 144Hz',
                'description' => 'Monitor IPS de 27 pulgadas, 1ms respuesta, 144Hz y compatible con G-Sync/FreeSync.',
                'price' => '349.99',
                'stock' => 12,
                'category' => 'Gaming',
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Tablet Pro 11"',
                'description' => 'Tablet con pantalla Retina de 11", chip M2, compatible con stylus y teclado magnético.',
                'price' => '799.99',
                'stock' => 15,
                'category' => 'Electrónica',
                'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Drone 4K con Gimbal',
                'description' => 'Drone plegable con cámara 4K, estabilizador de 3 ejes y 30 minutos de vuelo.',
                'price' => '599.99',
                'stock' => 7,
                'category' => 'Fotografía',
                'image' => 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Silla Gaming Ergonómica',
                'description' => 'Silla gaming con soporte lumbar, reposabrazos 4D y reclinable hasta 180°.',
                'price' => '299.99',
                'stock' => 20,
                'category' => 'Gaming',
                'image' => 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Power Bank 20000mAh',
                'description' => 'Batería externa con carga rápida 65W, pantalla LED y compatible con laptops.',
                'price' => '59.99',
                'stock' => 50,
                'category' => 'Accesorios',
                'image' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
            ],
            [
                'name' => 'Webcam 4K Streaming',
                'description' => 'Cámara web 4K con micrófono dual, corrección de luz automática y ángulo de 90°.',
                'price' => '169.99',
                'stock' => 22,
                'category' => 'Streaming',
                'image' => 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop',
            ],
        ];

        foreach ($products as $data) {
            $product = new Product();
            $product->setName($data['name']);
            $product->setDescription($data['description']);
            $product->setPrice($data['price']);
            $product->setStock($data['stock']);
            $product->setCategory($data['category']);
            $product->setImage($data['image']);

            $manager->persist($product);
        }

        $manager->flush();
    }
}
