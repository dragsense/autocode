import React, { useState, useEffect } from 'react';

const GoToTopButton =
    (props) => {
        const {
            children,
            states,
            element,
            node,
        } = props;

        const [isVisible, setIsVisible] = useState(false);

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsVisible(scrollTop > 0);
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        };

        useEffect(() => {
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, []);

        return isVisible && <span onClick={scrollToTop}>{
            element(node, children)}
        </span>

    };

export default GoToTopButton;