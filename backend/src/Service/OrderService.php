<?php

namespace App\Service;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Entity\Product;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class OrderService
{
    public function __construct(
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator
    ) {}

    /**
     * @param array<string, mixed> $data
     * @return array{success: bool, order?: Order, errors?: array}
     */
    public function createOrder(string $customerId, array $data): array
    {
        $errors = [];

        // Validar que hay items
        if (!isset($data['items']) || !is_array($data['items']) || empty($data['items'])) {
            return ['success' => false, 'errors' => ['items' => 'El pedido debe tener al menos un producto']];
        }

        // Crear el pedido
        $order = new Order();
        $order->setCustomerId($customerId);

        // Dirección de envío
        if (isset($data['shippingAddress'])) {
            $address = $data['shippingAddress'];
            $order->setShippingName($address['fullName'] ?? null);
            $order->setShippingAddress($address['address'] ?? null);
            $order->setShippingCity($address['city'] ?? null);
            $order->setShippingPostalCode($address['postalCode'] ?? null);
            $order->setShippingPhone($address['phone'] ?? null);
        }

        // Procesar items y validar stock
        foreach ($data['items'] as $index => $itemData) {
            $productId = $itemData['productId'] ?? null;
            $quantity = $itemData['quantity'] ?? 0;

            if (!$productId) {
                $errors["items[$index].productId"] = 'ID de producto requerido';
                continue;
            }

            $product = $this->productRepository->find($productId);
            if (!$product) {
                $errors["items[$index].productId"] = "Producto con ID $productId no encontrado";
                continue;
            }

            if ($quantity <= 0) {
                $errors["items[$index].quantity"] = 'La cantidad debe ser mayor a 0';
                continue;
            }

            if ($quantity > $product->getStock()) {
                $errors["items[$index].quantity"] = "Stock insuficiente para '{$product->getName()}'. Disponible: {$product->getStock()}";
                continue;
            }

            // Crear item del pedido
            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($quantity);
            $order->addItem($orderItem);
        }

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        // Validar el pedido
        $validationErrors = $this->validator->validate($order);
        if (count($validationErrors) > 0) {
            foreach ($validationErrors as $error) {
                $errors[$error->getPropertyPath()] = $error->getMessage();
            }
            return ['success' => false, 'errors' => $errors];
        }

        // Calcular totales
        $order->calculateTotals();

        // Guardar pedido
        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return ['success' => true, 'order' => $order];
    }

    public function getOrder(int $id): ?Order
    {
        return $this->orderRepository->find($id);
    }

    /**
     * @return Order[]
     */
    public function getOrdersByCustomer(string $customerId): array
    {
        return $this->orderRepository->findByCustomerId($customerId);
    }

    /**
     * @return Order[]
     */
    public function getAllOrders(): array
    {
        return $this->orderRepository->findAllOrders();
    }

    /**
     * @return array{success: bool, order?: Order, errors?: array}
     */
    public function checkout(Order $order): array
    {
        // Validar que el pedido está pendiente
        if ($order->getStatus() !== Order::STATUS_PENDING) {
            return [
                'success' => false,
                'errors' => ['status' => 'El pedido no está en estado pendiente. Estado actual: ' . $order->getStatus()]
            ];
        }

        // Validar stock nuevamente
        $errors = [];
        foreach ($order->getItems() as $item) {
            $product = $item->getProduct();
            if ($product && $item->getQuantity() > $product->getStock()) {
                $errors["product_{$product->getId()}"] = "Stock insuficiente para '{$product->getName()}'";
            }
        }

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        // Actualizar stock de productos
        foreach ($order->getItems() as $item) {
            $product = $item->getProduct();
            if ($product) {
                $newStock = $product->getStock() - $item->getQuantity();
                $product->setStock($newStock);
            }
        }

        // Actualizar estado del pedido
        $order->setStatus(Order::STATUS_COMPLETED);

        $this->entityManager->flush();

        return ['success' => true, 'order' => $order];
    }

    public function validateOwnership(Order $order, string $customerId, bool $isAdmin): bool
    {
        if ($isAdmin) {
            return true;
        }
        return $order->getCustomerId() === $customerId;
    }
}
