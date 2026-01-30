// -----------------------------------------------------
// by bobsans from V4 by nabr
// License Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
// https://creativecommons.org/licenses/by-nc/4.0/
// -----------------------------------------------------

precision highp float;
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){
	p.y+=1.75*CHS;
	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));
	p+=vec2(0.5,-3.25)*CHS;
	return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	uv.y += sin(time*0.5+uv.x*1.6)*0.2;
	
	float v = 0.5+sin(time*2.0)*0.5;
	v*=7.0;
	float t = mod((v),7.0);
	float d = 2000.0;
	
	if (t>1.0)
		d = B(uv,1.0);uv.x -= 1.1;
	if (t>2.0)
		d = R(uv,d);uv.x -= 1.1;
	if (t>3.0)
		d = E(uv,d);uv.x -= 1.1;
	if (t>4.0)
		d = X(uv,d);uv.x -= 1.1;
	if (t>5.0)
		d = I(uv,d);uv.x -= 1.1;
	if (t>6.0)
		d = T(uv,d);
	return smoothstep(0.0,0.15,d-0.55*CHS);
}
void main() {
		vec2 pp = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec2 u = (1.0 - 2.0) * surfacePosition;
    vec3 ht = smoothstep(0.0, 2.0, 10.0 - dot(u, u)) * vec3(u * 0.02, -1.0);
    vec3 n = 100.0 * normalize(ht - vec3(0.0, -0.5 * fract(0.015), 0.65));
    vec3 p = n;
    for (float i = 0.0; i <= 20.0; i++) {
        p = 10.0 * n + vec3(cos(0.325 * time - i - p.x) + cos(0.325 * time + i - p.y), sin(i - p.y) + cos(i + p.x), 1);
        p.xy = cos(i) * p.xy + sin(i) * vec2(p.y, -p.x);
    }
    float tx = 5.0 * sqrt(dot(vec3(3.0, 0.0, 5.0), -p));
	
	vec3 col = vec3(pow(sin(vec3(1.5, 0.0, 0.0) - tx) * 0.45 + 0.5, vec3(1.5)));
	
	float d= GetText(pp*2.0);
	col = mix(col+vec3(.2,.7,1.7), col,d);	
	
    gl_FragColor = vec4(col.xyz, 1.0);
}