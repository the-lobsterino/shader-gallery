#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 sunsetGrad( const float x ) {
	float r = x*2.-.1; 
	float g = 1.-(1.-x)*2.; 
	float b = sin( (min(x,.5)*3.-.33) * 3.1415926);
	return( vec3( r, g,b ) );
}
//error somewhere
float zCurve( const vec2 position ) {
	vec2 p = position * 255.;
	float w = 0.;
	float shift = 128.;
	float bit = 1.;
	for( int i = 0; i<8; i++ ) {
		vec2 tru = floor( p / shift );
		w += tru.x * bit;
		bit *= 2.;
		w += tru.y * bit;
		bit *= 2.;
		p -= tru * shift;
		shift *= 0.5;
	}
	return( w );
}

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.y ) ;
	//float denominator = (mouse.x*0.01 + mouse.y*0.1);
	float denominator = 255.;
	//gl_FragColor = vec4( sunsetGrad( fract( zCurve( position ) / denominator ) ), 1.0 );
	gl_FragColor = vec4( vec3( fract( zCurve( position ) / denominator ) ), 1.0 );

}