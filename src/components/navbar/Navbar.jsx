import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring, config } from 'react-spring';
import logo from './logo.svg';
import { useScroll, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

import './style.css';

const NavItem = ({ name, ...props }) => {
    return (
        <li>
            <a className="nav-link" {...props}>{name}</a>
        </li>
    )
}

const Navbar = () => {

    const { width: w } = useThree();

    const navRef = useRef();
    const prevScroll = useRef(null);
    const [white, setWhite] = useState(true);
    const [visible, toggle] = useState(true);
    const [hovered, hover] = useState(false);
    const items = ["HOME", "ABOUT", "SERVICE", "CASE", "RECRUIT", "CONTACT"];
    const AnimatedNavItem = animated(NavItem);
    const data = useScroll();

    const [{ y, opacity }, api] = useSpring(() => ({
        y: 0,
        opacity: 1,
        config: config.wobbly,
        color: "white"
    }));

    const styles = useSpring({
        color: white ? "#ffffff" : "#586166"
    });

    const style = useSpring({
        opacity: hovered ? 0.3 : 1
    });

    useEffect(() => {
        api.start({
            y: visible ? 25 : -25,
            opacity: visible ? 1 : 0
        });
    }, [visible])



    useFrame(() => {
        let delta = data.range(0, 1);
        if (data.offset > 0.09) setWhite(false);
        else setWhite(true);
        if (prevScroll.current === null) prevScroll.current = delta;
        if (delta - prevScroll.current != 0) {
            if (delta - prevScroll.current > 0) toggle(false);
            else toggle(true);
        }
        prevScroll.current = delta;
    })

    return (

        <Html as="div" style={{ width: "98vw", position: 'fixed' }} position={[-w / 2, 0, 0]} ref={navRef}>
            <animated.nav className="header-nav" style={{ transform: y.to((value) => `translateY(${value}px)`), opacity: opacity }}>
                <img src={logo} />
                <animated.div className="nav-container" style={styles}>
                    <h1>Beauty Clinic</h1>
                    <ul className="nav-bar">
                        {items.map((item, idx) => <AnimatedNavItem key={idx} name={item} style={style} onMouseOver={() => hover(true)} onMouseOut={() => hover(false)} />)}
                    </ul>
                </animated.div>
            </animated.nav >
        </Html>

    )
};

export default Navbar;