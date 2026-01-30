// BREXIT
#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT

float GetText(vec2 uv)
{
	uv.y -= 0.4;
	uv.x += 2.75;
	float d = B(uv,1.0);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 1.1;
	d = X(uv,d);uv.x -= 1.1;
	d = I(uv,d);uv.x -= 1.1;
	d = T(uv,d);
	return smoothstep(0.0,0.05,d-0.55*CHS);
}

#define mouse vec2(.5 + 0.1*cos(time*3.+surfacePosition.x*4.+cos(time*3.+surfacePosition.x*4.)), 0.)
#define EULER 2.7182818284590452353602874
#define IEULER 0.367879

#define time mouse.x
float wave(vec2 uv, vec2 emitter, float speed, float phase, float timeshift){
	float dst = distance(uv, emitter);
	return pow(EULER, sin(dst * phase - (time + timeshift) * speed));
}
vec2 wavedrag(vec2 uv, vec2 emitter){
	return normalize(uv - emitter);
}
float getwaves(vec2 position){
    float iter = 0.0;
    float phase = 6.0;
    float speed = 2.0;
    float weight = 1.0;
    float w = 0.0;
    float ws = 0.0;
    float iwaterspeed = 1.0;
    for(int i=0;i<123;i++){
        vec2 p = vec2(sin(iter), cos(iter)) * 300.0;
        float res = wave(position, p, speed, phase, 0.0) * IEULER;
        float res2 = wave(position, p, speed, phase, 0.006) * IEULER;
        position -= wavedrag(position, p) * (res - res2) * weight * 5.0 * iwaterspeed;
        w += res * weight;
        iter += 12.0;
        ws += weight;
        weight = mix(weight, 0.0, 0.12);
        phase *= 1.2;
        speed = pow(speed, 1.014);
    }
    return w / ws;
}

void main( void )
{	
	float w = getwaves(surfacePosition);
	vec3 color = 1.0 - w*vec3(.88-w*.25,1.2,1.3)*1.5;
	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += -0.15+(sin(time)*0.2)+color.g*0.2;
	float dd= GetText(uv*2.0);
	color = mix(color+vec3(.9,0.5,0.3)*0.5+uv.y, color,dd);
	gl_FragColor = vec4( color,1.0 );
}