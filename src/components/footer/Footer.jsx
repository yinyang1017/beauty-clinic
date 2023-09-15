import { useSpring, animated, config } from 'react-spring';
import './style.css';
import { useState } from 'react';


export const Footer = () => {

    const items = ["ABOUT", "SERVICE", "CASE", "RECRUIT", "CONTACT"];

    const [hovered, hover] = useState(false);
    const style = useSpring({
        opacity: hovered ? 0.4 : 1,
        config: config.wobbly
    });

    const [hovered2, hover2] = useState(false);
    const style2 = useSpring({
        opacity: hovered2 ? 0.5 : 1,
        config: config.wobbly
    });

    return (
        <section className="footer">
            <div className="footer-logo">
                <h2 className="sub-heading">BEAUTY CLINIC</h2>
                <p className="address">
                    Sakae Toei building 5F , 3-7-12<br />
                    Sakae, Naka-ku, Nagoya, Aichi<br />
                    460-0008, Japan
                </p>
            </div>
            <div className="footer-menu">
                <ul>
                    {items.map((val, idx) => {
                        return (<li key={idx} ><animated.a style={style} className='footer-item' onMouseOver={() => hover(true)} onMouseOut={() => hover(false)}>{val}</animated.a></li>)
                    })}
                </ul>
            </div>
            <div className='contact'>
                <animated.a style={style2} onMouseOver={() => hover2(true)} onMouseOut={() => hover2(false)}><span className='fa fa-phone'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;052 228 9007</animated.a>

                <div className='follow'>
                    <span className="text">SHARE</span>
                    <a><span className="fa fa-facebook-square"></span></a>
                    <a><span className='fa fa-twitter'></span></a>
                </div>

                <div className='follow' style={{ paddingTop: "1rem" }}>
                    <span className="text">FOLLOW US</span>
                    <a><span className="fa fa-instagram"></span></a>
                </div>
            </div>
        </section>)

}