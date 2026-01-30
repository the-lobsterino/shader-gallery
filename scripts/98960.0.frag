#ifdef GL_ES

precision mediump float;

#endif



uniform float u_time;

uniform vec2 u_resolution;



void main() {

    vec2 p = (gl_FragCoord.xy / u_resolution.xy) - 0.5;



    float t = u_time * 0.5;



    // Colors

    vec3 pink = vec3(1.0, 0.4, 0.7);

    vec3 blue = vec3(0.4, 0.5, 1.0);

    vec3 orange = vec3(1.0, 0.7, 0.3);

    vec3 bg = vec3(0.1, 0.1, 0.1);



    // Checkerboard

    float checker = mod(floor(p.x * 10.0) + floor(p.y * 10.0), 2.0);



    // Circle

    float d = length(p);

    float circle = smoothstep(0.3, 0.31, d);



    // Gradient

    float grad = smoothstep(-0.3, 0.3, p.y);



    // Combine

    vec3 color = mix(bg, pink, circle);

    color = mix(color, blue, checker);

    color = mix(color, orange, grad);



    gl_FragColor = vec4(color, 1.0);

}