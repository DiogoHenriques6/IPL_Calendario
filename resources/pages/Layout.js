import React from 'react';
import {Outlet} from 'react-router-dom';
import HeaderMenu from '../components/Menu';
import Footer from "../components/Footer";

const Layout = () => {
    const updateLang = (lang) =>{
        console.log(lang);
    }
    return (
        <>
            <HeaderMenu/>
            <div className={'app-content'}>
                <Outlet/>
            </div>
            <Footer languageChanger={updateLang} />
        </>
    );
};

export default Layout;
