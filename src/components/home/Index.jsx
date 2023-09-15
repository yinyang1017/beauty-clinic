import { shaderMaterial, useTexture, Plane, useScroll } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';

export const ImageFadeMaterial = shaderMaterial(
    {
        effectFactor: 0.1,
        dispFactor: 0,
        color: new THREE.Color('white'),
        opacity: 1,
        grayscale: 0,
        tex: undefined,
        tex2: undefined,
    },
    /*glsl*/ `
      varying vec2 vUv;
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          vUv = uv;
      }`,
    /*glsl*/ ` 
    
    uniform float dispFactor;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform vec3 color;
    varying vec2 vUv;
    uniform float grayscale;
    uniform float opacity;
    const vec3 luma = vec3(.299, 0.587, 0.114);

    vec2 offset(float dispFactor, float x, float theta) {
      float phase = dispFactor*dispFactor + dispFactor + theta;
      float shifty = 0.014*dispFactor*cos(5.0*(dispFactor+x));
      return vec2(0, shifty);
    }
  
    vec4 toGrayscale(vec4 color, float intensity) {
        return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
      }

    vec4 transition(vec2 p) {
      return mix(texture2D(tex, p + offset(dispFactor, p.x, 0.0)),
                 texture2D(tex2, p + offset(1.0 - dispFactor, p.x, 3.14)),
                 dispFactor);
    }
  
    void main() {
      gl_FragColor = toGrayscale(transition(vUv) * vec4(color, opacity), grayscale);
    
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
    `
);

extend({
    ImageFadeMaterial,
});

export const Index = () => {
    const [texture1, texture2] = useTexture([
        "/assets/img/b-top_menu_01.jpg",
        "/assets/img/b-top_menu_02.jpg",
    ]);
    const { width, height } = useThree((state) => state.viewport);
    const ref = useRef();
    const [start, setStart] = useState(false);
    const [middle, setMiddle] = useState(false);
    const scroll = useScroll();
    useFrame((state, delta) => {
        // console.log(scroll.offset);
        ref.current.opacity = THREE.MathUtils.damp(ref.current.opacity, 1.0 - scroll.range(0.04, 0.04005), 10, delta);
        if (start === false && middle === false) {

            if (Math.abs(scroll.offset - 0.0015) < 0.0005) setStart(true);

        }

        else if (start === true && middle === false) {
            if (ref.current.dispFactor > 0.98) {
                setStart(false);
                setMiddle(true);
            }
            else {
                ref.current.dispFactor = THREE.MathUtils.damp(ref.current.dispFactor, 1, 2.3, delta);

            }
        }

        else if (start === false && middle === true) {
            if (ref.current.dispFactor < 0.0005) {
                setMiddle(false);
                ref.current.dispFactor = 0;
            }
            else {

                ref.current.dispFactor = THREE.MathUtils.damp(ref.current.dispFactor, 0, 2.3, delta);
            }
        }

        // if (data.offset == 0 && ref.current.material.uniforms.dispFactor === 0) setStart(true);
        // if (start == true && ref.current.material.uniforms.dispFactor == 1) {
        //     start = false;
        // }
        // ref.current.material.uniforms.dispFactor = THREE.MathUtils.damp(ref.current.material.uniforms.dispFactor, start ? 1.0 : 0, 4, delta);


    })

    return (
        <>
            <Plane args={[25, 25]} position={[0, 0, 0]}>
                <imageFadeMaterial
                    ref={ref}
                    tex={texture1}
                    tex2={texture2}
                    toneMapped={false}
                    transparent={true}
                />
            </Plane>
        </>
    )
}