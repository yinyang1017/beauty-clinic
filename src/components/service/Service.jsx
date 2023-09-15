import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { useSpring, animated, config } from 'react-spring';
import { Image, useScroll } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Item = ({ select, opacity, pointer }) => {
    const { width: w, height: h } = useThree((state) => state.viewport);
    const ref = useRef();
    const scroll = useScroll();

    useFrame((state, delta) => {
        let t = scroll.offset, p;

        if (w > 12.025) {
            p = 300;
        } else {
            p = -500;
        }

        ref.current.children.map((val, idx) => {
            if (idx != select.current) val.material.opacity = THREE.MathUtils.damp(val.material.opacity, 0, 10, delta);
            else val.material.opacity = THREE.MathUtils.damp(val.material.opacity, 0.6, 6, delta);
        })

        ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, (pointer[0] - window.innerWidth / 2) / 80 + 2, 4, delta);
        ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, -(pointer[1] - (window.innerWidth / 2) + p * window.innerWidth / 1366) / 80 - (t - 0.36606127792713907) * 120, 4, delta);

    })

    return (
        <group ref={ref} position={[0, 0, -3]}>
            <Image transparent url={"/assets/img/service_01.jpg"} scale={[w / 2, h / 2, 0]} position={[0, 0, -3]} style={{ transition: "all 100ms" }} />
            <Image transparent url={"/assets/img/service_02.jpg"} scale={[w / 2, h / 2, 0]} position={[0, 0, -3]} style={{ transition: "all 100ms" }} />
            <Image transparent url={"/assets/img/service_03.jpg"} scale={[w / 2, h / 2, 0]} position={[0, 0, -3]} style={{ transition: "all 100ms" }} />
            <Image transparent url={"/assets/img/service_04.jpg"} scale={[w / 2, h / 2, 0]} position={[0, 0, -3]} style={{ transition: "all 100ms" }} />
        </group>

    )
}

export const Service = () => {

    const services = ["美容サロン", "美容商品開発、 販売", "美容サロン施術コンサルティング", "美容サロン経営コンサルティング"];

    const ref = useRef();
    const [hoveredOne, hoverOne] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [pointer, setPointer] = useState([0, 0]);
    const [select, setSelect] = useState({ prev: null, current: null });

    const style = useSpring({
        opacity: hoveredOne ? 0.5 : 1,
        config: config.default
    });

    window.onmousemove = (e) => {
        setPointer([e.pageX, e.pageY]);
    }

    return (
        <section className="service">
            <h1 className="heading">SERVICES</h1>
            <h3 className="sub-heading">私たちの奉仕</h3>
            <div className="service-content">
                <div className="category">
                    <h4>美まつげ、美肌のお手伝いをさせていただきます</h4>
                    <p>静かな田舎町にある完全貸切のプライベート空間で月に一度の美メンテナンスを！癒しの音楽とアロマの香りに包まれた隠れ家サロン。忙しい女性に綺麗と癒しを提供する為に、通いやすい価格と丁寧な施術を心がけております。</p>
                </div>
                <div className='menu' onMouseOver={() => hoverOne(true)} onMouseOut={() => hoverOne(false)}>
                    {services.map((val, idx) => (
                        <animated.a style={style} className="menu-item" key={idx} onMouseOver={() => { setSelect({ prev: select.current, current: idx }); setIsDragging(true); }} onMouseOut={() => { setSelect({ prev: select.current, current: null }); setIsDragging(false); }}>
                            <p style={{ fontSize: "1.2rem" }}>{idx < 9 ? "0" + (idx + 1) : idx + 1}</p>
                            <p>{val}</p>
                            <span>→</span>
                        </animated.a>
                    ))
                    }

                </div>
                <Canvas position={[0, 100, 0]} style={{ position: 'absolute', zIndex: -1, top: "5%", width: "100%", height: "130%", transition: "all 100ms" }}>
                    <Item select={select} opacity={isDragging ? 0.5 : 0} pointer={pointer} />
                </Canvas>
            </div>
        </section>
    )
}