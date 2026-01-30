#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 co)
{
	vec2 x,y;
	x.x = floor(co.x);
	x.y = ceil(co.x);
	y.x = floor(co.y);
	y.y = ceil(co.y);
	
	return mix(
		mix(rand(vec2(x.x, y.x)), rand(vec2(x.y, y.x)), 1.0 - (x.y - co.x)),
		mix(rand(vec2(x.x, y.y)), rand(vec2(x.y, y.y)),  1.0 - (x.y - co.x)),
		1.0 - (y.y - co.y)
	);
}

float fbm(vec2 co)
{
	float x;
	x += noise(co);
	x += noise(  2.0 * co)  /  2.0;
	x += noise(  4.0 * co)  /  4.0;
	x += noise(  8.0 * co)  /  8.0;
	x += noise( 16.0 * co)  /  5.0;
	x += noise( 32.0 * co)  /  6.0;
	return x / 1.96875;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy * 2.0 - 1.0 ) * vec2( resolution.x / resolution.y, 1.0 );
	vec3 color;
	color = vec3((fbm(p*4.0)));
	gl_FragColor = vec4( color, .0 );

}