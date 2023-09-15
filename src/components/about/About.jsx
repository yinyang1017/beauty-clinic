import { useRef, useState } from 'react';
import { config, useSpring, animated } from 'react-spring';

import './style.css';
import { useIntersect, Image } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const AboutText = () => {
    const [hover, setHover] = useState(false);

    const style = useSpring({
        fontSize: hover ? "1.9rem" : '2rem',
        opacity: hover ? 0.8 : 1,
        config: config.wobbly
    });

    return (
        <section className="about">
            <h1 className="heading" style={{ textAlign: "left" }}>ABOUT</h1>
            <h3 className="sub-heading" style={{ textAlign: "left" }}>私たちに関しては</h3>
            <div className="content"><span style={{ fontSize: "1.8rem", fontWeight: "600", lineHeight: "6rem" }}>私は、私が変えていく</span><br />
                大人の女性の、内なる美しさ。<br />
                華美ではなく自然に醸し出る美しさ。 <br />
                それは日々の健康と心の安寧から生まれる。<br />
                だれかに褒められたい、認められたい、ではなく、<br />
                あなたはあなた自身の人生を、自信をもって生きてゆこう。<br />
                この日を、この季節を、美しく、ポジティブに。<br />
                堂々と笑ってすごせるように。</div>
            <animated.button className="btn about-btn" style={style} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>VIEW MORE</animated.button>
        </section>
    )
};

const Item = ({ url, scale, ...props }) => {
    const visible = useRef(false);
    const [hovered, hover] = useState(false);
    const ref = useIntersect((isVisible) => (visible.current = isVisible))
    const { height } = useThree((state) => state.viewport);

    useFrame((state, delta) => {
        ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, visible.current ? 1 : -height / 8, 4, delta);
        ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? (hovered ? 1.15 : 1) : 2, 4, delta);
    })

    return (
        <group {...props}>
            <Image ref={ref} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} scale={scale} url={url} />
        </group>
    )
}

export const AboutImage = () => {
    const ref = useRef();
    const { width: w, height: h } = useThree((state) => state.viewport);

    useFrame((state) => {
        if (w < 15) {
            if (w < 9) {
                ref.current.children[0].position.x = -20;
                ref.current.children[1].position.x = 2.8;
                ref.current.children[2].position.x = 2.5;
                ref.current.children[1].position.y = -h - 6;
            }
            else {
                ref.current.children[1].position.y = -h - 8;
                ref.current.children[0].position.x = -20;
                ref.current.children[1].position.x = w / 7.5;
                ref.current.children[2].position.x = w / 3;

            }
        }
        else {
            ref.current.children[0].position.x = -7.15;
            ref.current.children[1].position.x = 3.8;
            ref.current.children[2].position.x = 8;
        }
    })
    return (
        <group ref={ref}>
            <Item url="/assets/img/about_01.jpg" scale={[8, 8, 1]} position={[-7.15, -h - 4, 0]} />
            <Item url="/assets/img/about_03.jpg" scale={[4, 4, 1]} position={[3.8, -h - 8, 0]} />
            <Item url="/assets/img/about_02.jpg" scale={[6, 6, 1]} position={[8, -h, 0]} />
        </group>
    )
};