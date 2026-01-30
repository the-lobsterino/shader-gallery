#ifdef GL_ES
precision mediump float;
#endif


//MODS BY 27


#extension GL_OES_standard_derivatives : enable

const float PI = acos(-1.0);
const float TAU = PI * 2.0;
const float phi = sqrt(5.0) * 0.5 + 0.5;

const float goldenAngle = TAU / phi / phi;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotateAroundPoint(float x){
	return vec2(sin(x), cos(x));
}

float calculateGoldenShape(vec2 p){
	const int steps = 512;
	const float rSteps = 1.0 / float(steps);
	
	float result = 0.0;
	
	for (int i = 0; i < steps; ++i){
		float n = float(i);
		
		float inc = sqrt(n * rSteps);
		vec2 offset = rotateAroundPoint(n * goldenAngle*abs(sin(time*0.001)+0.1)) * inc * 0.45;
		
		float dist = distance(p, offset);
		      dist = 1.0 - clamp(dist * 127.0, 0.0, 1.0);
		
		result = max(result, dist);
	}
	
	return result;
}

void main( void ) {

	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(resolution.x/ resolution.y, 1.0);

	vec3 color = vec3(0.0);
	     color += calculateGoldenShape(position);

	gl_FragColor = vec4(color, 1.0 );

}