#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// "Time Tunnel 9/11/2018"
// Dino Dini https://www.youtube.com/user/dndn1011


float ntsf(float x,float k) {
	x = clamp(x,-1.0,1.0);
	float r = (x-x*k)/(k - abs(x) * 2.0 * k + 1.0);
	if(r < 0.00) {
		r=0.0;
	}
	return r;
}


void main( void ) {
	vec2 uv=gl_FragCoord.xy/resolution;

	float x = ntsf(1.0-abs(fract(uv.x*1000.0)-0.5),0.9);
	float y = ntsf(1.0-abs(fract(uv.y*1000.0)-0.5),0.9);
	float dx = uv.x-0.5;
 	float dy = uv.y-0.5;
	float d = sqrt(dx*dx+dy*dy);
 	float c = (x+y)*sin(ntsf(d,-0.98)*100.0-10.0*time);
	gl_FragColor=vec4(vec3(c),1.0);
}