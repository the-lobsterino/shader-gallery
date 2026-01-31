// fire spider tits and ass
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec2 pos) {
	float a = atan(pos.x/pos.y);
	float f = 10.;
	float squiggle = sin( time+pos.x*16.0+f * a) *0.14;
	squiggle*=sin(time*2.37+a*8.0)*3.5;
	squiggle *= 0.75+sin(pos.x*4.0)*0.5;
	return length(pos) - .025 - squiggle*squiggle;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 4. - resolution) / min(resolution.x, resolution.y);

	p.x = dot(p,p);
	
	vec3 col = vec3(0.1,0.24,.5) * distanceFunction(p);
	col = smoothstep(0.01, 0.31, col);
	
	col *= 0.5+abs(sin(time+p.x+p.y*4.0))*1.0;
	


	gl_FragColor = vec4(vec3(0.7)-col, 1.0);
}
