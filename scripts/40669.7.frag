#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform float time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 hourglass(vec2 st) {
    // vertical shaping functions
    float horizon = smoothstep(1., .5 - sin(time) / 3., st.y);
    float horizon2 = smoothstep(0., .5 + sin(time) / 3., st.y);
    // move the centre to the middle
    float x = st.x - 0.5;
    // create horizontal shaping functions
    float shape = pow(10. * x, -2.);
	float shape2 = pow(20. * x, -2.);
	float shape3 = pow(60. * x, -2.);

    vec3 color = vec3((1. - horizon * horizon2) * shape * 0.5, 0., 0.05);
	color = color + vec3(0., (1. - horizon * horizon2) * shape2 * 0.5, 0.);
	color = color + vec3(0., 0., (1. - horizon * horizon2) * shape3 * 0.5);
	
	vec3 circle = vec3(0., 0., 0.);
	
    return color;
}

void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;

    vec3 color = hourglass(st);
    color += hourglass(rotate2d(.5 * PI) * st + vec2(0., 1.));
    color += hourglass(rotate2d(.75 * PI) * st + vec2(0.5, 1.215));
    color += hourglass(rotate2d(.25 * PI) * st + vec2(-.205, .5));
    color += hourglass(rotate2d(.125 * PI) * st + vec2(-.15, .25));
    color += hourglass(rotate2d(.625 * PI) * st + vec2(.23, 1.15));
    color += hourglass(rotate2d(.875 * PI) * st + vec2(.775, 1.15));
    color += hourglass(rotate2d(.375 * PI) * st + vec2(-.175, .75));
	
    gl_FragColor = vec4(color,1.0);
}