import React, {useEffect, Suspense} from 'react';
import {ToastContainer} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {Provider as StoreProvider} from 'react-redux';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import "./locales/i18n";

import store from './redux/store';

import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

import RoutesList from './routes';
import PageLoader from "./components/PageLoader";

axios.defaults.baseURL = process.env.MIX_APP_API_URL;

let selectedLanguage = localStorage.getItem('language');
if(selectedLanguage === null){
    selectedLanguage = "pt";
    localStorage.setItem('language', selectedLanguage);
}

axios.interceptors.request.use((config) => {
    config.headers.lang = selectedLanguage;
    if (!config.url.includes('login')) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
    }
    return config;
});

axios.interceptors.response.use(
    (res) => res,
    (error) => {
        if (
            (error?.response?.status === 401 || jwtDecode(localStorage.getItem('authToken')).exp < Date.now() / 1000)
            && !error.response.config.url.includes('login')
        ) {
            localStorage.removeItem('authToken');
            window.location = '/login';
            return;
        }
        return error;
    }
);

function App() {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    useEffect(() => {
        if(authToken && window.location.pathname !== '/login') {
            axios.get('/permissions').then((res) => {
                if (res.status === 200) {
                    localStorage.setItem('scopes', JSON.stringify(res.data));
                }
            });
        }
    }, [authToken]);
    useEffect(() => {
        if (!authToken) {
            navigate('/login');
        } else if (jwtDecode(authToken).exp < Date.now() / 1000) {
            navigate('/login');
        }
    }, [authToken, navigate]);
    return (
        <StoreProvider store={store}>
            <ToastContainer/>
            <Suspense fallback={<PageLoader />}>
                <RoutesList isLoggedIn={authToken}/>
            </Suspense>
        </StoreProvider>
    );
}

export default App;
