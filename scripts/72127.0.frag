#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float sdWhatev(in vec2 p, float r)
{
	float d = 1.0-r/length(p);//dot(p,p);
	
	//p.xy * mat2( 1.0-d, -d, d, 1.0-d );
	
	return d-p.x*p.y;// + d * r;	
}

void main( void ) {

	vec2 uv = floor(surfacePosition*256.0);// * (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;
	
	float t = surfaceSize.x*surfaceSize.y;//time;
	
	//if ( 0.5 > fract(time) ) uv = floor( uv );
	
	float d = sdWhatev(uv, 128.0 * mouse.x );
	
	vec3 col = fract( vec3(d) * t );
	
	gl_FragColor = vec4(col, 1.0);
}