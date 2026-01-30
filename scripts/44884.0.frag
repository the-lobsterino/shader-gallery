#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;

void main( void ) {

	vec2 p = (gl_FragCoord.xy - resolution / 2.) / resolution.x;
	float c = 0.;
	
	float l = 1. / length(p);
	p = vec2(9. * atan(p.y, p.x) / (4. * asin(1.)), l);
	p.y += p.x / 3. + 2. * time;
	p.y /= 3.;
	c = mod(floor(p.x) + floor(p.y), 2.);
	c = mix(c, texture2D(buffer, (fract(vec2(p.y, -p.x)))).x, 0.9);
	c *= pow(0.6, l / log(resolution.x));
	
	if (length(gl_FragCoord.xy - mouse * resolution) < resolution.y / sin(time) /10.) c = 1.;
	
	gl_FragColor = vec4(c);
}