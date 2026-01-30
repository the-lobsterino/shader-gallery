#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float time;

void main( void ) {
    vec2 position = ( gl_FragCoord.xy / resolution.xy );
    vec2 p = position * 2. - 1.;
    p.x *= resolution.x / resolution.y;

    vec2 p2 = floor(p * 16.);
    p = fract(p * 16.);
    
    #define N(x) (fract(sin(dot(x, vec2(375., 479.))) * 292.))
    float dir = sign(N(p2)) - .5;

    float t = smoothstep(0.1, .9, fract(time)) + floor(time);
    float dir2 = sign(N(p2 + sin(floor(time)))) - .5; 
    float offset = t * dir2;
    
    vec4 c = vec4(0.0);
    float stripePattern;

    // Cambia l'orientamento delle linee ogni 4 secondi
    if (mod(floor(time / 4.0), 2.0) == 0.0) {
        stripePattern = smoothstep(.2, .22, abs(fract(p.x + dir * p.y + offset) - .5));
    } else {
        stripePattern = smoothstep(.2, .22, abs(fract(p.y + dir * p.x + offset) - .5)); // Cambia asse
    }
    
    // Mix giallo e nero in base al pattern delle righe
    c = mix(vec4(1.0, 1.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), stripePattern);
    gl_FragColor = c;
}
