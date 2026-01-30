#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float clamps(float val) {
	return clamp(val,0.,1.);	
}

float distanceToSegment( in vec2 p, in vec2 a, in vec2 b )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	
	return length( pa - ba*h );
}
//xavierseb's semen. want some?
void main( void ) {
	vec3 sperm;
	float s=sin(time*20.);
	vec2 uv = ((( gl_FragCoord.xy / resolution.xy )-0.5)*vec2(2.,1.))+vec2(0.5,0.66+.005*s);
        float a = 1.-clamps((length(uv-vec2(0.4,0.3))-0.138)*500.);// testes
	a += 1.-clamps((length(uv-vec2(0.6,0.3))-0.138)*500.);// testes
	float b = s/20.*(1.-cos(time/2.));
	a += 1.-clamps((distanceToSegment(uv,vec2(0.5,0.4),vec2(.15,0.8+b))-0.1)*500.);
	float x= 1.-clamps((distanceToSegment(uv,vec2(0.098,0.85+b),vec2(0.08,.79+b))-0.003)*500.);
	a -= x;
	if (b>.09) sperm = 1.-vec3(clamps((distanceToSegment(uv,vec2(0.08,0.84+b),vec2(0.132+(b-.9)*100.,.895+b-(b-.9)*100.))-0.02)*500.));
	a = clamps(a);
	float c = clamps((uv.y-0.76-b)*500.);
	vec3 colors = vec3(a/1.55-c/13.,max(a/1.4-c,0.)/2.,(a/4.6));
	gl_FragColor = vec4(vec3(colors) + sperm,1.);
}