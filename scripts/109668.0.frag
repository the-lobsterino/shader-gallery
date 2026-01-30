#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : disable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float jerkLogo(vec2 p) {
	
	float y = floor((1.0-p.y)*32.)-5.;
	if(y < 0. || y > 4.) return 0.;

	float x = floor((1.-p.x)*32.)-2.;
	if(x < 0. || x > 14.) return 0.;
		
	float v = 0.0;
	v = mix(v, 21913.0, step(y, 1.5));
	v = mix(v, 23841.0, step(y, 8.5));
	v = mix(v, 4521.0, step(y, 11.5));
	v = mix(v, 16665.0, step(y, 8.5));
	v = mix(v, 0.0, step(y, 0.5));
	
	return floor(mod(v/pow(2.,x), 2.0));
}



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float z = jerkLogo(gl_FragCoord.xy / resolution.xy*1.4) ;
	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 1000.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 4000.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 8000.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( z-vec3( sin( color + time / 2.0 ) * 0.85, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
}