#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 fishEye(vec2 uv, float amp) {
    float len = length(uv);
    float a = len * amp;
    return vec3(uv / len * sin(a), -cos(a));
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy / resolution.xy) + (vec2(0.5) - mouse.xy);

    	uv = uv * 2.0 - 1.0;
    	uv.x *= resolution.x / resolution.y;
    	vec3 dir = fishEye(uv, sin(time) + 1.5);
	float c = cos(time);
    	float s = sin(time);
	dir.xz = vec2(dir.x * c - dir.z * s, dir.x * s + dir.z * c);
	
	vec3 color = pow(abs(fract(dir * 8.0) - 0.5), vec3(4.0)) * 16.0;

	gl_FragColor = vec4(color, 1.0 );

}