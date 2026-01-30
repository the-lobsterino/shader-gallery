#ifdef GL_ES
precision mediump float;
#endif

// schizo flower murrr

uniform float time;
uniform vec2 resolution;

void main( void ) {
    vec2 p=(2.*gl_FragCoord.xy-resolution.xy) / resolution.y;
	float l = length(p);
	vec2 rm = vec2( sin( cos(time) * l ), tan( sin(time) * .5 ) );
	p = vec2( p.x*rm.x - p.y*rm.y, p.x*rm.y - p.y*rm.x);
		
    float b=abs(l-1.0)+(cos(250.*(atan(p.x,p.y))))*.13;

    gl_FragColor = vec4(b,abs(.8-b),1.-b, 1.4 );
}