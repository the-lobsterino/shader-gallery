#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159265, tau = 6.2831853;

vec4 location = vec4(resolution.xy * 0.5, 0.0, 0.0);
vec4 vel = vec4(8.0, 8.0, 0.0, 0.0);

vec4 when_eq(vec4 x, vec4 y) {
  return 1.0 - abs(sign(x - y));
}

vec4 when_neq(vec4 x, vec4 y) {
  return abs(sign(x - y));
}

vec4 when_gt(vec4 x, vec4 y) {
  return max(sign(x - y), 0.0);
}

vec4 when_lt(vec4 x, vec4 y) {
  return max(sign(y - x), 0.0);
}

vec4 when_ge(vec4 x, vec4 y) {
  return 1.0 - when_lt(x, y);
}

vec4 when_le(vec4 x, vec4 y) {
  return 1.0 - when_gt(x, y);
}

vec4 _and(vec4 a, vec4 b) {
  return a * b;
}

vec4 _or(vec4 a, vec4 b) {
  return min(a + b, 1.0);
}

vec4 _not(vec4 a) {
  return 1.0 - a;
}

void drawPoint( out float color, in vec2 fragCoord, in vec2 Coord, in float Thickness )
{	
	if (distance(fragCoord.xy, Coord) < Thickness) {
		color += 1.0;	
	};
}

void update( void )
{
	location += vel;
	/*
	if (length(location) > 0.0) {
		location += vel * when_lt(location, vec4(resolution.x, resolution.y, 0.0, 0.0));
	};
	*/
}

void render( out vec4 fragColor, out float color, in vec2 fragCoord )
{
	update();
	
	float angle = mod(time * 0.75, pi * 2.0);
	
	vec2 point = location.xy; // vec2( sin(angle), cos(angle) ) * 24.0;
	
	// point += mouse * resolution;
	
	drawPoint( color, fragCoord, point, 1.5 );
}

void main( void ) 
{	
	float color = 0.0;
	
	render(gl_FragColor, color, gl_FragCoord.xy);
	
	color = min(color, 1.0);
	gl_FragColor = vec4( vec3( color, color, color ), 1.0 );
}