#extension GL_OES_standard_derivatives : enable

 precision highp float;

                uniform float time;
                uniform vec2 mouse;
                uniform vec2 resolution;
                
                mat2 rotate2D(float r) {
                    return mat2(cos(r), sin(r), -sin(r), cos(r));
                }
                
                void main() {
                    // Normalized pixel coordinates (from 0 to 1)
                    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
                    vec3 col = vec3(0);
                    float t = time * 0.001; // Adjust the time factor for faster animation
                
                    vec2 n = vec2(0);
                    vec2 q = vec2(0.0);
                    vec2 p = uv;
                    float d = dot(p, p);
                    float S = 12.0;
                    float a = 0.;
                    mat2 m = rotate2D(45.);
			
			float ti = time*0.05;
			
                
                    for (float j = 0.; j < 20.0; j++) {
                        p *= m;
                        n *= m;
                        q = p * S + t * 5. + sin(t * 60. - d * 4.) * 1. + j + n;
                        a += dot(cos(q) / S, vec2(0.2));
                        n -= sin(q+ti);
                        S *= 1.2;
                    }
                
                    col = vec3(.01, .01, .01) * (a + 10.0) + a + a - d;
                
                    // Output to screen
                    gl_FragColor = vec4(col, 1.0);
                }