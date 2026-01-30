// ICE-EYE CUNT II
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceFunction(vec2 pos) {
	float a = atan(pos.x/pos.y);
	float f = 10.0;
	
	float zz = sin(a*10.0+time*1.1)*4.0;
	
	float squiggle = sin( time+pos.x*24.0+f * a+zz) *0.14;
	squiggle*=sin(time*2.37+a*12.0)*4.;
	return length(pos) - .125 - pow(squiggle,3.0);
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p.x += sin(time*0.3+p.y*7.27)*0.03;
	vec2 pp=p;

	pp.y += sin(time*4.0+pp.y*40.0)*0.0075;
	
	p.xy *= dot(p,p);
	
	vec3 col = vec3(0.1,0.24,.95) * distanceFunction(p);
	col = vec3(1.1+((sin(time*3.0+p.x*18.0)*0.05)))-smoothstep(0.0, .21, col);

	float m = length(pp)-0.1;
	m = smoothstep(0.275,0.3,m);
	col*=m;
	

	gl_FragColor = vec4(col*col, 1.0);
	gl_FragColor.rgb = gl_FragColor.bgr;
}
