    #define MAX_DIVS 100

            precision mediump float;
            
            uniform vec2 divPositions[MAX_DIVS];
            uniform vec3 divColors[MAX_DIVS];
            uniform int activeDivCount;
            uniform vec2 resolution;
            
            vec4 grad(vec2 uv, vec3 bgColor, vec3 fgColor) {
                return vec4(mix(bgColor, fgColor, uv.y), 1.0);
            }
            
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution;
                vec3 color = vec3(0.0);
                float totalWeight = 0.0;
            
                for(int i = 0; i < MAX_DIVS; i++) {
                    if (i >= activeDivCount) break;
            
                    float dist = distance(uv, divPositions[i]);
                    float weight = 1.0 / (dist * dist + 0.01);
            
                    color += divColors[i] * weight;
                    totalWeight += weight;
                }

                if(totalWeight > 0.0) {
                    color /= totalWeight;
                } else {
                    color = vec3(0.0, 1.0, 0.0); // grenb debug
                }
                
                if(totalWeight > 1.0) {
                    color = vec3(1.0, 0.0, 0.0); // red if they have a significant influence
                }

                // gl_FragColor = grad(uv, vec3(1.0, 1.0, 1.0), color);

                color = vec3( distance(uv, divPositions[0]) );
                gl_FragColor =  vec4(color, 1.0);
            }