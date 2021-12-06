import { NextPage } from 'next';
import React from 'react';
import style from '~/styles/home.module.scss';

const Index: NextPage = () => {
    return (
        <>
            <h3 className={`${style.title}`}>this is a demo site. V2</h3>
            <div>With github workflow</div>
        </>
    );
};

export default Index;
