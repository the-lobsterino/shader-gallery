#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define time fract(dot(surfaceSize,1.0-surfaceSize.yx))

float f() 
{
	return 2.0+floor( 262143.0 * sin(time*0.1) );
}

float cog(vec2 pos, vec2 center, float color, float r0, float r1, float speed) {
	vec2 d = center - pos;	
	float theta = atan(d.y/d.x);
 	
	float gear = floor(sin(theta*f()+speed*time)+1.0);
	gear = clamp(gear, 0.0, 1.0);
	gear *= r1;
	
	float r = gear + r0;
	
	return r < length(d) ? 0.0 : color;
}

void main( void ) {
	float aspect = resolution.x / resolution.y;
	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	pos.x *= aspect;
	pos = surfacePosition;
	
	vec4 col = vec4(0.0);
	
	col += vec4(cog(pos, vec2(0.0, 0.0), 0.5, 0.5, 0.1, 0.5));
	
	col += vec4(cog(pos, vec2(0.2, 0.20), 1.0, 0.2, 0.05, 1.0));
	col += vec4(cog(pos, vec2(-0.125, -0.12), 1.0, 0.2, 0.05, -1.0));
	col = clamp(col, 0.0, 1.0);
	
	col -= vec4(cog(pos, vec2(0.25, 0.0), 1.0, 0.2, 0.05, -1.0));
	col -= vec4(cog(pos, vec2(-0.055, -.305), 1.0, 0.18, 0.04, 1.0));
	
	gl_FragColor = col;
}