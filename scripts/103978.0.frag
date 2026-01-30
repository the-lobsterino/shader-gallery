#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
uniform vec4 mouse;
uniform vec4 date;

/* This animation is the material of my first youtube tutorial about creative
   coding, which is a video in which I try to introduce programmers to GLSL
   and to the wonderful world of shaders, while also trying to share my recent
   passion for this community.
                                       Video URL: https://youtu.be/f4s1h2YETNY
*/

//https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(1.5, 2.5, 0.5);
    vec3 b = vec3(2.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(1.263,0.416,0.557);

    return a + b*cos( 522.28318*(c*t+d) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    vec2 uv = (fragCoord * 2.0 - resolution.xy) / resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(.0);

    for (float i = 1.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 1.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i*.4 + time*.4);

        d = sin(d*8. + time)/4.;
        d = abs(d);

        d = pow(.01 / d, 1.2);

        finalColor += col * d;
    }

    fragColor = vec4(finalColor, 1.0);
}

void main() {
	vec4 fragment_color;
	mainImage(fragment_color, gl_FragCoord.xy);
	gl_FragColor = fragment_color;
}





