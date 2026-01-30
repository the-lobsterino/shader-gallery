#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
	vec2 q = mod(p, 0.05) - 0.025;
	float s = sin(time*10.);
    	float c = cos(time*10.);
	q *= mat2(c, s, -s, c);
	float v = 0.02 / length(q);
    	float r = v * abs(sin(time));
    	float g = v * abs(sin(time));
  	float b = v * abs(sin(time));
	gl_FragColor = vec4( r*0.,g*0.9,b*1.1,1.0 );

}