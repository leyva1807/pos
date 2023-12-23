<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\PurchaseItem;
use App\Models\SaleItem;
use App\Models\Unit;

/**
 * Class RoleRepository
 */
class UnitRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'base_unit',
        'short_name',
        'created_at',
    ];

    /**
     * Return searchable fields
     *
     * @return array
     */
    public function getFieldsSearchable()
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Unit::class;
    }

    public function unitCantDelete($id): bool
    {
        $productModels = [
            Product::class,
        ];
        $purchaseItemModels = [
            PurchaseItem::class,
        ];
        $saleItemModels = [
            SaleItem::class,
        ];
        $productPurchaseResult = canDelete($productModels, 'purchase_unit', $id);
        $productsaleResult = canDelete($saleItemModels, 'sale_unit', $id);
        $purchaseResult = canDelete($purchaseItemModels, 'purchase_unit', $id);
        $saleResult = canDelete($saleItemModels, 'sale_unit', $id);
        if ($productPurchaseResult || $productsaleResult || $purchaseResult || $saleResult) {
            return true;
        }

        return false;
    }
}
