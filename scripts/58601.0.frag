//--- snowflakes ---
// by Catzpaw 2016

// flower and palette variation by I.G.P.

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define COUNT 15.

// cosine based palette color calculation, 4 vec3 params
// http://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{ return a + b*cos( 80.0*(c*t+d) ); }

vec2 hash(vec2 p) { return fract(cos(mat2(42.,87.,49.,61.)*p)*13.); }

float plot(float p,float v) { return smoothstep(v-0.03,v,p)-smoothstep(v,v+0.01,p); }

void main( void ) 
{
  vec3 ca = vec3(1.5, 0.5, 0.5),
       cb = vec3(1.5, 0.5, 0.5), 
       cc = vec3(1.0, 1.0, 0.5), 
       cd = vec3(1.8, 1.9, 0.3);
	float t = time *0.5;
	vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/resolution.y; 
	vec3 finalColor=vec3(0);
	vec2 p,h;
	finalColor += vec3(abs(uv.y*0.1));
	
	for(float i=0.0; i<COUNT; i++)
	{
		h = hash(vec2(i))*(resolution.x/resolution.y);
		p = vec2(uv.x+h.x-h.y+sin(t*h.x)*(h.y*.4-.2), mod(uv.y-i*2.35+t/3.,2.)-1.);
		float r = length(p)*0.9;
		float a = atan(p.y,p.x) +2.*t*(h.y*.1-.1)*sin(0.21*t);
                float f = abs(sin(a*3.)*cos(4.0+a*mod(i,12.)))*.08+.05;
		float v = i / COUNT;
		finalColor += plot(r,f) * palette (v+time*0.1, ca,cb,cc,cd);
		finalColor += plot(0.85*sin(r),f) * palette (v+(22.+time)*0.1, ca,cb,cc,cd);
		finalColor += plot(0.70*sin(r),f) * palette (v+(33.+time)*0.1, ca,cb,cc,cd);
	}
	gl_FragColor = vec4(finalColor,1);
}
