// Шейдер с нырянием в анус, переливами и перемещением мышью
// Это @Buranek, а шейдер доработанный мной стандартный
// Спасибо @lurker
// Анус работает, но нужно показывать его в месте касания
// Попробуем :-)

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main( void )
{
	float mx = max( resolution.x, resolution.y );
	vec2 uv = (gl_FragCoord.xy-resolution.xy*.5)/mx+ mouse / 8.5;

// Погружение в анус
	float hole = 1.0 - sin( 1.5 - length( uv )*6.0 *(0.3 - sin (time)) );

	float angle = .78539816339745 + sin(uv.x * 10.0 + time) * cos(uv.y * 1.0+ time);;
	uv *= mat2(
		cos( angle ), -sin( angle ),
		sin( angle ), tan( angle ) );

	float fineness = mx*.4;
	float sy = uv.y*fineness;
	float c = fract(
		sin( floor( sy )/fineness*12.9898 )*
		437.5854 );

	// Сглаживание полос
float f = fract( sy );
c *= min( f, 1.-f )*2.;

	// Тень проходит
	c += sin( uv.y*1.5+time )*.3;

	// Фон
	float r = -uv.y+.5;
	float b = uv.y+.5;
	float g = uv.y+.7;

	gl_FragColor = vec4(
		mix(
			vec3( r, r*.12, b ),
			vec3( c ),
			.4 ),
		12.0 ) * hole;
}