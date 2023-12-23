import React, {useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {ReactSearchAutocomplete} from 'react-search-autocomplete';
import {addToast} from '../../../../store/action/toastAction';
import {toastType} from '../../../../constants';
import {searchPurchaseProduct} from '../../../../store/action/purchaseProductAction';
import {getFormattedMessage, placeholderText} from '../../../sharedMethod';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

const productsearch = (props) => {
    const {
        values,
        products,
        updateproducts,
        setUpdateproducts,
        customproducts,
        searchPurchaseProduct,
        handleValidation,
        isAllproducts
    } = props;
    const [searchString, setSearchString] = useState("");
    const dispatch = useDispatch();
    const filterproducts = isAllproducts && values.warehouse_id ? products.map((item) => ({
        name: item.attributes.name, code: item.attributes.code, id: item.id
    })) : values.warehouse_id && products.filter((qty) => qty && qty.attributes && qty.attributes.stock && qty.attributes.stock.quantity > 0).map((item) => ({
        name: item.attributes.name, code: item.attributes.code, id: item.id
    }))

    const onproductsearch = (code) => {
        if (!values.warehouse_id) {
            handleValidation();
        } else {
            setSearchString(code);
            const newId = products.filter((item) => item.attributes.code === code || item.attributes.code === code.code).map((item) => item.id);
            const finalIdArrays = customproducts.map((id) => id.product_id);
            const finalId = finalIdArrays.filter((finalIdArray) => finalIdArray === newId[0]);
            if (finalId[0] !== undefined) {
                if (updateproducts.find(exitId => exitId.product_id === finalId[0])) {
                    dispatch(addToast({
                        text: getFormattedMessage('globally.product-already-added.validate.message'),
                        type: toastType.ERROR
                    }));
                } else {
                    searchPurchaseProduct(newId[0])
                    const pushArray = [...customproducts]
                    if (updateproducts.filter(product => product.code === code || product.code === code.code).length > 0) {
                        setUpdateproducts(updateproducts => updateproducts.map((item) => {
                            return item
                        }))
                    } else {
                        const newProduct = pushArray.find(element => element.product_id === finalId[0]);
                        setUpdateproducts([...updateproducts, newProduct]);
                    }
                }
                removeSearchClass();
                setSearchString("");
            }
        }
    }

    const handleOnSearch = (string) => {
        onproductsearch(string);
    }

    const handleOnSelect = (result) => {
        onproductsearch(result);
    }

    const formatResult = (item) => {
        return (
            <span onClick={(e) => e.stopPropagation()}>{item.code} ({item.name})</span>
        )
    }

    const removeSearchClass = () => {
        const html = document.getElementsByClassName(`custom-search`)[0].firstChild.firstChild.lastChild;
        html.style.display = 'none'
    }

    return (
        <div className='position-relative custom-search'>
            <ReactSearchAutocomplete
                items={filterproducts}
                onSearch={handleOnSearch}
                inputSearchString={searchString}
                fuseOptions={{keys: ['code', 'name']}}
                resultStringKeyName='code'
                placeholder={placeholderText('globally.search.field.label')}
                onSelect={handleOnSelect}
                formatResult={formatResult}
                showIcon={false}
                showClear={false}
            />
            <FontAwesomeIcon icon={faSearch}
                             className='d-flex align-items-center top-0 bottom-0 react-search-icon my-auto text-gray-600 position-absolute'/>
        </div>
    );
}

export default connect(null, {searchPurchaseProduct})(productsearch);
