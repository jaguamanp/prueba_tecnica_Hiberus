<?php

namespace App\Tests\Entity;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use PHPUnit\Framework\TestCase;

class OrderTest extends TestCase
{
    public function testOrderTotals(): void
    {
        $order = new Order();
        $order->setCustomerId('12345');

        $product1 = new Product();
        $product1->setName('Producto 1')->setPrice('100.00')->setStock(5);

        $product2 = new Product();
        $product2->setName('Producto 2')->setPrice('50.00')->setStock(5);

        $item1 = new OrderItem();
        $item1->setProduct($product1)->setQuantity(1);

        $item2 = new OrderItem();
        $item2->setProduct($product2)->setQuantity(2);

        $order->addItem($item1);
        $order->addItem($item2);

        $order->calculateTotals();

        $this->assertEquals('200.00', $order->getSubtotal());
        $this->assertEquals('0.00', $order->getShipping()); // gratis porque subtotal > 100
        $this->assertEquals('32.00', $order->getTax()); // 16% de 200
        $this->assertEquals('232.00', $order->getTotal());
    }
}

