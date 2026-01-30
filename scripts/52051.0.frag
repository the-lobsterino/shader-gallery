#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool raycastBox(vec3 pos, vec3 dir, vec3 cubePos) {
	vec3 cubeSpace = pos - cubePos;
	
	vec3 planeSpace;

	// z
	planeSpace = cubeSpace - vec3(0,0,.5);
	planeSpace.xy += dir.xy / dir.z * -planeSpace.z;	
	if(abs(planeSpace.x) < .5 && abs(planeSpace.y) < .5) return true;
	
	planeSpace = cubeSpace - vec3(0,0,-.5);
	planeSpace.xy += dir.xy / dir.z * -planeSpace.z;	
	if(abs(planeSpace.x) < .5 && abs(planeSpace.y) < .5) return true;
	
	// x
	planeSpace = cubeSpace - vec3(-.5,0,0);
	planeSpace.zy += dir.zy / dir.x * -planeSpace.x;	
	if(abs(planeSpace.z) < .5 && abs(planeSpace.y) < .5) return true;
	
	planeSpace = cubeSpace - vec3(.5,0,0);
	planeSpace.zy += dir.zy / dir.x * -planeSpace.x;	
	if(abs(planeSpace.z) < .5 && abs(planeSpace.y) < .5) return true;

	planeSpace = cubeSpace - vec3(0,.5,0);
	planeSpace.xz += dir.xz / dir.y * -planeSpace.y;	
	if(abs(planeSpace.x) < .5 && abs(planeSpace.z) < .5) return true;
	
	planeSpace = cubeSpace - vec3(0,-.5,0);
	planeSpace.xz += dir.xz / dir.y * -planeSpace.y;	
	if(abs(planeSpace.x) < .5 && abs(planeSpace.z) < .5) return true;
	
	return false;
}

bool raycastFractal(vec3 pos, vec3 dir, vec3 cubePos, int level) {
	if(raycastBox(pos, dir, vec3(-1,1,0))) return true;
	if(raycastBox(pos, dir, vec3(0,1,0))) return true;
	if(raycastBox(pos, dir, vec3(+1,1,0))) return true;

	return false;
}

vec4 raycast(vec3 pos, vec3 dir) {
	if(raycastFractal(pos, dir, vec3(0), 0)) return vec4(1,0,0,1);	
	return vec4(0,0,0,1);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2. - 1.;
	
	vec3 pos = vec3(0,0,-5);
	vec3 dir = vec3(position.xy, 1);
	//dir.xy += (mouse.xy * 2. - 1.);
	normalize(dir);
	
	gl_FragColor = raycast(pos, dir);
}