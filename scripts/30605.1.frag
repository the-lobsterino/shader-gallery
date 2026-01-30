#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 axis_align(vec2 p, vec2 q)
{
	vec2 del = normalize(q - p); 
		
	return vec3(dot(del, p), dot(del, q), dot(vec2(-del.y, del.x), p));
}


vec2 approx_erf(vec2 x)
{
	vec2 ex = exp(x);
	vec2 em = exp(-x);
	
	return (ex - em) / (ex + em);
}


float contrib(vec2 p, vec2 q)
{
	vec2 position = ( gl_FragCoord.xy );
	float pressure = 10.0;

	vec3 track = axis_align(p - position, q - position) / pressure;
	
	vec2 erf = approx_erf(track.xy);
	
	return exp(-track.z * track.z) * ((track.x > track.y) ? (erf.x - erf.y) : (erf.y - erf.x));
}

	
void main( void ) {

	float density  = 1.0;
	
	float acc = 0.0;
	acc += contrib(vec2(100.0, 100.0), mouse * resolution);
	
	gl_FragColor = vec4( 0.0, acc * density, 0.0, 1.0 );
}