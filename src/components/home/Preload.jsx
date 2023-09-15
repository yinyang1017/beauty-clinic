import { shaderMaterial, useTexture, Plane, useScroll, useIntersect } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';

export const LoaderMaterial = shaderMaterial(
    {
        progress: 0,
        color: new THREE.Color('white'),
        opacity: 1,
        grayscale: 0,
        scale: [1, 1],
        imageBounds: [1, 1],
        zoom: 1.15,
        tex: undefined,
        tex2: undefined,
        tex3: undefined,
    },
    /*glsl*/ `
      varying vec2 vUv;
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          vUv = uv;
      }`,
    /*glsl*/ ` 
    
    uniform float progress;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D tex3;
    uniform vec3 color;
    varying vec2 vUv;
    uniform float grayscale;
    uniform vec2 imageBounds;
    uniform float zoom;
    uniform vec2 scale;
    uniform float opacity;
    const int passes = 6;
    const vec2 direction = vec2(1, 1);
    const float smoothness = 0.8;
    const vec3 luma = vec3(.299, 0.587, 0.114);

    vec2 aspect(vec2 size) {
        return size / min(size.x, size.y);
    }

    vec4 firstTransition(vec2 uv) {
        vec4 c1 = vec4(0.0);
        vec4 c2 = vec4(0.0);
    
        float disp = 0.3*(0.5-distance(0.5, progress));
        for (int xi=0; xi<passes; xi++)
        {
            float x = float(xi) / float(passes) - 0.5;
            for (int yi=0; yi<passes; yi++)
            {
                float y = float(yi) / float(passes) - 0.5;
                vec2 v = vec2(x,y);
                float d = disp;
                c1 += texture2D(tex, uv + d*v);
                c2 += texture2D(tex2, uv + d*v);
            }
        }
        c1 /= float(passes*passes);
        c2 /= float(passes*passes);
        return mix(c1, c2, progress);
    }
    
    const vec2 center = vec2(0.5, 0.5);
 
    vec4 secondTransition (vec2 uv) {
        vec2 v = normalize(direction);
        v /= abs(v.x)+abs(v.y);
        float d = v.x * center.x + v.y * center.y;
        float m =
            (1.0-step((progress), 0.0)) * // there is something wrong with our formula that makes m not equals 0.0 with (progress) is 0.0
            (1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d-0.5+(progress)*(1.+smoothness))));
        return mix(texture2D(tex2, uv), texture2D(tex3, uv), m);
    }

    vec4 toGrayscale(vec4 color, float intensity) {
        return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
      }

    
    void main() {

      vec2 s = aspect(scale);
      vec2 i = aspect(imageBounds);
      float rs = s.x / s.y;
      float ri = i.x / i.y;
      vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
      vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
      vec2 uv = vUv * s / new + offset;
      vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);
      if(zoom != 1.00) gl_FragColor = toGrayscale(firstTransition(zUv) * vec4(color, opacity), grayscale);
      else gl_FragColor = toGrayscale(secondTransition(zUv) * vec4(color, opacity), grayscale);
    
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
    `
);

extend({
    LoaderMaterial,
});

export const Preload = ({ callback }) => {
    const [texture1, texture2, texture3] = useTexture([
        "/logo.jpg",
        "/assets/img/b-top_menu_02.jpg",
        "/assets/img/b-top_menu_01.jpg",
    ]);
    const ref = useRef();
    const middle = useRef(false);
    const end = useRef(false);
    const scroll = useScroll();
    useFrame((state, delta) => {
        ref.current.opacity = THREE.MathUtils.damp(ref.current.opacity, 1.0 - scroll.range(0.04, 0.04005), 10, delta);
        if (end.current === false) {
            if (ref.current.progress >= 0.995) {
                if (ref.current.zoom === 1.0) end.current = true;
                else middle.current = true;
            }
            if (ref.current.zoom < 1.004 && middle.current == true) {
                ref.current.zoom = 1.00;
                middle.current = false;
                ref.current.progress = 0.0;
            }
            if (middle.current == false) ref.current.progress = THREE.MathUtils.damp(ref.current.progress, 1.00, 2, delta);
            if (middle.current == true) ref.current.zoom = THREE.MathUtils.damp(ref.current.zoom, 1.0, 0.8, delta);
        }
        else {
            callback(true);
        }

    })

    return (
        <>
            <Plane args={[25, 25]} position={[0, 0, 0]}>
                <loaderMaterial
                    ref={ref}
                    scale={[25, 25]}
                    tex={texture1}
                    tex2={texture2}
                    tex3={texture3}
                    toneMapped={false}
                    transparent={true}
                />
            </Plane>
        </>
    )
}