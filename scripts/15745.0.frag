//xL
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rd = vec3(1.0 , 0.0, 0.0);
vec3 gr = vec3(0.0 , 1.0, 0.0);
vec3 bl = vec3(0.0 , 0.0, 1.0);
vec3 ye = rd + gr;
vec3 cy = gr + bl;
vec3 mg = rd + bl;
vec3 bk = vec3(0.0 , 0.0, 0.0);
vec3 wh = rd + gr + bl;

float ratio = resolution.x/resolution.y;

varying vec2 surfacePosition;

void main( void ) 
{

	vec2 pi = ( gl_FragCoord.xy / resolution.xy )*vec2(2.0,2.0/ratio) - vec2(1.0,1.0/ratio);
	vec2 p = surfacePosition;
	float ti = time*0.5 + length(p) + atan(p.x,p.y)*0.5;
	float a = sin(pi.x * 3.14 * 3.);
	float b = sin(pi.y * 3.14 * 4.);
	float c = a*b;
	float c1 = max(c,0.);
	float d = sin(c * 1.8 + 12.*sin(ti));
	float e = sin(d*800.);
	float f = sin(e*1.6);
	
		
	//vec4 Color = vec4(f, e, 1.-f, 1.);
	vec4 Color = vec4(1.-f,.1-f, .01-f, .00001);
	
	vec4 BgColor = vec4( 
		vec3( mix(mix(cy, mg, (p.x+.50)), 
			  mix(bl, ye, (p.x+.50)), p.y+1.0/ratio) ) , 1.0 );

	gl_FragColor = BgColor*Color;
}