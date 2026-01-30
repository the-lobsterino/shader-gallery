#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,vec2(13.9898,78.233)))*43758.5453123);
}
vec3 toRGB(float h,float s,float b){
	return b*(1.0-s)+(b-b*(1.0-s))*clamp(abs(abs(6.0*(h-vec3(0,1,2)/3.0))-3.0)-1.0,0.0,1.0);
}
vec2 wave(vec2 p) { 
	return vec2(sin(p.x) + sin(p.y * 5. + time * 3.21) * .014, 
		    sin(p.y) + sin(p.x * 5. + time * 3.81) * .044);
}
vec2 magic(vec2 p) {
	float o = sin(time*1.2)*1.+2.;
	return p / length(p) - vec2(o/length(p), 0.0);
}

vec3 draw(vec2 uv){
	vec2 p = uv;
	//p = wave(p);
	p = magic(p);
	//p = wave(p);
	
	float h = sin(time)* .5 + random(floor(p * 1.5 + .5 * sin(time)));
	float s = .5 + .5 * random(floor(p * 2.5));
	float v = .5 + .5 * random(floor(p * 3.5));
	
	vec3 col = toRGB(h,s,v);
	
	return col;
}

void main( void ) {
	float t = time * 0.20;
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / max(resolution.x, resolution.y);

	vec2 p = vec2(0.0);
	vec3 col = vec3(0.0);

	col = draw(uv);

	gl_FragColor = vec4(vec3(col), 1.0 );
}
