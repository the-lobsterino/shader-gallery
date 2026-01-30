// N101020N The Fog
#ifdef GL_ES
precision  lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
// varying vec2 surfacePosition;


#define PI 3.141592653
#define TWO_PI 2.0*PI
#define t time*0.3


float render(vec3 p0) {

	float dist = 0.;
	float mindist = 1e10;

	vec3 p1 = vec3(0.);	
	for (float i1=0.0;i1<=PI;i1+=.3) {
		for (float i2=0.0;i2<=TWO_PI;i2+=.3) {
		
			p1.x = sin(i2) + cos(time+i1);
			p1.y = cos(i2) + sin(time+i1);
			p1.z = 1.0;
		
			p1.x *= (i1+0.1);
			p1.y *= (i1+0.1);
			
			dist = distance(p1,p0);
			mindist = min(mindist,dist);
		}	
	}

	return 0.5/abs(mindist);
}


void main( void ) {
	vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 4.0;
	uv *= 3.;
	uv += vec2(sin(time)*0.25,cos(time)*.25);
	gl_FragColor = vec4(vec3(render(vec3(uv.xy,0.0))), 1.0);	
}