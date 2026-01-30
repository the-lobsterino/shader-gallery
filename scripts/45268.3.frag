#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform float time;
uniform sampler2D noise;
uniform vec2 mouse;
uniform int second;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(void) {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	vec3 oldCell = texture2D(backbuffer, uv).xyz;
	vec2 pixel = vec2(1.0) / resolution;
	vec3 sum = texture2D(backbuffer, uv + vec2(1.0, -1.0) * pixel).xyz + 
		texture2D(backbuffer, uv + vec2(1.0, 0.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(1.0, 1.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(0.0, -1.0) * pixel).xyz +
		0.0 * texture2D(backbuffer, uv + vec2(0.0, 0.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(0.0, 1.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(-1.0, -1.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(-1.0, 0.0) * pixel).xyz +
		texture2D(backbuffer, uv + vec2(-1.0, 1.0) * pixel).xyz;

  
	if (oldCell.x < 1.0) {
		if (sum.x == 3.0) {
			color = vec3(1.0);
		}
	} else {
		if (sum.x > 3.0 || sum.x < 2.0) {
			color = vec3(0.0);
		}
	}
 
	if (length(mouse - uv) < 0.1) {
		if (rand(uv - time * 0.000001) >= 0.9) {
			color = vec3(1.0);	
		}

    	}

	
	if (time < 0.1) {
		color = vec3(length(texture2D(noise, uv)) / 3.0);
		color = floor(color + 0.5);
	}

	gl_FragColor = vec4(color, 1.0);
}