import React, { useEffect } from 'react';
import { Modal, Table, Image } from 'react-bootstrap';
import { calculateProductCost } from '../../shared/SharedMethod';
import { currencySymbolHendling, getFormattedDate, getFormattedMessage } from '../../../shared/sharedMethod';

const PaymentSlipModal = ( props ) => {
    const { modalShowPaymentSlip, setModalShowPaymentSlip, updateproducts, printPaymentReceiptPdf, paymentType, frontSetting, paymentDetails, allConfigData, setPaymentValue, paymentTypeDefaultValue } = props;
    const currency = updateproducts.settings && updateproducts.settings.attributes && updateproducts.settings.attributes.currency_symbol

    return (
        <Modal
            show={modalShowPaymentSlip}
            onHide={() => {
                setModalShowPaymentSlip( false )
                setPaymentValue( {
                    pyment_type: paymentTypeDefaultValue[ 0 ],
                } )
            }}
            size='sm'
            aria-labelledby='contained-modal-title-vcenter'
            centered
            className="pos-modal"
        >
            <Modal.Header closeButton className="pb-3">
                <Modal.Title id='contained-modal-title-vcenter'>
                    {getFormattedMessage( 'pos-sale.detail.invoice.info' )} POS
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0 pb-3">
                <div className="mt-4 mb-4 text-black text-center fs-1">{frontSetting?.value?.company_name}</div>
                <Table>
                    <tbody>
                        <tr>
                            <td scope='row' className='p-0'>
                                <span>{getFormattedMessage( 'react-data-table.date.column.label' )}:</span>
                                <span className='ms-2 font-label'>
                                    {getFormattedDate( new Date(), allConfigData && allConfigData )}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope='row' className='p-0'>
                                <span className='address__label d-inline-block'>{getFormattedMessage( 'supplier.table.address.column.title' )}:</span>
                                <span className='ms-2 address__value d-inline-block font-label'>
                                    {frontSetting.value && frontSetting.value.address}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope='row' className='p-0'>
                                <span>{getFormattedMessage( 'globally.input.email.label' )}:</span>
                                <span className='ms-2 font-label'>
                                    {frontSetting.value && frontSetting.value.email}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope='row' className='p-0'>
                                <span>{getFormattedMessage( 'pos-sale.detail.Phone.info' )}:</span>
                                <span className='ms-2 font-label'>
                                    {frontSetting.value && frontSetting.value.phone}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td scope='row' className='p-0'>
                                <span> {getFormattedMessage( 'dashboard.recentSales.customer.label' )}: </span>
                                <span
                                    className='ms-2 font-label'>{updateproducts.customer_name && updateproducts.customer_name[ 0 ] ? updateproducts.customer_name[ 0 ].label : updateproducts.customer_name && updateproducts.customer_name.label}</span>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {updateproducts.products && updateproducts.products.map( ( productName, index ) => {
                    return (
                        <div key={index + 1}>
                            <div className='p-0'>{productName.name} <span>({productName.code})</span></div>
                            <div className='product-border'>
                                <div className='border-0 d-flex justify-content-between'>
                                    <span className=''>
                                        {( productName.quantity ).toFixed( 2 )} {productName.product_unit === '3' && 'Kg' || productName.product_unit === '1' && 'Pc' || productName.product_unit === '2' && 'M'} X {( calculateProductCost( productName ).toFixed( 2 ) )}
                                    </span>
                                    <span className='text-end'>
                                        {currencySymbolHendling( allConfigData, currency, productName.quantity * ( calculateProductCost( productName ) ) )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                } )}

                <div className='d-flex product-border'>
                    <div>{getFormattedMessage( "pos-total-amount.title" )}:</div>
                    <div
                        className='text-end ms-auto'> {currencySymbolHendling( allConfigData, currency, updateproducts.subTotal ? updateproducts.subTotal : '0.00' )}
                    </div>
                </div>

                <div className='d-flex product-border'>
                    <div>{getFormattedMessage( 'globally.detail.order.tax' )}:</div>
                    <div
                        className='text-end ms-auto'> {currencySymbolHendling( allConfigData, currency, updateproducts.taxTotal ? updateproducts.taxTotal : '0.00' )} ({updateproducts ? parseFloat( updateproducts.tax ).toFixed( 2 ) : '0.00'} %)
                    </div>
                </div>
                <div className='d-flex product-border'>
                    <div>{getFormattedMessage( 'purchase.order-item.table.discount.column.label' )}:</div>
                    <div
                        className='text-end ms-auto'> {currencySymbolHendling( allConfigData, currency, updateproducts ? updateproducts.discount : '0.00' )}
                    </div>
                </div>
                {
                    updateproducts.shipping ? <div className='d-flex product-border'>
                        <div>Shipping:</div>
                        <div
                            className='text-end ms-auto'> {currencySymbolHendling( allConfigData, currency, updateproducts ? updateproducts.shipping : '0.00' )}
                        </div>
                    </div> : ''
                }
                <div className='d-flex product-border'>
                    <div>{getFormattedMessage( "purchase.grant-total.label" )}:</div>
                    <div className='text-end ms-auto'> {currencySymbolHendling( allConfigData, currency, updateproducts.grandTotal )}</div>
                </div>
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th className='py-2 px-0'>{getFormattedMessage( 'pos-sale.detail.Paid-bt.title' )}</th>
                            <th className='text-end py-2 px-0'>{getFormattedMessage( 'expense.input.amount.label' )}</th>
                            <th className='text-end py-2 px-0'>{getFormattedMessage( 'pos.change-return.label' )}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='py-2 px-0'>{paymentType}</td>
                            <td className='text-end py-2 px-0'>
                                {currencySymbolHendling( allConfigData, currency, updateproducts.grandTotal )}</td>
                            <td className='text-end py-2 px-0'>
                                {currencySymbolHendling( allConfigData, currency, updateproducts.chnageReturn )}</td>
                        </tr>
                    </tbody>
                </Table>
                {updateproducts && updateproducts.note ?
                    <div className='d-flex product-border mb-5'>
                        <div className='fw-bolder'>Notes:</div>
                        <div className='ms-2 mb-2 product-border__product-width'>
                            {updateproducts && updateproducts.note}
                        </div>
                    </div> : ''}
                <h5 className='text-center font-label'>{getFormattedMessage( 'pos-thank.you-slip.invoice' )}.</h5>
                <div className='text-center d-block'>
                    <Image
                        src={paymentDetails && paymentDetails.attributes.barcode_url}
                        className='' height={25} width={100} />
                    <span className='d-block'>{paymentDetails && paymentDetails.attributes.reference_code}</span>
                </div>
            </Modal.Body>
            <Modal.Footer className='justify-content-center pt-2'>
                <button className='btn btn-primary text-white'
                    onClick={printPaymentReceiptPdf}>{getFormattedMessage( "print.title" )}</button>
                <button className='btn btn-secondary'
                    onClick={() => {
                        setModalShowPaymentSlip( false )
                        setPaymentValue( {
                            pyment_type: paymentTypeDefaultValue[ 0 ],
                        } )
                    }}>{getFormattedMessage( "pos-close-btn.title" )}
                </button>
            </Modal.Footer>
        </Modal>
    )
};
export default PaymentSlipModal;

