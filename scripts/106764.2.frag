#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float compute(float t)
{
    // Animated center position
    vec2 center = vec2(0.5 + 0.2 * sin(t * .5), 0.5 + 0.2 * cos(t * .5));

    vec2 pos = (gl_FragCoord.xy / resolution.xy) - center;
    pos.x *= resolution.x / resolution.y;

    // Animate based on the sin of time
    float anim = sin(t * 0.01);

    // Calculate the distance from the animated center and add the animation effect
    float len = length(pos) + 0.1 * sin(20.0 * length(pos) - t * 2.0);

    // Create bands using modulo operation
    float bands = mod(len * 8.0 + anim, 1.0);

    // Smooth out the bands
    float alpha = smoothstep(0.2, 0.35, bands) * (1. - smoothstep(0.7, 0.85, bands));
	alpha = alpha * (1.0 - alpha);
	
    return alpha;
}

void main( void ) {
    gl_FragColor = vec4(compute(time), compute(time + 3.5), compute(time - 3.5), 1.);
}
