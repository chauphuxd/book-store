import React from 'react';
import './footer.scss';
import { AiOutlineTwitter, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const AppFooter = () => {
    return (
        <footer className="footer">
            <div className="container">
                <h2 className="logo">Book Store</h2>
                <ul className="menu">
                    <li><a href="#">HOME</a></li>
                    <li><a href="#">AGENT</a></li>
                    <li><a href="#">ABOUT</a></li>
                    <li><a href="#">LISTING</a></li>
                    <li><a href="#">BLOG</a></li>
                    <li><a href="#">CONTACT</a></li>
                </ul>
                <div className="social-icons">
                    <a href="#"><FaTwitter /></a>
                    <a href="https://www.facebook.com/phu.tran.244255" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a href="https://www.instagram.com/tr_uhp/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                </div>
                <p className="copyright">
                    Copyright ©2025 All rights reserved | This page is made with <span>♥</span> by Phu Tran
                </p>
            </div>
        </footer>
    );
};

export default AppFooter;