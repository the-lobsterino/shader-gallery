#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// dashxdr 20200713
// Cool effect due to divide by zero

float sdSegment( in vec2 p, in vec2 a, in vec2 b ) { // iq
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}
void main( void ) {
	vec2 p = (gl_FragCoord.xy-.5*resolution)/resolution.y;
	vec3 col = vec3(0);

	vec2 a = vec2(.175, .125);
	vec2 b = -a;
	vec2 c = (mouse*resolution-.5*resolution)/resolution.y;
c=mix(a, b, sin(time)*.5+.5); // 3 points on line can't make a circle
	vec2 ab = .5*(a+b);
	vec2 abdir = normalize(b-a);
	vec2 ac = .5*(a+c);
	vec2 acdir = normalize(vec2(c.y - a.y, -(c.x - a.x)));
	float d = dot(ab-ac, abdir);
	vec2 center = ac + acdir*d/dot(acdir, abdir);
	float radius = length(a-center);

	float l = length(center-p);
	if(abs(l-radius)<.002) col=vec3(1.);
	if(min(sdSegment(p, a, b), min(sdSegment(p, b, c), sdSegment(p, a,c)))<.002)
		col = vec3(.5);

	if(l<.003) col=vec3(1,0,0);

	gl_FragColor = vec4(col, 1.);

}
