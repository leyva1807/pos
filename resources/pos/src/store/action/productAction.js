import apiConfig from '../../config/apiConfigWthFormData';
import {apiBaseURL, Filters, productActionType, toastType, Tokens} from '../../constants';
import {addToast} from './toastAction'
import {setTotalRecord, addInToTotalRecord, removeFromTotalRecord} from './totalRecordAction';
import requestParam from '../../shared/requestParam';
import {setLoading} from './loadingAction';
import {getFormattedMessage} from '../../shared/sharedMethod';
import {setSavingButton} from "./saveButtonAction";
import { callImportProductApi } from './importProductApiAction';
import axios from 'axios';

export const fetchproducts = (filter = {}, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    let url = apiBaseURL.products;
    if (!_.isEmpty(filter) && (filter.page || filter.pageSize || filter.search || filter.order_By || filter.created_at)) {
        url += requestParam(filter);
    }
    apiConfig.get(url)
        .then((response) => {
            dispatch({type: productActionType.FETCH_products, payload: response.data.data});
            dispatch(setTotalRecord(response.data.meta.total));
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const fetchProduct = (productId, singleProduct, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    apiConfig.get(apiBaseURL.products + '/' + productId, singleProduct)
        .then((response) => {
            dispatch({type: productActionType.FETCH_PRODUCT, payload: response.data.data});
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const addProduct = (product, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true))
    await apiConfig.post(apiBaseURL.products, product)
        .then((response) => {
            dispatch({type: productActionType.ADD_PRODUCT, payload: response.data.data});
            dispatch(addToast({text: getFormattedMessage('product.success.create.message')}));
            navigate('/app/products')
            dispatch(addInToTotalRecord(1))
            dispatch(setSavingButton(false))
        })
        .catch(({response}) => {
            dispatch(setSavingButton(false))
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const editProduct = (productId, product, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true))
    apiConfig.post(apiBaseURL.products + '/' + productId, product)
        .then((response) => {
            navigate('/app/products')
            dispatch(addToast({text: getFormattedMessage('product.success.edit.message')}));
            dispatch({type: productActionType.EDIT_PRODUCT, payload: response.data.data});
            dispatch(setSavingButton(false))
        })
        .catch(({response}) => {
            dispatch(setSavingButton(false))
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const deleteProduct = (productId) => async (dispatch) => {
    apiConfig.delete(apiBaseURL.products + '/' + productId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({type: productActionType.DELETE_PRODUCT, payload: productId});
            dispatch(addToast({text: getFormattedMessage('product.success.delete.message')}));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const fetchAllproducts = () => async (dispatch) => {
    apiConfig.get(`products?page[size]=0`)
        .then((response) => {
            dispatch({type: productActionType.FETCH_ALL_products, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const fetchproductsByWarehouse = (id) => async (dispatch) => {
    apiConfig.get(`products?page[size]=0&warehouse_id=${id}`)
        .then((response) => {
            dispatch({type: productActionType.FETCH_products_BY_WAREHOUSE, payload: response.data.data});
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};

export const addImportProduct= (importProduct) => async (dispatch) => {
    await apiConfig.post(apiBaseURL.IMPORT_PRODUCT, importProduct)
        .then((response) => {
            dispatch(setLoading(false))
            dispatch(callImportProductApi(true))
            // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
            dispatch(addToast({text: 'Product Import Create Success '}));
            dispatch(addInToTotalRecord(1))
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
