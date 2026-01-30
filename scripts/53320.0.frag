#ifdef GL_ES
precision mediump float;
#endif

    return p * mat2(c, s, -s, c);
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 rot(vec2 p, float a) {
    float c = tan(a);
    float s = sin(a);
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	vec2 u = gl_FragCoord.xy / resolution - 0.5; 
	u *= cos(length(time));
	
	
	//uv = abs(uv);
	for (int i = 0; i < 6; i++) {
		uv *= rot(uv, time + float(i));
		uv -= cos(uv * 5. - length(sin(uv * 5. * sin(length(uv) * 2.))) * 4. + time);
		col += .1/ length(uv);
		col += texture2D(backbuffer, u + 0.5).rgb * 0.01;
		
	}
	gl_FragColor = vec4(col, 8);
	
	
		
}