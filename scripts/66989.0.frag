// 190820N

// LIM(E)
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
 
#define PI 3.141592
#define PI2 2.* PI
#define MAX 10.
#define t time
#define L 3.0

#define CHS 0.18
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}

float GetText(vec2 uv)
{
	uv*=4.;
	float d = 1.0;
	for(float i=0.0; i < 10.; i+=1.0) {
		vec2 xy = uv + vec2(sin(i*PI2/MAX), cos(i*PI2/MAX));
		d = line2(d,xy,vec4(-sin(i-time)*L,cos(i+time)*-L,sin(i-time)*L,cos(i+time)*L)*CHS);
	}
	
	return smoothstep(0.,0.025,d-0.55*CHS);
}


void main(void)
{
	vec2 p = (gl_FragCoord.xy - resolution * .5) / resolution.yy;
	float xd = GetText(p);
	float xd2 = GetText(p-vec2(-0.025,0.025));
	vec3 cc = vec3(0.1,0.3,0.7);
	vec3 cc2 = mix(cc*0.15,cc,xd);
	cc = mix(cc*2.25+(sin(p.x*3.0+p.y*10.0+time*3.3)*0.25),cc2,xd2);
	float rf = sqrt(dot(p, p)) * .75;
	float rf2_1 = rf * rf + 1.0;
	float e = 1.0 / (rf2_1 * rf2_1);	
	gl_FragColor  = vec4( cc.rgb*e,1.0);
}