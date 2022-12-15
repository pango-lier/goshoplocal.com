import { omit } from 'lodash';

export const STORAGE_CONSTANTS = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	USER_DATA: 'userData',
	PARAMS: 'params',
};

export const setStorageData = (key, data) => {
	if (key === STORAGE_CONSTANTS.USER_DATA)
		localStorage.setItem(key, JSON.stringify(omit(data, ['__typename'])));
	else if (key === STORAGE_CONSTANTS.PARAMS) localStorage.setItem(key, JSON.stringify(data));
	else localStorage.setItem(key, data);
};

export const getStorageData = (key) => {
	return localStorage.getItem(key);
};

export const removeStorageData = (key) => {
	return localStorage.removeItem(key);
};

export const clearStorageData = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('userData');
};
