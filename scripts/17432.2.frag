#ifdef GL_ES
precision highp float;
#endif
// refactored code
uniform float time;
uniform vec2 resolution;

const vec4 color1 = vec4(0.2);
const vec4 color2 = vec4(0.5, 0.5, 0.0, 1.0);
void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float f = (p.y*0.9+p.x*4.1 - (time * 1.1));
	float x = smoothstep(1.0, 0.0, p.y) * smoothstep(0.5,.0,fract(f*0.95)) * smoothstep(0.0,.9,1.-fract(f*2.)) * step(fract(f * .0),0.75);
	gl_FragColor = (x > 0.0000000000001)? color1:color2;
}