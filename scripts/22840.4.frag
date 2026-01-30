//http://img.besty.pl/images/339/41/3394167.gif

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 pos=mix(vec2(-1.), vec2(1.), gl_FragCoord.xy / resolution.xy);

#define PI 3.14159265359
#define PI2 (2.*PI)
#define BIGRAD 0.7
#define SMALLRAD 0.1
#define THICK 0.01
#define CIRCLES 12.
#define BETWEEN(e0, e1, x) step(e0, x)*step(x, e1)

float circle1(vec2 c, float r, float thick){
	return BETWEEN(r-thick, r+thick, distance(c, pos));
}

vec2 polar2comp(float r, float th){
	return r*vec2(cos(th), sin(th));
}

float angleDiff(float a, float b){
	return min(PI2-abs(a-b), abs(a-b));
}

void main( void ) {
	float t=mod(time*0.2, 1.6);
	float zoom=mix(1., 7., pow(t/1.6, 7.258));
	pos.x*=resolution.x/resolution.y;
	
	if(abs(pos.x)>1.)
		discard;
	
	pos*=zoom;
	
	float dl=max(0., t-1.);
	float thick2=dl*BIGRAD;
	vec3 x=vec3(0.);
	
	for(int i=0; i<int(CIRCLES); i++){
		float th=mod(PI2*(float(i)/CIRCLES-(exp(pow(t, 2.1))-1.))+PI/2., PI2);
		float rad=mix(SMALLRAD, THICK, min(t, 1.));
		
		vec2 c1=polar2comp(BIGRAD, th+dl);
		vec2 c2=polar2comp(BIGRAD, th-dl);
		
		x.r+=circle1(c1, rad, THICK);
		x.r+=circle1(c2, rad, THICK);
		
		
		float b=mod(atan(pos.y, pos.x), PI2);
		if(angleDiff(b, th)<thick2/BIGRAD)
			x.r+=circle1(vec2(0.), BIGRAD, 2.*THICK);
	}
	
	x.rgb=vec3(x.r);
	x=min(x, 1.);
	gl_FragColor = vec4( 1.-x, 1.);

}