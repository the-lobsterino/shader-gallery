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
	

float rectShape( float radius, vec2 size, vec2 position, vec2 center) {

	return length( max(abs(center - position) - size , 0.0)   ) - radius;
}
	

void main( void ) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);
	position.x *= (resolution.x / resolution.y);
	vec4 rs = vec4(0.5,0.5,0.0,1.0);
	vec2 center = vec2(0.5);
	vec2 size = vec2(0.3,0.2);
	float radius = 0.1;
	
	float edgeSoftness = 0.01;
	
	float dis = rectShape(radius, size,position, center);
	float alpha = 1.0 - smoothstep(0.0, 0.01, abs(dis));
	rs.a = alpha;
	gl_FragColor = rs;
}