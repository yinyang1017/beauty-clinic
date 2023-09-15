import { AboutText, AboutImage } from './about/About';
import { Service } from './service/Service';
import { CaseImage, CaseText, CaseGallery } from './case/Case';
import { RecruitText } from './recruit/Recruit';
import { Footer } from './footer/Footer';
import { Scroll } from '@react-three/drei';

import "./main.style.css";

export const Main = () => {

    return (
        <>
            <Scroll>
                <AboutImage />
                <CaseImage />
                <CaseGallery />
            </Scroll>
            <Scroll html style={{ width: '100%' }}>
                <AboutText />
                <Service />
                <CaseText />
                <RecruitText />
                <Footer />
            </Scroll>
        </>
    )
}