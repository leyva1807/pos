import React, {useEffect} from 'react';
import {Table} from 'react-bootstrap-v5';
import ProductTableBody from './ProductTableBody';
import {getFormattedMessage} from '../../sharedMethod';

const ProductRowTable = (props) => {
    const {
        updateproducts, setUpdateproducts, updatedQty, updateCost, updateDiscount, updateTax,
        frontSetting, updateSubTotal, updateSaleUnit, isSaleReturn
    } = props;

    useEffect(() => {
        setUpdateproducts(updateproducts);
    }, [updateproducts]);

    return (
        <Table responsive>
            <thead>
            <tr>
                <th>{getFormattedMessage('product.title')}</th>
                <th>{getFormattedMessage('sale.order-item.table.net-unit-price.column.label')}</th>
                <th>{getFormattedMessage('purchase.order-item.table.stock.column.label')}</th>
                <th className='text-lg-start text-center'>{getFormattedMessage('purchase.order-item.table.qty.column.label')}</th>
                <th>{getFormattedMessage('purchase.order-item.table.discount.column.label')}</th>
                <th>{getFormattedMessage('purchase.order-item.table.tax.column.label')}</th>
                <th>{getFormattedMessage('purchase.order-item.table.sub-total.column.label')}</th>
                {isSaleReturn ? null : < th > {getFormattedMessage('react-data-table.action.column.label')}</th>}
            </tr>
            </thead>
            <tbody>
            {updateproducts && updateproducts.map((singleProduct, index) => {
                return <ProductTableBody singleProduct={singleProduct} key={index} index={index} updateproducts={updateproducts}
                                         setUpdateproducts={setUpdateproducts} frontSetting={frontSetting}
                                         updateQty={updatedQty} updateCost={updateCost}
                                         updateDiscount={updateDiscount} updateTax={updateTax}
                                         updateSubTotal={updateSubTotal} updateSaleUnit={updateSaleUnit}/>
                })}
            {!updateproducts.length &&
                <tr>
                    <td colSpan={8} className='fs-5 px-3 py-6 custom-text-center'>
                        {getFormattedMessage('sale.product.table.no-data.label')}
                    </td>
                </tr>
            }
            </tbody>
        </Table>
    )
};

export default ProductRowTable;
