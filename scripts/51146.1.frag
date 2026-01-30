#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise(vec2 p){
	p = floor(p);
	return fract(floor(4713292747.0 * p.x * p.x * p.y * p.y / (64.0 * resolution.x * resolution.y)) / 16777216.0);
}

float smoothNoise(vec2 p){
	vec2 f = fract(p);
	vec2 p1 = floor(p);
	vec2 p2 = floor(p - 1.0);
	float v = 0.0;
	v += f.x * f.y * noise(p1);
	v += (1.0-f.x) * f.y * noise(vec2(p2.x, p1.y));
	v += f.x * (1.0-f.y) * noise(vec2(p1.x, p2.y));
	v += (1.0-f.x) * (1.0-f.y) * noise(p2);
	return v;
}

void main( void ) {

	//vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 p = gl_FragCoord.xy + 128.0 + vec2(time, 1.0 / time) * 4.0;
	
	//float r = smoothNoise(p/4.0);// + smoothNoise(p/2.0)/4.0 + smoothNoise(p)/8.0;
	
	float r = 0.0;
	float s = 64.0;
	for(int n = 0; n < 6; n++){
		r += smoothNoise(p / s + mouse.xy * sqrt(s) / 128.0 + s) * s;
		s /= 2.0;
	}
	r /= 64.0;
	
	r = log(1.0 - sqrt(r));
	
	gl_FragColor = vec4(clamp((0.95-r)*vec3(0.529,0.808,0.922)+r*.95, 0.0, 1.0), 1.0);

}