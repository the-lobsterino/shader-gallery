#ifdef GL_ES
precision mediump float;
#endif
precision highp float;
uniform float time;
uniform vec2 resolution;

void main( void ) {
	
	vec2 test;
	float color;
	float tanVal;
	vec2 uv;
	
	uv = ( gl_FragCoord.xy / resolution.xy );
	tanVal += sin( 1.0 * -5.3 * uv.y * uv.x * time);
	tanVal += tan( 1.0 * -5.3 * uv.y * uv.x * time);
	float t = abs( 1.0 / (sin( uv.y + cos( time + uv.x * 100.0 ) * uv.x ) * 100.0) );
	vec3 finalColor = vec3( t * 0.1, t * 0.1, t * 0.8 );
	
	color = tanVal*0.01;
	
	gl_FragColor = vec4(color, finalColor.x , 0.1, 1.0);
}