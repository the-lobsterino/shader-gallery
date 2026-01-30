precision mediump float;

uniform float time;
uniform vec2 resolution;

vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.50, 0.20, 0.252);

    return a + b * cos(6.28318*(c*t+d));
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 2.0; i++) {
        uv = fract(uv * 2.0) - 0.5;
        float d = length(uv);
   
        vec3 col = palette(length(uv0) + time);
   
        d = sin(d*8. + time)/8.;
        d = abs(d);
   
        d = 0.00005/d;

        finalColor += col * d;
    }
   
    gl_FragColor = vec4(finalColor, 1.0);
}
