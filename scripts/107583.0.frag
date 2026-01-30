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
                    vec2 uv = ((gl_FragCoord.xy / resolution.xy) - vec2(.5))* vec2(2.0,1.0);
                    
                    vec2 p = vec2(sin(time) / 2.0,cos(time) / 2.0);
		    float dist = (p.x - uv.x) * (p.x - uv.x) + (p.y - uv. y) * (p.y - uv.y);
	            dist = sqrt (dist);
		    vec3 col = vec3(1.0,0.0,0.0) / (dist) * 0.01;
			
			
     
                
                    // Output to screen
                    gl_FragColor = vec4(col, 1.0);
                }