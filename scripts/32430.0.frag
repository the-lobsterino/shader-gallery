// JAPAN I AM SUCH A WEEEEEBBBBBBBBBBBFUCKERRRRRRRRRRRRRRRR
precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {
	vec2 uv=(gl_FragCoord.xy/resolution.xy )*2.-1.;
	uv.x*=resolution.x/resolution.y;
	vec3 FINALBITCH;FINALBITCH.gb-=(length(uv)-.5)*2e2;
	gl_FragColor = vec4(1.-FINALBITCH,1.);
}