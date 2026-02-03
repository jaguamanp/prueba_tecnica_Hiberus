<?php

namespace App\Service;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService
{
    public function __construct(
        private ProductRepository $productRepository,
        private ValidatorInterface $validator
    ) {}

    /**
     * @return array{items: array, total: int, page: int, limit: int, pages: int}
     */
    public function getProducts(
        int $page = 1,
        int $limit = 10,
        ?string $search = null,
        ?string $category = null,
        string $sort = 'name',
        string $order = 'ASC'
    ): array {
        $result = $this->productRepository->findPaginated($page, $limit, $search, $category, $sort, $order);

        return [
            'items' => array_map(fn(Product $p) => $p->toArray(), $result['items']),
            'total' => $result['total'],
            'page' => $result['page'],
            'limit' => $result['limit'],
            'pages' => $result['pages'],
        ];
    }

    public function getProduct(int $id): ?Product
    {
        return $this->productRepository->find($id);
    }

    /**
     * @param array<string, mixed> $data
     * @return array{success: bool, product?: Product, errors?: array}
     */
    public function createProduct(array $data): array
    {
        $product = new Product();
        $product->setName($data['name'] ?? '');
        $product->setDescription($data['description'] ?? null);
        $product->setPrice($data['price'] ?? '0');
        $product->setStock($data['stock'] ?? 0);
        $product->setImage($data['image'] ?? null);
        $product->setCategory($data['category'] ?? null);

        $errors = $this->validator->validate($product);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return ['success' => false, 'errors' => $errorMessages];
        }

        $this->productRepository->save($product, true);

        return ['success' => true, 'product' => $product];
    }

    /**
     * @param array<string, mixed> $data
     * @return array{success: bool, product?: Product, errors?: array}
     */
    public function updateProduct(Product $product, array $data): array
    {
        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (array_key_exists('description', $data)) {
            $product->setDescription($data['description']);
        }
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        if (isset($data['stock'])) {
            $product->setStock($data['stock']);
        }
        if (array_key_exists('image', $data)) {
            $product->setImage($data['image']);
        }
        if (array_key_exists('category', $data)) {
            $product->setCategory($data['category']);
        }

        $errors = $this->validator->validate($product);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return ['success' => false, 'errors' => $errorMessages];
        }

        $this->productRepository->save($product, true);

        return ['success' => true, 'product' => $product];
    }

    /**
     * @return string[]
     */
    public function getCategories(): array
    {
        return $this->productRepository->findAllCategories();
    }
}
