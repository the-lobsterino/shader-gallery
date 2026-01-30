
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define PI 3.14159265359

#define SCALE 20.

#define CORNER 20.

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));} float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);} float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);} float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));} float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);} float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);} // DOGSHIT
#define X E
#define I E
#define T E
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
	d = smoothstep(0.0,0.17,d-0.2*CHS);
	return d;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 position = surfacePosition * SCALE;
	vec2 realPos = ( gl_FragCoord.xy / resolution.xy) - 0.5;
	realPos.x *= resolution.x / resolution.y;
	
	vec2 mousePos = vec2(sin(time)*0.3,cos(time)*0.3);	//(mouse) - 0.5;
	mousePos.x *= resolution.x / resolution.y;
	vec3 light = vec3((mousePos - realPos), 0.5);

	vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	uv.y +=0.7;
	//uv.y += (sin(time+uv.x)*0.2);
	float dd= GetText(uv*2.0);
	
	     dd *= GetText(uv*2.-1.0-vec2(-1.0,1.0));
	//color *= 1.-dd;

	vec3 normal = normalize(vec3(4.*tan(PI*dd),4.*tan(PI*dd), CORNER)); //tan(position.x * PI), tan(position.y * PI), CORNER));
	
	float bright = dot(normal, normalize(light));
	bright = pow(bright, 1.);
	//bright *= step(length(position), 1.);
	
	vec3 color = hsv2rgb(vec3((floor(position.x + 0.5) + time)/SCALE, 1., 1.)) * bright;
	
	vec3 heif = normalize(light + vec3(0., 0., 1.));
	
	vec3 spec = vec3(pow(dot(heif, normal), 96.));
	
	color += spec;
		

	//gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	gl_FragColor = vec4(color, 1.);

}