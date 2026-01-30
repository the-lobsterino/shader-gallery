#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define pi 3.1415962
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = p*2.;
	uv-=1.;
	uv.x/=resolution.y/resolution.x;
	uv+=mouse.xy/4.;
	float r = length(uv);
	float a = (atan(uv.x,uv.y)/2./pi+.5)*2.*pi;
	float f1=clamp(tan(r*100.-time*20.+(tan(time)+1.)*10./r),0.,1.);
	float f2=clamp(tan(r*100.-time*20.+(tan(time)+1.)*10./r),0.,1.);
	float f3=clamp(tan(r*100.-time*20.+(tan(time)+1.)*10./r),0.,1.);
	vec3 c = vec3(vec3(f1*sin(a*10.+time+tan(r*10.-time*4.)),
			   f2*sin(a*10.+3.*pi/2.-time*2.+sin(r*10.-time*4.)),
			   f3*sin(a*10.+pi/2.+r*10.)));
	gl_FragColor = vec4( c, 1.0 );
}