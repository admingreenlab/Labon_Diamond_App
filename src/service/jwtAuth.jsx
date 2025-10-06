import jwtAxios from "axios";
import { BACKEND_APP_URL } from '../config';

export const baseURL = 'https://labonstkback.labon.diamonds'


const Axios = jwtAxios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// const Axios = jwtAxios.create({
//   // baseURL: 'http://192.168.6.32:4747/',
//    ,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const Axios = jwtAxios.create({
//  baseURL: BACKEND_APP_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });



Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('token'); // Check both storages
    const branchescode = localStorage.getItem('branches') || localStorage.getItem('branches')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (branchescode) {
      config.headers.ccode = JSON.parse(branchescode)[0].FL_COMPANY_CODE;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("branches");
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export const setAuthToken = (data, isRememberMe) => {
  console.log(data);
  if (data) {
    Axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;

    if (isRememberMe) {
      localStorage.setItem("token", data.token); // Store in localStorage for long-term
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("branches", JSON.stringify(data.branches));
    } else {
      localStorage.setItem("token", data.token); // Store in sessionStorage for session-only
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("branches", JSON.stringify(data.branches));
    }


  } else {
    delete Axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
    localStorage.removeItem("token"); // Clear session storage as well
    localStorage.removeItem("user");
    localStorage.removeItem("user");
  }
};

export default Axios;