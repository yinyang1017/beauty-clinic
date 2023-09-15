import { useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Image, useIntersect } from '@react-three/drei';
import { useSpring, animated, config } from 'react-spring';
import * as THREE from 'three';

import 'font-awesome/css/font-awesome.min.css';
import './style.css';

const Item = () => {

    const visible = useRef(false);
    const [hovered, hover] = useState(false);
    const ref = useIntersect((isVisible) => (visible.current = isVisible))
    const { width, height } = useThree((state) => state.viewport);
    // console.log("width = ", width, "height = ", height);
    useFrame((state, delta) => {
        ref.current.material.zoom = THREE.MathUtils.damp(ref.current.material.zoom, visible.current ? (hovered ? 1.15 : 1) : 2, 4, delta);
    })

    return (
        <Image ref={ref} url="/assets/img/recruit.jpg" scale={[18, 8, 0]} position={[0, 0, -1.5]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} />
    )

}

export const RecruitText = () => {

    const [hover, setHover] = useState(false);

    const style = useSpring({
        fontSize: hover ? "1.5rem" : '1.4rem',
        opacity: hover ? 0.8 : 1,
        config: config.wobbly
    });
    return (
        <section className="recruit">
            <div style={{ background: "url('./recruit.png')" }}>
                <h1 className="heading">RECRUIT</h1>
                <h2 className="sub-heading">求人</h2>
                <div className="recruit-content">
                    <p style={{ marginBottom: "5rem" }}>現在、以下の求人を募集しております。求人の詳細情報は各求人ページをご確認ください。</p>
                    <div className="recruit-card">
                        <div className="left">
                            <Canvas style={{ width: "800px", height: '400px' }}>
                                <Item />
                            </Canvas>
                        </div>
                        <div className="right">
                            <div className="box">
                                <a className="job">
                                    [正社員]まつ毛美容師
                                </a>

                                <div className="job-desc">

                                    <div className="desc-item">
                                        <p className="desc-key">
                                            <span className='fa fa-cny'> </span>
                                        </p>
                                        <p className='desc-value'>
                                            月給240,000円〜300,000円
                                        </p>
                                    </div>

                                    <div className="desc-item">
                                        <p className="desc-key">
                                            <span className='fa fa-clock-o'></span>
                                        </p>
                                        <p className='desc-value' style={{ marginLeft: "-4px" }}>
                                            9:30〜18:00（実働7時間30分⋯
                                        </p>
                                    </div>


                                </div>

                            </div>
                            <animated.button className='btn recruit-btn' style={style} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>詳細をみる</animated.button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
