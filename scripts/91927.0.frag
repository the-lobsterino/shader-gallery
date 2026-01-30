#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// An even more readable version of https://www.shadertoy.com/view/sslBDj, giving named variables 
// and expanding some of the more dense code.

void mainImage(out vec4 fragColor, vec2 fragCoord) {
    fragCoord *= 7.0 / resolution.xy;
    fragColor -= fragColor;
    
    float vertSineWave = 4.0 + cos(time / 2.0);
    
    for (float i = -30.0; i < 9.0; i++) {
	float horizSineWave = vertSineWave * 0.95 * (fragCoord.x - sin(i / 2.0 + time));
        float blackOrWhite = mod(i, 2.0);
        float shadingSineWave = 0.9 - 0.3 * sin(horizSineWave);
        fragColor += (blackOrWhite * shadingSineWave - fragColor) * smoothstep(0.0, 15.0 / resolution.y, 4.0 / vertSineWave * cos(horizSineWave) - i / 6.0 - fragCoord.y);
    }
}

void main(void) {
	mainImage(gl_FragColor, gl_FragCoord.xy);
}