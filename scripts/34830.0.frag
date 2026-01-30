// Анус v3
// @Buranek — шейдер с нырянием в анус, переливами и перемещением мышью
// Шейдер — доработанный нами стандартный из программы Shader Editor, но в таком виде это уже далеко не стандарт xD
// Анус работает, а место касания не поддерживается этим сайтом, посему было решено на него забить
// @lurker — Попробуем :-)

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main( void )
{
	float mx = max( resolution.x, resolution.y );
	// Путешествие мышью
	vec2 uv = (gl_FragCoord.xy-resolution.xy*.5)/mx+ mouse / 8.5;

// Погружение в анус
	float hole = 1.0 - sin( 1.5 - length( uv )*6.0 *(0.3 - sin (time)) );

	float angle = .78539816339745 + sin(uv.x * 10.0 + time) * cos(uv.y * 10.0+ time);;
	uv *= mat2(
		cos( angle ), -sin( angle ),
		sin( angle ), tan( angle ) );

	float fineness = mx*.4;
	float sy = uv.y*fineness;
	float c = fract(
		sin( floor( sy )/fineness*12.9898 )*
		437.5854 );
	
	// Смягчение
	c*=0.7-length(gl_FragCoord.xy / resolution.xy -0.25)*0.5;

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