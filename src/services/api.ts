import axios from "services/axios.customize"


export const loginAPI = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/auth/login"
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, values, {
        headers: {
            delay: 1000
        }
    })
}
export const registerAPI = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/user/register"
    return axios.post<IBackendRes<IRegister>>(urlBackEnd, values)
}

export const fetchAccountAPI = () => {
    const urlBackEnd = "/api/v1/auth/account"
    return axios.get<IBackendRes<IFetchAccount>>(urlBackEnd, {
        headers: {
            delay: 1000
        }
    })
}

export const refreshAccountAPI = () => {
    const urlBackEnd = "/api/v1/auth/refresh"
    return axios.get<IBackendRes<IRefreshAccount>>(urlBackEnd,)
}

export const logoutAPI = () => {
    const urlBackEnd = "/api/v1/auth/logout"
    return axios.post<IBackendRes<IRegister>>(urlBackEnd)
}


//API UER

export const getUserAPI = (query: string) => {
    const urlBackEnd = `/api/v1/user?${query}`
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackEnd)
}

export const createUserAPI = (values: { [key: string]: any }) => {
    const urlBackEnd = "/api/v1/user"
    return axios.post<IBackendRes<IRegister>>(urlBackEnd, values)
}


export const createUserBulkAPI = (values: {
    fullName: string,
    password: string,
    email: string,
    phone: string
}[]) => {
    const urlBackEnd = "/api/v1/user/bulk-create"
    return axios.post<IBackendRes<IResponeImport>>(urlBackEnd, values)
}


export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
    const urlBackEnd = "/api/v1/user"
    return axios.put<IBackendRes<IRegister>>(urlBackEnd, { _id, fullName, phone })
}


export const deleteUserAPI = (_id: string) => {
    const urlBackEnd = `/api/v1/user/${_id}`
    return axios.delete<IBackendRes<IRegister>>(urlBackEnd)
}

//API BOOK

export const getBookAPI = (query: string) => {
    const urlBackEnd = `/api/v1/book?${query}`
    return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackEnd, {
        headers: {
            delay: 500
        }
    })
}

export const getCategoryAPI = () => {
    const urlBackEnd = "/api/v1/database/category";
    return axios.get<IBackendRes<string[]>>(urlBackEnd)
}


export const uploadFileAPI = (fileImg: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);

    return axios<IBackendRes<{
        fileUploaded: string
    }>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": folder
        }
    });
}


export const createBookAPI = (
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[]
) => {
    const urlBackEnd = "/api/v1/book"
    return axios.post<IBackendRes<IRegister>>(urlBackEnd, { mainText, author, price, quantity, category, thumbnail, slider })
}


export const updateBookAPI = (
    _id: string,
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: string,
    slider: string[]
) => {
    const urlBackend = `/api/v1/book/${_id}`;
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        mainText,
        author,
        price,
        quantity,
        category,
        thumbnail,
        slider
    });
}


export const deleteBookAPI = (_id: string) => {
    const urlBackEnd = `/api/v1/book/${_id}`
    return axios.delete<IBackendRes<IRegister>>(urlBackEnd)
}



export const getDetailBookAPI = (id: string) => {
    const urlBackEnd = `/api/v1/book/${id}`
    return axios.get<IBackendRes<IBookTable>>(urlBackEnd, {
        headers: {
            delay: 1000
        }
    })
}


export const createOrderAPI = (
    name: string,
    address: string,
    phone: string,
    totalPrice: number,
    type: string,
    detail: any
) => {
    const urlBackend = "/api/v1/order";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {
        name,
        address,
        phone,
        totalPrice,
        type,
        detail
    });
};


export const getHistoryAPI = () => {
    const urlBackEnd = `/api/v1/history/`
    return axios.get<IBackendRes<IHistory>>(urlBackEnd)
}


export const updateUserInfoAPI = (
    _id: string,
    avatar: string,
    fullName: string,
    phone: string
) => {
    const urlBackend = "/api/v1/user";
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        fullName,
        phone,
        avatar,
        _id,
    });
};


export const updateUserPasswordAPI = (
    email: string,
    oldpass: string,
    newpass: string
) => {
    const urlBackend = "/api/v1/user/change-password";
    return axios.post<IBackendRes<IRegister>>(urlBackend, {
        email,
        oldpass,
        newpass,
    });
};


export const getOrdersAPI = (query: string) => {
    const urlBackend = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrderTable>>>(urlBackend);
};

export const getDashboardAPI = () => {
    const urlBackend = `/api/v1/database/dashboard`;
    return axios.get<IBackendRes<{
        countOrder: number;
        countUser: number;
        countBook: number;
    }>>(urlBackend);
};

