import { httpService } from './';
import { apiUrl, phoneCode } from '../config';

export const userService = {
    register,
    viewProfile,
    changePassword,
    updateEmail,
    updateMobile,
    updateAddress,
    getReviewsAsSeller,
    getReviewsAsBuyer,
    getReviewsForOthers,
    getUserIDByNationalId,
    getIsUserVerifiedBylId,
};

const apiEndpoint = apiUrl + '/users';
const getUserIdEndpoint = apiEndpoint + '/user';
const settingsApiEndpoint = apiEndpoint + '/settings';
const viewProfileApiEndpoint = settingsApiEndpoint + '/personal';
const changePasswordApiEndpoint = settingsApiEndpoint + '/password';
const updateEmailApiEndpoint = settingsApiEndpoint + '/email';
const updateMobileApiEndpoint = settingsApiEndpoint + '/mobile';
const updateAddressApiEndpoint = settingsApiEndpoint + '/address';

const reviewsApiEndpoint = apiUrl + '/review';
const getReviewsAsSellerApiEndpoint = reviewsApiEndpoint + '/seller';
const getReviewsAsBuyerApiEndpoint = reviewsApiEndpoint + '/buyer';
const getReviewsForOthersApiEndpoint = reviewsApiEndpoint + '/left';

function register(user) {
    const userData = { ...user };
    userData.phone = {
        code: phoneCode,
        number: user.phone,
    };

    return httpService.post(apiEndpoint, userData);
}

function viewProfile() {
    return httpService.get(viewProfileApiEndpoint);
}

function changePassword(oldPassword, newPassword) {
    return httpService.put(changePasswordApiEndpoint, {
        oldPassword,
        newPassword,
    });
}

function updateEmail(emailAddress) {
    return httpService.put(updateEmailApiEndpoint, {
        address: emailAddress,
    });
}

function updateMobile(code, mobile) {
    return httpService.put(updateMobileApiEndpoint, {
        code,
        mobile,
    });
}

function updateAddress(address) {
    return httpService.put(updateAddressApiEndpoint, {
        address,
    });
}

function getReviewsAsSeller(id) {
    return httpService.get(getReviewsAsSellerApiEndpoint + '/' + id);
}

function getReviewsAsBuyer(id) {
    return httpService.get(getReviewsAsBuyerApiEndpoint + '/' + id);
}

function getReviewsForOthers(id) {
    return httpService.get(getReviewsForOthersApiEndpoint + '/' + id);
}

function getUserIDByNationalId(nationalId) {
    return httpService.get(getUserIdEndpoint + '/' + nationalId);
}

function getIsUserVerifiedBylId(userId) {
    return httpService.get(getUserIdEndpoint + '/isVerified/' + userId);
}
