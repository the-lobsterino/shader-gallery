// ice spider
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float distanceFunction(vec2 pos) {
	float s = 4096.0;
	float a = tan(pos.x/pos.y)*s;
	float f = 128.0;
	float squiggle = sin( time+pos.x*s+f * a) *0.14;
	squiggle*=sin(time*2.37+a*8.0)*3.5;
	return fract( length(pos) - .05 - squiggle*squiggle );
}

float t(float a[2]) {
	mat2 b[2];
	return 2.0;
}
void main( void ) {
	
	vec2 p = surfacePosition;//(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	//p.xy *= .6; // zoom in a bit

	//p = fract(p);
	p = abs(p);
	p.x = fract(dot(p,p));
	p.y = 1.0-p.x;
	
	vec3 col = vec3(0.1,0.24,.5) * distanceFunction(p);
	col = smoothstep(0.01, 0.31, col);

	col = vec3(1.0,2.0,3.0)-col;
	col.bgr *= col.bgr * col.bgr * col.bgr * 0.85; // more contrast
	col = fract(col);

	gl_FragColor = vec4(col.bgr, 1.0);
}
