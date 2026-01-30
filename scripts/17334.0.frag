#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float s = 0.0; //fix glitch noise

void line ( vec2 a , vec2 b, float size ) {
	vec2 pos = gl_FragCoord.xy / resolution;
	float aspect = resolution.x / resolution.y;
	vec2 lab = a - b, la = pos - a, lb = pos - b;
	lab.x *= aspect; la.x *= aspect; lb.x *= aspect;
	float d = ( length ( la ) + length ( lb ) - length ( lab ) + 1e-6 )
		* min ( length ( la ) , length ( lb ) );
	s = max ( size - pow ( d * 4.3e8 , 0.07 ) , s );
}


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float rand2(vec2 p)
{
	mediump vec2 seed = floor(p * resolution);	
        mediump float rnd1 = fract( cos( seed.x*8.3e-3 + seed.y )*4.7e5);
        return rnd1;		
}

void split ( vec2 a , vec2 b) {
	for ( int j = 1 ; j < 6 ; ++j ){
		vec2 t = a;
		vec2 d = ( b - a ) / float ( 15 );
		for ( int i = 1 ; i < 15 ; ++i ) {
			vec2 v = a + d * float(i);
			if(15-i==j*2) {
				d+=(rand(vec2(float(j),float(j))+v)-0.5)*rand(v)*0.025;
			}
			v += (rand(v)-0.5)*d.y;
			line ( t, v,float(j)*0.25+2.0);
			t = v;
		}
	}
}
void main( void ) {

	split ( vec2(0.5,1.0),vec2 ( mouse.x , mouse.y ) );	
	gl_FragColor = vec4( s - .2 , s - 1. , s , 1.0 );

}