precision highp float;

				uniform vec2 resolution;

				varying vec3 vPosition;
				varying vec2 vUV;

				vec3 heat(float v)
				{    
					return v * (vec3(24, 6, 8) - v * vec3(16, 6, 16)) - vec3(8, 0.5, 0);
				}

				void mainImage( out vec4 fragColor, in vec2 fragCoord )
				{
					// Normalized pixel coordinates (from 0 to 1)
					vec2 uv = fragCoord/resolution.xy;

					// Output to screen
					fragColor = vec4(heat(uv.y), 1.0);
				}

				void main() 
				{
					mainImage(gl_FragColor, vUV * resolution.xy);
				}