import { NextPage } from 'next';
import React from 'react';
import style from '~/styles/home.module.scss';

const Index: NextPage = () => {
    return (
        <>
            <h3 className={`${style.title}`}>this is a demo site.</h3>
            <div> it includes a basic setting for development</div>
        </>
    );
};

export default Index;
