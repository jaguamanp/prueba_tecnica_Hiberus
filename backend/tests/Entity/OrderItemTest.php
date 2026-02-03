<?php

namespace App\Tests\Entity;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use PHPUnit\Framework\TestCase;

class OrderItemTest extends TestCase
{
    public function testOrderItemProperties(): void
    {
        // Creamos un producto de ejemplo
        $product = new Product();
        $product->setName('Auriculares Test')->setPrice('149.99')->setStock(10);

        // Creamos un pedido de ejemplo
        $order = new Order();
        $order->setCustomerId('12345');

        // Creamos OrderItem y asignamos producto y cantidad
        $item = new OrderItem();
        $item->setProduct($product);
        $item->setQuantity(2); // esto automáticamente calcula subtotal
        $item->setOrder($order);

        // Verificaciones
        $this->assertSame($product, $item->getProduct());
        $this->assertSame($order, $item->getOrder());
        $this->assertEquals(2, $item->getQuantity());
        $this->assertEquals('149.99', $item->getUnitPrice());
        $this->assertEquals('299.98', $item->getSubtotal());
    }
}


