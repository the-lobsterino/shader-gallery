#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float ntsf(float x,float k) {
	x = clamp(x,-1.0,1.0);
	float r = (x-x*k)/(k - abs(x) * 2.0 * k + 1.0);
	if(r < 0.00) {
		r=0.0;
	}
	return r;
}

float random (vec2 st,float d) {
	st = floor(st*d)/d;
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 redux(vec2 v,float d) {
	v+=0.5/d;
	return floor(v*d)/d;
}

void main( void ) {

	vec2 p= ( gl_FragCoord.xy / resolution.xy ) + 0.0000001;

	vec2 q = redux(p,10.0);
	q.x=q.x+(random(p,1000.0)-0.5)/30.0;
	q.y=q.y+(random(p,999.9)-0.5)/30.0;
	float e = 1.0-ntsf(distance(p,q),-0.97);
	
	gl_FragColor = vec4( vec3(e),1);

}