#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 p){
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5435);
}
float valueNoise(vec2 st)
{
	vec2 p = floor(st);
	vec2 f = fract(st);
	
	float v00 = random(p+vec2(0,0));
	float v01 = random(p+vec2(0,1));
	float v10 = random(p+vec2(1,0));
	float v11 = random(p+vec2(1,1));
	
	vec2 u = f * f * (3.0 - 2.0 * f);
	
	float v0010 = mix(v00, v10, u.x);
	float v0111 = mix(v01, v11, u.x);
	return mix(v0010, v0111, u.y);

}

vec2 ranodm2(vec2 st){
	st = vec2(dot(st, vec2(127.1, 311.7)),
		  dot(st, vec2(269.5, 183.3)));
	return -1.0 + 2.0 * fract(sin(st) * 43758.545123);
}



float circle(vec2 st, float r)
{
	return r/length(st);
}
	
void main( void ) {

	vec2 position = ( gl_FragCoord.xy * 10. * sin(time * 0.01) -resolution.xy) / resolution.xy ;
	vec2 p = position;
	p.x = p.x + time * 0.25;
	p.y += time * 0.01;
	float color = valueNoise(p * 1. + time);
	 color += circle(p, 0.2);
	color +=  sin(atan(p.y, p.x) * time);
	color += cos(tan(atan(p.y, p.x) * time));
	
	/*color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;
	*/
	
	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = vec4(vec3(color, color + sin(color + time/ 2.0), 0.), 1.0);

}