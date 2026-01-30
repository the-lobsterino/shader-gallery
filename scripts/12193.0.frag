#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash( float n )	{
	for(float i = 0.0; i < 4.0; i++){
		n = fract(n * 1234.5678);
	}
	return fract( n );
}

void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	float set = (step(hash(p.x*time), 0.5) > 0.0 && step(hash(p.y*time), 0.5) > 0.0) ? 1.0 : 0.0;
	gl_FragColor = vec4(set, 0.0, 0.0, 1.0 );
}