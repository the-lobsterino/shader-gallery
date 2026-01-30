#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

const float rCircle = 10.0;
const int max = 125;
vec2 particles[max];

uniform sampler2D backb;
const float rt_buffer = 0.0234567890;
const float tr_buffer = 1.-rt_buffer;
void pass_rt_buffer(void){
	gl_FragColor *= rt_buffer*2.;
	gl_FragColor += tr_buffer*texture2D(backb, gl_FragCoord.xy/resolution.xy);
}

void main( void ) {

	vec2 position = 512.*(surfacePosition+vec2(0.48));//( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	
	float d = 250.0;
	float r,g,b = 0.0;
	float a = 0.0;
	
	float rad = 50.0;
	float z = 1.0;
	for ( int i = 0; i < max; i++ )
	{
		particles[i] = vec2( d + sin(time * z/5.0) * ( d - z ), d + cos(time * z/200.0) * ( d - z ) );
		
		// Ugly painting of pixels
		vec2 delta = vec2( position.x - particles[i].x, position.y - particles[i].y );
		float len = sqrt( pow( delta.x, 2.0 ) + pow( delta.y, 2.0 ) );
		float perc;
		if ( len < rCircle )
		{
			perc = ( rCircle - len ) / rCircle;
			r = perc * 0.75 + 0.25;
			g = b = perc * 0.5;
		}
		
		z += 1.0;
	}
	
	gl_FragColor = vec4( r, g, b, a );
	
	pass_rt_buffer();
}