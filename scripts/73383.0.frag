#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return (a + b*cos( 6.28318*(c*t+d) ));
}

vec3 pal(float t) {
	return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

float fn(float x)
{
	float y = cos(x);
	y = abs(y);
	return 1.0-y*y; // * 0.5 + 0.5;
}

void main( void ) {
	
	vec2 s = ((surfacePosition)); 
	
	float i = floor( time + abs(resolution.x*resolution.y/2.0-gl_FragCoord.y * resolution.x + gl_FragCoord.x) );
	
	i = i / (resolution.x*resolution.y);
	
	float d = dot(s,s);
	
	float f = fn( d + i );//(1.0 - d / i) / (1.0 - i*i) );
	
	float o = f / (1.0+f*f);//fn(f+fn(i+f*i+surfaceSize.x*surfaceSize.y));
	
	o = fract( o );
	
	o = fract( o + fract(time*10.0) + s.x*s.y );
	
	gl_FragColor = vec4( pal(o), 1.0 );

}