import React, {useEffect, useState} from 'react';
import {InputGroup} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import Form from 'react-bootstrap/Form';
import {productsalesDropdown} from '../../../store/action/productsaleUnitAction';
import {decimalValidate} from '../../sharedMethod';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import AdjustmentType from '../../../shared/option-lists/AdjustmentType.json'
import ReactSelect from '../../../shared/select/reactSelect';
import { posAllProduct } from '../../../store/action/pos/posAllProductAction';

const AdjustmentTableBody = (props) => {
    const {
        singleProduct,
        index,
        updateproducts,
        setUpdateproducts,
        posAllProduct, posAllproducts, warehouse
    } = props;

    const onDeleteCartItem = (id) => {
        const newProduct = updateproducts.filter((item) => item.id !== id);
        setUpdateproducts(newProduct);
    };

    useEffect(() => {
        posAllProduct(warehouse.value)
    }, [])

    const handleChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
         setUpdateproducts(updateproducts =>
            updateproducts.map((item)=>{
                if (item.id === singleProduct.id){
                    const compareQty = posAllproducts.filter((pro)=>pro.id === singleProduct.id).map((pro)=> pro.attributes.stock.quantity)
                    return item.adjustMethod === 2 ? {...item, quantity:compareQty[0] < Number(e.target.value) ? compareQty[0] : Number(e.target.value) } : {...item, quantity: Number(e.target.value) }
                }else{
                    return item
                }
            })
        )
    };

    const handleIncrement = () => {
        setUpdateproducts(updateproducts =>
            updateproducts.map((item)=>{
               if (item.id === singleProduct.id){
                const compareQty = posAllproducts.filter((pro)=>pro.id === singleProduct.id).map((pro)=> pro.attributes.stock.quantity)
                       return {...item, quantity: item.adjustMethod === 2 ? compareQty[0] > item.quantity ? item.quantity++ + 1 : compareQty[0] : item.quantity++ + 1}
               }else{
                   return item
               }
            })
        )
    };
    const handleDecrement = () => {
        if (singleProduct.quantity - 1 > 0.00) {
            setUpdateproducts(updateproducts => updateproducts.map(item => item.id === singleProduct.id
                ? {...item, quantity: item.quantity --- 1}
                : item,
            ))
        }
    };

    const onMethodChange = (obj) => {
        setUpdateproducts(updateproducts => updateproducts.map(item => item.id === singleProduct.id
            ?
            {...item, adjustMethod: obj.value}
            : item,
        ))
        setUpdateproducts(updateproducts =>
            updateproducts.map((item)=>{
               if (item.id === singleProduct.id){
                   const compareQty = posAllproducts.filter((pro)=>pro.id === singleProduct.id).map((pro)=> pro.attributes.stock.quantity)
                   return {...item, quantity: item.adjustMethod === 2 ? compareQty[0] > item.quantity ? item.quantity++ + 0 : compareQty[0] : item.quantity++}
               }else{
                   return item
               }
            }))
    }

    return (
        <tr key={index} className='align-middle'>
            <td>
                <h4 className='fs-6 mb-0'>{singleProduct.name}</h4>
            </td>
            <td>
                <h4 className='fs-6 mb-0'>{singleProduct.code}</h4>
            </td>
            <td>
                {singleProduct.isEdit ?
                singleProduct.stock.length >= 1 && singleProduct.stock.map((item) => {
                    return(
                        <span className='badge bg-light-warning'>
                        <span>{item.quantity}&nbsp;{singleProduct.short_name}</span>
                        </span>
                    )
                })
                :
                singleProduct.stock >= 0 ? <span className='badge bg-light-warning'>
                    <span>{singleProduct.stock}&nbsp;{singleProduct.short_name}</span>
                </span>
                :
                ''}
            </td>
            <td>
                <div className='custom-qty'>
                    <InputGroup className='flex-nowrap'>
                        <InputGroup.Text className='btn btn-primary btn-sm px-4 px-4 pt-2'
                                         onClick={(e) => handleDecrement(e)}>
                            -
                        </InputGroup.Text>
                        <Form.Control aria-label='Product Quantity'
                                      onKeyPress={(event) => decimalValidate(event)}
                                      className='text-center px-0 py-2 rounded-0 hide-arrow'
                                      value={singleProduct.quantity}
                                      type="number"
                                      step={0.01}
                                      min={0.00}
                                      onChange={(e) => handleChange(e)}
                        />
                        <InputGroup.Text className='btn btn-primary btn-sm px-4 px-4 pt-2'
                                         onClick={(e) => handleIncrement(e)}>
                            +
                        </InputGroup.Text>
                    </InputGroup>
                </div>
            </td>
            <td>
                <ReactSelect name='AdjustmentType' data={AdjustmentType} onChange={onMethodChange}
                         defaultValue={singleProduct.isEdit ? singleProduct.adjustMethod === 1 ? AdjustmentType[0] : AdjustmentType[1] : AdjustmentType[0]} isRequired/>

            </td>
            <td className='text-center'>
                <button className='btn px-2 text-danger fs-3'>
                    <FontAwesomeIcon icon={faTrash} onClick={() => onDeleteCartItem(singleProduct.id)}/>
                </button>
            </td>
        </tr>
    )
};

const mapStateToProps = (state) => {
    const {productsales, posAllproducts} = state;
    return {productsales, posAllproducts};
};

export default connect(mapStateToProps, {productsalesDropdown, posAllProduct})(AdjustmentTableBody);
