#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float l = length(p);
	float c = step(1.0, l);
	
	
	float a = atan(p.y, p.x) * 2.0;

	gl_FragColor = vec4(sin(a * 10. + floor(l * 16.0) * time ));
	gl_FragColor.r = 1.- (sin(a * 3. + floor(l * 12.0) * time));
	gl_FragColor.g = mod(time * 10., 3.) - (sin(a * 3. + floor(l * 12.0) * time));
}