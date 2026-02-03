<?php

namespace App\Controller\Api;

use App\Service\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/orders', name: 'orders_')]
class OrderController extends AbstractController
{
    public function __construct(
        private OrderService $orderService
    ) {}

    /**
     * UC-O01: Crear pedido (Cliente simulado)
     * POST /orders
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        // Obtener customer ID del header simulado
        $customerId = $request->headers->get('X-Customer-Id');
        
        if (!$customerId) {
            return $this->json([
                'success' => false,
                'error' => 'Se requiere el header X-Customer-Id',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json([
                'success' => false,
                'error' => 'Datos JSON inválidos',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->orderService->createOrder($customerId, $data);

        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'errors' => $result['errors'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json([
            'success' => true,
            'data' => $result['order']->toArray(),
            'message' => 'Pedido creado exitosamente',
        ], Response::HTTP_CREATED);
    }

    /**
     * GET /orders - Listar pedidos
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $customerId = $request->headers->get('X-Customer-Id');
        $userRole = $request->headers->get('X-User-Role', 'CLIENTE');
        
        if (!$customerId) {
            return $this->json([
                'success' => false,
                'error' => 'Se requiere el header X-Customer-Id',
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Admin ve todos los pedidos, cliente solo los suyos
        if ($userRole === 'ADMIN') {
            $orders = $this->orderService->getAllOrders();
        } else {
            $orders = $this->orderService->getOrdersByCustomer($customerId);
        }

        return $this->json([
            'success' => true,
            'data' => array_map(fn($order) => $order->toArray(), $orders),
        ]);
    }

    /**
     * UC-O02: Ver detalle de pedido (Cliente simulado)
     * GET /orders/{id}
     */
    #[Route('/{id}', name: 'show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id, Request $request): JsonResponse
    {
        $customerId = $request->headers->get('X-Customer-Id');
        $userRole = $request->headers->get('X-User-Role', 'CLIENTE');
        
        if (!$customerId) {
            return $this->json([
                'success' => false,
                'error' => 'Se requiere el header X-Customer-Id',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $order = $this->orderService->getOrder($id);

        if (!$order) {
            return $this->json([
                'success' => false,
                'error' => 'Pedido no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Validar pertenencia
        $isAdmin = $userRole === 'ADMIN';
        if (!$this->orderService->validateOwnership($order, $customerId, $isAdmin)) {
            return $this->json([
                'success' => false,
                'error' => 'No tienes permiso para ver este pedido',
            ], Response::HTTP_FORBIDDEN);
        }

        return $this->json([
            'success' => true,
            'data' => $order->toArray(),
        ]);
    }

    /**
     * UC-O03: Checkout (simulado)
     * POST /orders/{id}/checkout
     */
    #[Route('/{id}/checkout', name: 'checkout', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function checkout(int $id, Request $request): JsonResponse
    {
        $customerId = $request->headers->get('X-Customer-Id');
        $userRole = $request->headers->get('X-User-Role', 'CLIENTE');
        
        if (!$customerId) {
            return $this->json([
                'success' => false,
                'error' => 'Se requiere el header X-Customer-Id',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $order = $this->orderService->getOrder($id);

        if (!$order) {
            return $this->json([
                'success' => false,
                'error' => 'Pedido no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        // Validar pertenencia
        $isAdmin = $userRole === 'ADMIN';
        if (!$this->orderService->validateOwnership($order, $customerId, $isAdmin)) {
            return $this->json([
                'success' => false,
                'error' => 'No tienes permiso para procesar este pedido',
            ], Response::HTTP_FORBIDDEN);
        }

        $result = $this->orderService->checkout($order);

        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'errors' => $result['errors'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json([
            'success' => true,
            'data' => $result['order']->toArray(),
            'message' => 'Checkout completado exitosamente. El pago ha sido procesado.',
        ]);
    }
}
