#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM_TILES 16.0

float noise(vec2 pos) 
{
	return abs(fract(sin(dot(pos ,vec2(19.9*pos.x,28.633*(time*.0000005)*pos.y))) * 4378.5453*pos.x));
}

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.y + vec2(time * 0.03,time * 0.0);
	vec2 t = floor(p*NUM_TILES);
	p = mod(p*NUM_TILES,1.0)-0.5;
	p.x *= 2.0*floor(fract(noise(t)*4.3)*1.8)-1.0;
	float c = abs(1.0-2.0*abs(dot(p,vec2(1))));
	c = smoothstep(0.0,4.0*NUM_TILES/resolution.y,c);	
	gl_FragColor = vec4(vec3(c), 1.0 );
}