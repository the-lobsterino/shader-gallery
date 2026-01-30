// ändrom3da tweaked this...

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define PI 3.141592653589793238462643383279
#define CELL_SIZE 50.0

float rand(vec2 co) {
	
    return fract(sin(dot(co, vec2(12.9898+((time+2.)/8000.), 78.233))) * 43758.5453) * 2.0 - 1.0;
}

vec2 randDir (vec2 co) {
	
	return vec2(cos(rand(co) * PI), sin(rand(co) * PI));
}


float cornerInfluence(vec2 fragPos, vec2 cellCorner) {
	
	float ratio = resolution.x / resolution.y;
	vec2 gridSize = vec2(CELL_SIZE * ratio, CELL_SIZE);
	
	vec2 gridPos = floor((fragPos + cellCorner / gridSize) * gridSize) / gridSize;
	vec2 offsetVector = normalize(gridPos - fragPos); 
	
	vec2 influence = randDir(gridPos);
	float bigFactor = +64.;
	return (dot(offsetVector+bigFactor, influence));
}

void main( void ) {

	vec2 pos = 3.*( gl_FragCoord.xy / resolution );
	 
	pos -= time*(1./8.)*vec2(1.0,1.25);
	float inf0x0 = cornerInfluence(pos, vec2(0.0, 0.0));
	float inf1x0 = cornerInfluence(pos, vec2(1.0, 0.0));
	float inf0x1 = cornerInfluence(pos, vec2(0.0, 1.0));
	float inf1x1 = cornerInfluence(pos, vec2(1.0, 1.0));
	
	float ratio = resolution.x / resolution.y;
	vec2 gridSize = vec2(CELL_SIZE * ratio, CELL_SIZE);
	
	vec2 gridPos = floor((pos) * gridSize) / gridSize;
	
	float sx = (pos.x - gridPos.x) * gridSize.x;
	float sy = (pos.y - gridPos.y)  * gridSize.y;
	
	float ix0 = mix(inf0x0, inf1x0, sx);
	float ix1 = mix(inf0x1, inf1x1, sx);
	
	float v = mix(ix0, ix1, sy);
	
	gl_FragColor = vec4(( vec3(v)), 1.0 );

}