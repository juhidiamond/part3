import Cookies from 'js-cookie';
const USER_API_URL = "http://localhost:8080/users/";
const DOC_API_URL = "http://localhost:8081/uploads/";
const CHAT_API_URL = "http://localhost:8082/chats/";

export const RegisterUser = async (user)=>{
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await fetch(`${USER_API_URL}add`, {
            method: 'POST',
            ...config,
            body: JSON.stringify(user),
        });
        const data = await response.json();
        return {data, status: response.status};
    } catch (error) {
        
    }
}

export const getToken = () => {
    return Cookies.get('token');
}

export const LoginUser = async (logindata) => {
    const response = await fetch(`${USER_API_URL}login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logindata)
    });
    return await response.json();
  };
  
  
  export const getLoggedInUser = async () => {
    const token = getToken()
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch(`${USER_API_URL}get_login_user`, config);
        if (response.status === 403 || response.status===401) {
            return
        }
        return await response.json()
    } catch (error) {
        
    }
}

export const deleteLoggedInUser = () => {
    Cookies.remove('token');
    return null
}

export const UserList = async () => {
    const token = getToken()
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${USER_API_URL}getall`, config);
    return await response.json();
  };

 export const DeleteUser = async (id) => {
    const token = getToken()
    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${USER_API_URL}delete/${id}`, config);
    return await response.json();
 } 

 export const UserById = async (id) => {
    const token = getToken()
    const config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${USER_API_URL}getUser/${id}`, config);
    return await response.json();
 }
 
 export const UpdateUser = async (id,UserInfo) =>{
    const token = getToken()
    const config = {
        method:'PUT',
        body: JSON.stringify(UserInfo),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${USER_API_URL}${id}`, config);
    return await response.json();
 }

 //Document List
 export const DocumentList = async () => {
    const token = getToken()
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${DOC_API_URL}getall`, config);
    return await response.json();
  };

  export const UpdateDocument = async (id,label) =>{
    const token = getToken()
    const config = {
        method:'PUT',
        body: JSON.stringify(label),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${DOC_API_URL}${id}`, config);
    return await response.json();
 }

 export const DeleteDocument = async (id) => {
    const token = getToken()
    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`${DOC_API_URL}delete/${id}`, config);
    return await response.json();
 }

 export const AddDocument = async (label,fileinfo) => {
    const formData = new FormData();
    formData.append('label', label);
    formData.append('file', fileinfo);
    //console.log(fileinfo);
    const token = getToken();
    const config = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };
    const response = await fetch(`${DOC_API_URL}add`, config);
    return await response.json();
  };

  //Chat Services
  export const getAllChats = async()=>{
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await fetch(`${CHAT_API_URL}getall`, config);
    return await response.json(); 
  }


  export const AddChats = async(message)=>{
    const token = getToken();
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
    };
    const response = await fetch(`${CHAT_API_URL}add`, config);
    return await response.json(); 
  }

