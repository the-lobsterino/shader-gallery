precision mediump float;

uniform float time;
uniform vec2 touch;
uniform vec2 resolution;

void main( void )
{
float mx = min( resolution.x, resolution.y );
vec2 uv = gl_FragCoord.xy/mx;
vec2 t = touch.xy*uv;

vec3 background = vec3(
uv,
.25+.55+sin(sqrt(time)));

	
vec3 hole = vec3( sin
( 1.5+distance( t,uv)*1.0 ) );

gl_FragColor = vec4(
mix( background, hole, 4.5 ),
1.0 );
}
	
	

