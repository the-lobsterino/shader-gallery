#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dist(vec2 v1, vec2 v2) {
	vec2 v = v1-v2;
	return sqrt(v.x*v.x+v.y*v.y);
}

void main( void ) {
	//vec4 color = vec4(0.6,0.2,0.1,1.0);
	vec4 color = vec4(0.5,0.,1.,1.);
	
	vec2 pixel = vec2(gl_FragCoord.xy/resolution) - vec2(0.5, 0.5);
	
	float r = dist(pixel, vec2(0,0));
	float angle = atan(pixel[0], pixel[1]);
	angle /= PI;

	float pR = 50.*sin(2.*PI*time / 100.0) * cos(2.*PI*time / 25.0);
	float pA = 5.;
	
	color *= (cos(r*PI*2.0*pR + time*2.0)*0.5+2.)/sqrt(abs(r)*4.0) * (sin(r*PI*2.0*pR - time*2.5)*0.5+2.)/sqrt(abs(r)*4.0);
	color *= (cos(angle*PI*2.0*pA + time*2.2)*0.5+2.) * (sin(angle*PI*2.0*pA - time*2.5)*0.5+2.);
	//color *= cos(2.0*PI*pixel.x / 0.1 + time*10.0) + 2.;
	//color *= cos(2.0*PI*pixel.y / 0.1 + time*5.0) + 2.;
	float d = dist(mouse - vec2(0.5, 0.5),pixel)*100.0;
	
	color += vec4(0, 1.0/d, 0, 0);
	color *= 1.0/(d);
	//color /= 1.0/d;

	gl_FragColor = color;

}