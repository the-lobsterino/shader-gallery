#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

/*
 * inspired by http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
 * a slight(?) different 
 * public domain
 */

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

#define N 60
void main( void ) {
	vec2 v = (gl_FragCoord.xy - resolution/2.0) / min(resolution.y,resolution.x) * 20.0;
	vec2 z = vec2(1,0);
	
	float rsum = 0.0;
	float rsum2 = 0.0;
	float pi2 = 3.1415926535 * 2.0;
	float a = (.5-surfacePosition.x)*pi2;
	float C = cos(a);
	float S = sin(a);
	vec2 xaxis=vec2(C, -S);
	vec2 yaxis=vec2(S, C);
	#define MAGIC 0.618
	vec2 shift = vec2( 0, 1.0+MAGIC);
	float zoom = 1.0 + surfacePosition.y*8.0;
	float zoom2 = 1.0 + (surfacePosition.y)*7.9;
	float zoom3 = 1.0 + (surfacePosition.y)*8.1;
	
	for ( int i = 0; i < N; i++ ){
		float rr = dot(v,v);
		if ( rr > 1.0 )
		{
			rr = (1.0)/rr ;
			v.x = v.x * rr;
			v.y = v.y * rr;
		}

		rsum *= .91903;
		rsum += rr;
		
		rsum2 *= .99;
		rsum2 += rr;
		
		v = vec2( dot(v, xaxis), dot(v, yaxis)) * zoom + shift;
	}
	float col3 = pow(dot(v,z)/dot(v,v),2.0);
	vec3 colorv = vec3(col3,0.5,dot(v,v)/4.0);
	colorv = hsv2rgb(colorv);
	float col1 = ((mod(rsum,2.0)>1.0)?1.0-fract(rsum):fract(rsum));
	float col2 = ((mod(rsum2,2.0)>1.0)?1.0-fract(rsum2):fract(rsum2));
	gl_FragColor = vec4(fract(colorv.x), colorv.y, colorv.z, 1.0); 
}