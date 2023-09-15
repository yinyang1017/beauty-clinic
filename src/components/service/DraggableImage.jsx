import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { useSpring, animated } from "react-spring";

function DraggableImage(props) {
    const { src, width, height, sectionId } = props;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }));

    useEffect(() => {
        const container = containerRef.current;

        function handlePointerDown(event) {
            if (event.target.closest(`#${sectionId}`)) {
                setIsDragging(true);
            }
        }

        function handlePointerMove(event) {
            if (isDragging) {
                const { clientX, clientY } = event;
                const rect = container.getBoundingClientRect();
                const x = ((clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((clientY - rect.top) / rect.height) * 2 + 1;
                set({ x, y });
            }
        }

        function handlePointerUp(event) {
            setIsDragging(false);
        }

        container.addEventListener("pointerdown", handlePointerDown);
        container.addEventListener("pointermove", handlePointerMove);
        container.addEventListener("pointerup", handlePointerUp);

        return () => {
            container.removeEventListener("pointerdown", handlePointerDown);
            container.removeEventListener("pointermove", handlePointerMove);
            container.removeEventListener("pointerup", handlePointerUp);
        };
    }, [sectionId, isDragging]);

    return (
        <div ref={containerRef} id={sectionId} style={{ position: "relative" }}>
            <Canvas
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    cursor: isDragging ? "grabbing" : "grab",
                }}
            >
                <animated.mesh position={[x, y, 0]}>
                    <Plane args={[width, height]}>
                        <meshBasicMaterial attach="material">
                            <canvasTexture
                                attach="map"
                                image={canvasRef.current}
                                premultiplyAlpha={false}
                                onUpdate={(texture) => {
                                    texture.needsUpdate = true;
                                }}
                            />
                        </meshBasicMaterial>
                    </Plane>
                </animated.mesh>
            </Canvas>
            <img
                ref={canvasRef}
                src={src}
                alt=""

            />
        </div>
    );
}

export default DraggableImage;