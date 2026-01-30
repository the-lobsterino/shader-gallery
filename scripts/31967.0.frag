#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define time (time-length(surfacePosition))
#define mouse (.5+.25*vec2(cos(time), sin(time*3.5)))

#define eps 0.001
#define d 7.0

bool eq (float f1, float f2){

	
	return (abs(f1-f2)<eps)?(true):(false);
}

float disc(float f){
	
	//return (f<0.0)?(floor(f*d+1.0)/d):(floor(f*d)/d);
	
	return floor(f*d)/d;
	
}

float disc(float f, float df){
	
	//return (f<0.0)?(floor(f*d+1.0)/d):(floor(f*d)/d);
	
	return floor(f*df)/df;
	
}
vec2 disc(vec2 v){
	
	
	return vec2(disc(v.x), disc(v.y));
	
}

vec2 disc(vec2 v, float df){
	
	
	return vec2(disc(v.x, df), disc(v.y,df));
	
}
void main( void ) {

	vec2 uv = 2.0*( gl_FragCoord.xy / resolution.xy )-vec2(1.0);
	vec2 m = 2.0*(mouse.xy)-vec2(1.0);

	vec3 c = vec3(0.0);
	
	

	vec2  uvd = disc(uv);
	vec2  md  = disc(m);
	float dd  = 0.0;
	
	for (float f = 0.0; f <= d; f++){
		float fq = pow(2.0,f);
		uvd = disc(uv,fq);
		md  = disc(m,fq);
		dd  = length(-uvd+md);
		c += (eq(dd,0.))?( vec3((1.0-dd)/(d+2.)) ):( vec3(0.0) );
	}
	
        c = (eq(dd,0.))?( vec3(1.0,0.0,0.0) ):( c );
	c = sqrt(c);
	
	//c = (vec3(uvd.x)+vec3(uvd.y))/2.0;
	//c.rg = vec2(abs(dd.x),abs(dd.y));
	

	

	gl_FragColor = vec4( c, 1.0 );

}