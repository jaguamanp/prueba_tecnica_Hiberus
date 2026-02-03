<?php

namespace App\Controller\Api;

use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products', name: 'products_')]
class ProductController extends AbstractController
{
    public function __construct(
        private ProductService $productService
    ) {}

    /**
     * UC-P01: Listar productos (Catálogo)
     * GET /products?search=&page=&sort=&order=&category=&limit=
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, max(1, (int) $request->query->get('limit', 10)));
        $search = $request->query->get('search');
        $category = $request->query->get('category');
        $sort = $request->query->get('sort', 'name');
        $order = $request->query->get('order', 'ASC');

        $result = $this->productService->getProducts($page, $limit, $search, $category, $sort, $order);

        return $this->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * GET /products/categories
     */
    #[Route('/categories', name: 'categories', methods: ['GET'])]
    public function categories(): JsonResponse
    {
        $categories = $this->productService->getCategories();

        return $this->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * GET /products/{id}
     */
    #[Route('/{id}', name: 'show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->productService->getProduct($id);

        if (!$product) {
            return $this->json([
                'success' => false,
                'error' => 'Producto no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $product->toArray(),
        ]);
    }

    /**
     * UC-P02: Crear producto (Solo Admin simulado)
     * POST /products
     */
    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        // Verificar rol de Admin simulado
        $userRole = $request->headers->get('X-User-Role', 'CLIENTE');
        
        if ($userRole !== 'ADMIN') {
            return $this->json([
                'success' => false,
                'error' => 'No autorizado. Se requiere rol de ADMIN.',
            ], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json([
                'success' => false,
                'error' => 'Datos JSON inválidos',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->productService->createProduct($data);

        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'errors' => $result['errors'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json([
            'success' => true,
            'data' => $result['product']->toArray(),
            'message' => 'Producto creado exitosamente',
        ], Response::HTTP_CREATED);
    }

    /**
     * PUT /products/{id}
     */
    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'], requirements: ['id' => '\d+'])]
    public function update(int $id, Request $request): JsonResponse
    {
        // Verificar rol de Admin simulado
        $userRole = $request->headers->get('X-User-Role', 'CLIENTE');
        
        if ($userRole !== 'ADMIN') {
            return $this->json([
                'success' => false,
                'error' => 'No autorizado. Se requiere rol de ADMIN.',
            ], Response::HTTP_FORBIDDEN);
        }

        $product = $this->productService->getProduct($id);

        if (!$product) {
            return $this->json([
                'success' => false,
                'error' => 'Producto no encontrado',
            ], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json([
                'success' => false,
                'error' => 'Datos JSON inválidos',
            ], Response::HTTP_BAD_REQUEST);
        }

        $result = $this->productService->updateProduct($product, $data);

        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'errors' => $result['errors'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json([
            'success' => true,
            'data' => $result['product']->toArray(),
            'message' => 'Producto actualizado exitosamente',
        ]);
    }
}
