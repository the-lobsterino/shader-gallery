#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float DistFrom(vec2 position1, vec2 position2);
float Circle(vec2 position, vec2 center, float radius);

float width = 0.1;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	float a = 1.0;
	
	vec2 center = vec2(0.5, 0.5);
	
	float radius = 0.5;
	
	float gScale = 0.1;
	float gOffset = 0.5;
	
	float rScale = 1.0;
	float rOffset = 0.0;
		
	r += Circle(position, center, abs(sin(radius+time))-0.6);

	gl_FragColor = vec4(vec3(r, g ,b), a);

}

float DistFrom(vec2 position1, vec2 position2) {
	vec2 modifiedPos2 = vec2((position2.x - position1.x)*2.0, position2.y - position1.y);
	
	return sqrt(modifiedPos2.x*modifiedPos2.x + modifiedPos2.y*modifiedPos2.y);
}

float Circle(vec2 position, vec2 center, float radius) {
	
	radius = abs(radius);
	
	bool inBand = DistFrom(position, center) > radius && DistFrom(position, center) < radius + width;
	
	float distThroughBand = DistFrom(position, center) - radius;
	
	if (inBand) {
		return sin(4.0*distThroughBand/width);
	} else {
		return 0.0;
	}
}