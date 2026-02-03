<?php

namespace App\Tests\Entity;

use App\Entity\Product;
use PHPUnit\Framework\TestCase;

class ProductTest extends TestCase
{
    public function testProductProperties(): void
    {
        $product = new Product();
        $product->setName('Auriculares Inalámbricos Pro');
        $product->setDescription('Auriculares Bluetooth con cancelación de ruido');
        $product->setPrice(149.99);
        $product->setStock(25);
        $product->setCategory('Electrónica');
        $product->setImage('https://example.com/image.jpg');

        $this->assertEquals('Auriculares Inalámbricos Pro', $product->getName());
        $this->assertEquals('Auriculares Bluetooth con cancelación de ruido', $product->getDescription());
        $this->assertEquals(149.99, $product->getPrice());
        $this->assertEquals(25, $product->getStock());
        $this->assertEquals('Electrónica', $product->getCategory());
        $this->assertEquals('https://example.com/image.jpg', $product->getImage());
    }
}
