#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define less(a,b,c)      mix(a,b,step(0.,c))
#define sabs(x,k) less((.5/k)*x*x+k*.5,abs(x),abs(x)-k)
float sdStar5(in vec2 p, in float r, in float rf)
{
    const vec2 k1 = vec2(0.809016994375, -0.587785252292);
    const vec2 k2 = vec2(-k1.x,k1.y);
    p.x = sabs(p.x,.02);
    p -= 2.0*max(dot(k1,p),0.0)*k1;
    p -= 2.0*max(dot(k2,p),0.0)*k2;
    p.x = sabs(p.x,.02);
    p.y -= r;
    vec2 ba = rf*vec2(-k1.y,k1.x) - vec2(0,1);
    float h = clamp( dot(p,ba)/dot(ba,ba), 0.0, r );
    return length(p-ba*h) * sign(p.y*ba.x-p.x*ba.y);
}
void main( void ) {

	vec2 position = 2.0 * ( gl_FragCoord.xy / resolution.xy ) -1.0;
	position.x *= resolution.x / resolution.y;
	//float d  = length(position) - 0.5;
	
	float d = sdStar5(position,3.0,2.0);
	d = sin(d * 15.0 - time);
	d = 0.2 / abs(d);
	gl_FragColor = vec4(d*0.9, d*0.68, d*0.45, 1.0);

}