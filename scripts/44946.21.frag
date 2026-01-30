#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const vec3 ambient = vec3(0.1,0.0,0.6);
const float radius = 0.5;
const float falloff = 0.2;

vec2 lights[3];
vec3 lightColors[3];
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

void main( void ) {
	lights[0]=vec2(0.3,0.5);
	lights[1]=vec2(0.5,0.3);
	lights[2]=vec2(0.6,0.6);
	lightColors[0]=vec3(0.5,0.0,0.0);
	lightColors[1]=vec3(0.5,0.0,0.0);
	lightColors[2]=vec3(0.5,0.0,0.0);
	vec2 texPosition = ( gl_FragCoord.xy / resolution.xy );
	vec3 lightColor=vec3(0.0);
	float smoothness = 1.0;
	float lightSmooth;
	for(int l = 0; l < 3; l++) {
		vec2 position = texPosition - lights[l];
		position.x *= resolution.x / resolution.y;
		lightSmooth = smoothstep(radius, falloff, length(position));
		if(lightSmooth!=0.0){
			smoothness *= 1.0 - lightSmooth;
			lightColor += lightSmooth * lightColors[l];
		}
	}
	gl_FragColor = vec4(clamp(ambient+lightColor,vec3(0.0),vec3(1.0)),1.0);
}