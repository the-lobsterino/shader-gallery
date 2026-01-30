#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	/*float ave = (position.x + position.y) / mod(time, 2.5);
	gl_FragColor = vec4(vec3(position.x, position.y, ave), 1.0);*/
	float localTime = mod(time, 6.0);
	float t = time/localTime;
	float red = 1.0-((1.0/9.0*localTime*localTime)+2.0/3.0*localTime)*position.x*t;
	float green = ((1.0/9.0*localTime*localTime)+2.0/3.0*localTime)*position.y*t;
	float blue = ((1.0/9.0*localTime*localTime)+2.0/3.0*localTime)*position.x*position.y*t;
	gl_FragColor = vec4(vec3(red, green, blue), 1.0);

}