//Robert Schütze (trirop) 17.04.2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// press left mouse button on [pan/zoom] to move around
// press right mouse button on [pan/zoom] to zoom in/out
varying vec2 surfacePosition;

// see also Collatz by iq
// https://www.shadertoy.com/view/llcGDS 

vec2 zpowz(vec2 z)
{
	float a = z.x;
	float b = z.y;
	float arg = atan(b,a-0.5+0.4*sin(time));
	float powArg = 0.5*b*log(a*a+b*b)+a*arg;
	return pow(a*a+b*b,a/2.)*exp(-b*arg)*vec2(cos(powArg),sin(powArg));
}

void main ( void )
{
	//vec2 uv = (2.*gl_FragCoord.xy/resolution.y-vec2(resolution.x/resolution.y,1))*-3.;
	vec2 uv = surfacePosition*-3.0;
	for(int i = 0;i<14;i++){
		uv = zpowz(uv.yx);
	}
	gl_FragColor = vec4(sign(uv.y),abs(uv),1.);	
}

