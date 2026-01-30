#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	gl_FragColor = vec4(hsv(cos(p.x * time + time) * sin(p.y + time), 1.0, 1.0), 1.0);

}