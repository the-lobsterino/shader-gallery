#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float ellipsoid(vec2 p, vec2 xy ,vec2 hw)
{
	return max(1.0-sign(length((p-xy)/hw)-0.5),0.0);
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float toe = ellipsoid(position,vec2(0.355,0.64),vec2(0.055,0.13));
	toe += ellipsoid(position,vec2(0.41,0.73),vec2(0.0625,0.15));
	toe += ellipsoid(position,vec2(0.48,0.79),vec2(0.067,0.175));
	toe += ellipsoid(position,vec2(0.55,0.78),vec2(0.068,0.19));
	toe += ellipsoid(position,vec2(0.63,0.7),vec2(0.074,0.21));
	float heel = ellipsoid(position,vec2(0.5,0.53),vec2(0.25,0.3));
	heel += ellipsoid(position,vec2(0.5,0.3),vec2(0.2,0.6));
	heel += ellipsoid(position,vec2(0.5,0.4),vec2(0.22,0.5));
	vec3 total = vec3(clamp(toe+heel,0.0,1.0))*vec3(0.9,0.9,0.6);
	gl_FragColor = vec4( vec3( total), 1.0 );

}