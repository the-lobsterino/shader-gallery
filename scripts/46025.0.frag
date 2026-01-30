#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
            varying vec3 color;
                void main(void) {
                    gl_FragColor = vec4(color, 1);
                }