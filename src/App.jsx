import { ScrollControls, useProgress } from '@react-three/drei';
import { Suspense, createContext, useState, } from 'react';
import { Canvas } from '@react-three/fiber'
import { Main } from './components/Main';
import { Index } from './components/home/Index';
import Navbar from './components/navbar/Navbar';
import { Preload } from './components/home/Preload';

import './App.css';
import { useSpring, animated } from 'react-spring';

const Loader = () => {
    const progress = useProgress((state) => state.progress);
    const style = useSpring({
        opacity: progress < 100 ? 1 : 0
    });
    return (
        <animated.div className='loader' style={style}>
            <h1 style={{ fontFamily: "'Noto Sans JP' serif", fontSize: "10rem", color: "#ffff", letterSpacing: "3px", fontWeight: "300" }}>{progress.toFixed(0)}</h1>
        </animated.div>
    )
}

const MainApp = () => {

    const [main, setMain] = useState(false);
    return (

        <Canvas orthographic camera={{ zoom: 80 }} gl={{ alpha: false, antialias: false }} dpr={[1, 1.5]} style={{ position: "fixed", top: "0", bottom: "0" }}>
            <color attach="background" args={['#f0f0f0']} />

            <ScrollControls damping={0.15} pages={8}>
                <Preload callback={setMain} />
                {main && <Index />}
                {main && <Navbar />}
                <Main />

            </ScrollControls>
        </Canvas>

    )
}

const App = () => {

    return (

        <>
            <Suspense fallback={<Loader />}>

                <MainApp />

            </Suspense>
        </>
    )
}

export default App;