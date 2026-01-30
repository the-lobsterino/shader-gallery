#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 uv){
	uv = floor(fract(uv)*1e3);
	float v = uv.x+uv.y*1e3;
	return fract(1e5*sin(v*1e-2));
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float aspectRatio = resolution.x / resolution.y;
	position.x *= aspectRatio;

	float color = random( position*1.0 );
	if ( color < 0.995 ){ color = 0.0; }

	gl_FragColor = vec4( color );

}