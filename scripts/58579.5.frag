// BREXIT
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;
uniform vec2 resolution;

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
	d = smoothstep(0.0,0.05,d-0.55*CHS);
	return d;
}

// Squish and strech the tunnel
#define STRETCH 0.5
#define SQUISH 0.1

// Thickness of the hexagon lines
#define THICKNESS 0.2

float hex(vec2 p, float r) {
	p = abs(p);
	return max(p.x+p.y*0.57735,p.y*1.1547)-r;
}

vec3 tex(vec2 pos) {
	vec2 p = pos*32.0; 

	p.x *= 1.1547;
	p.y += mod(floor(p.x), 2.0)*0.9;
	p = mod(p, 1.0) - 0.5;
	float d = max(-hex(vec2(p.x/1.1547,p.y),0.57735), hex(vec2(p.x*1.5*0.57735, p.y),0.57735));
	
	float r = THICKNESS;	
	
	float dd = smoothstep(r-0.05, r, d);
	
	return vec3(dd*0.4,dd*0.9,dd*0.4);
}

void main(void) {
	vec2 p = surfacePosition;
	float a = atan(p.x,p.y);
	float r = sqrt(dot(p,p))+.1-.1;

	vec2 uv;
	uv.x = time*0.1+(SQUISH/r);
	uv.y = a/3.14159265358979*STRETCH;
	uv = fract(uv);
	vec3 col = tex(uv)*r*r;

	uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y += (sin(time+uv.x)*0.2);
	float dd= GetText(uv*2.0);
	col = mix(col+vec3(1.2,0.6,0.2)*0.5+uv.y, col,dd);

	
	gl_FragColor = vec4(col,1);
}
