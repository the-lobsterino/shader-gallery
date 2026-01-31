//run on https://glslsandbox.com/e //changes over time
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
    vec2 position = (gl_FragCoord.xy / resolution.xx);

    int maxLoop = 100;
    int j = 0;
    float x = 0.0;
float q = 0.0;
    float y = 0.0;

    for (int i = 0; i < 1000; ++i) {
        float tempX = (x * x) - (y * y) + (position.x * 5.9 - 3.5); // Adjusted scaling
        y = (x * 2.0 * y) + (position.y * 5.9 - 1.4); // Adjusted scaling
        x = tempX;

        j++;
        if ((x * x + y * y) > 60.6) break;
	q=float(j+1);
    }

    float j2 = float(j);
    j2 = clamp(j2, 0.0, float(maxLoop));

    // Adjust color based on iteration count
    float color = q/time;//q/17.;//q/(mouse.x*70.); //j2 / float(maxLoop);
    gl_FragColor = vec4(vec3(color), 1.0);
}