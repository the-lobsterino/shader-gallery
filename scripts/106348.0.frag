#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float circleShape(float radius, vec2 position, vec2 center) {
	float value = distance(position, center);
	return step(radius, value);
}

float ringShape(float maxRadius, float minRadius, vec2 position) {
	float value = distance(position, vec2(0.5));
	return smoothstep(minRadius, maxRadius, value);
}
	
float sdEquilateralTriangle( in vec2 p, in float r )
{
    const float k = sqrt(3.0);
    p.x = abs(p.x) - r;
    p.y = p.y + r/k;
    if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    p.x -= clamp( p.x, -2.0*r, 0.0 );
    return -length(p)*sign(p.y);
}
	

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	position.x *= (resolution.x / resolution.y);
	float radius = 0.2;
	vec2 center = vec2(0.5);
	float a = circleShape(radius, position, center);
	vec4 rs = vec4(1.0);
	float bw = 0.01;
	if (a == 0.0) {
		float xp = circleShape(radius, vec2(position.x + bw, position.y), center);
		float xi = circleShape(radius, vec2(position.x - bw, position.y), center);
		float yp = circleShape(radius, vec2(position.x, position.y + bw), center);
		float yi = circleShape(radius, vec2(position.x, position.y - bw), center);
		if (xp  == 0.0 || xi == 0.0) {
			rs = vec4(0.7,0.1,0.5,1.0);
		} else {
			rs = vec4(0.0,1.0,0.0,1.0);
		}
	} else {
		rs = vec4(1.0,1.0,0.0,a);
	}
		
		
	
	gl_FragColor = rs;
}