import React, {useEffect} from 'react';
import {Table} from 'react-bootstrap-v5';
import AdjustmentTableBody from './AdjustmentTableBody';
import {getFormattedMessage} from '../../sharedMethod';

const AdjustmentRowTable = (props) => {
    const {
        updateproducts, setUpdateproducts,
        frontSetting, updateSubTotal, warehouse
    } = props;

    useEffect(() => {
        setUpdateproducts(updateproducts);
    }, [updateproducts]);

    return (
        <Table responsive>
            <thead>
            <tr>
                <th>{getFormattedMessage('product.title')}</th>
                <th>{getFormattedMessage('product.product-details.code-product.label')}</th>
                <th>{getFormattedMessage('purchase.order-item.table.stock.column.label')}</th>
                <th className='text-lg-start text-center'>{getFormattedMessage('purchase.order-item.table.qty.column.label')}</th>
                <th>{getFormattedMessage('globally.type.label')}</th>
                <th className="text-center">{getFormattedMessage('react-data-table.action.column.label')}</th>
            </tr>
            </thead>
            <tbody>
            {updateproducts && updateproducts.length ? updateproducts.map((singleProduct, index) => {
                return <AdjustmentTableBody singleProduct={singleProduct} key={index} index={index} updateproducts={updateproducts} warehouse={warehouse}
                                         setUpdateproducts={setUpdateproducts} frontSetting={frontSetting} updateSubTotal={updateSubTotal}
                                         />
                }): <tr>
                <td colSpan={6} className='fs-5 px-3 py-6 custom-text-center'>
                    {getFormattedMessage('sale.product.table.no-data.label')}
                </td>
            </tr>}
            </tbody>
        </Table>
    )
};

export default AdjustmentRowTable;
