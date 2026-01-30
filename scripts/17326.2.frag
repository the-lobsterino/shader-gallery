#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float s = 0.0;

void line ( vec2 a , vec2 b ) {
	vec2 pos = gl_FragCoord.xy / resolution;
	float aspect = resolution.x / resolution.y;
	vec2 lab = a - b, la = pos - a, lb = pos - b;
	lab.x *= aspect; la.x *= aspect; lb.x *= aspect;
	float d = ( length ( la ) + length ( lb ) - length ( lab ) + 1e-6 )
		* min ( length ( la ) , length ( lb ) );
	s += max ( 3. - pow ( d * 4.3e8 , 0.07 ) , 0.0 );
}

vec2 rand ( int i, float e ) {
	return vec2 ( .02 * sin ( 55.5 * mod ( floor (time * 11.7) * e * ( 1.4 + float ( i * 3 ) ) , 1.0 ) ) ,
		      .02 * sin ( 43.5 * mod ( (time * 9.4) * e * ( 1.6 + float ( i * 2 ) ) , 1.0 ) ) );
}

void split ( vec2 a , vec2 b , int k, int l) {
	a += rand ( 6, .1 );
	vec2 t = a;
	vec2 d = ( b - a ) / float ( k );
	
	for (int i = 1 ; i < 10; ++i) {
		if (i > int((sin(time * 3.0) + 1.25) * 10.0)) return;
		if ( i > k ) return;
		vec2 v = a + d * float(i);
		v += rand ( i , .1 );
		line ( t , v );
		t = v;
	}
}

void main( void ) {

	int l = int(sin(time));
	
	split ( vec2 ( .5 , 1. ) , .5 + rand ( 0 , 0.019 ) * 5. , 6 , l);
	split ( .5 + rand ( 0 , 0.019 ) * 5. , vec2 ( 0.3 + rand ( 0 , 0.19 ).x * 5. , 0.0 ) , 10, l);
	split ( vec2 ( .5 , 1. ) , vec2 ( 0.7 + rand ( 0 , 0.19 ).x * 5. , 0.0 ) , 11, l);
	
	gl_FragColor = (vec4( s - .2 , s - 1. , s, 1.0)) * 0.5;

}