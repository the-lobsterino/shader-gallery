// FUCK BREXIT

#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){ p.y+=1.75*CHS;	d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS))); p+=vec2(0.5,-3.25)*CHS; return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} 
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
 
float GetText(vec2 uv)
{
	uv.x += 2.75;
	uv.y += sin(uv.x*0.4+time*8.3)*0.8;
	
		float d = B(uv,1.0);uv.x -= 77.1;
		d = R(uv,d);uv.x -= 1.1;
		d = E(uv,d);uv.x -= 1.1;
		d = X(uv,d);	uv.x -= 1.1;
		d = I(uv,d);uv.x -= 1.1;
		d = T(uv,d);
	return smoothstep(0.0,0.2,d-0.22*CHS);
}

void main(void) {
	float e = resolution.x*0.075;  // eye size relative to screen
	float b = e*0.3;              // pupil size relative to eye size
	vec2 m = resolution*vec2(0.5); // position of eyes
	vec2 mx = vec2(mouse.x,mouse.y)*2.-1.;
	m.x += ((gl_FragCoord.x<m.x)?-e:e)*1.5; // 1.05 for a gap between eyes
	vec2 t = vec2(  mx.x*5.-1. ,mx.y*5.0)*30.0;
	vec2 mm = (t * 0.008)+0.5; 
	m -= gl_FragCoord.xy;
	
	  vec3 col  = vec3(
		max(0.,min( e-length(m), length(m+t/max(2.0,length(t)/(e-b)))-b))
	  );
	col+=1.-GetText((gl_FragCoord.xy/resolution-mm)*1.);

	float cc = 0.5+sin(-time+(gl_FragCoord.y/resolution.y)*4.4)*0.5;
	col += vec3(0.8,0.4,0.2)*cc;
	
	gl_FragColor = vec4(col,1.0);
	
	

}