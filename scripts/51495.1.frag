#ifdef GL_ES
precision mediump float;
#endif

#define ROTATION_SPEED 0.5

#define R_R 0.4
#define R_G 0.2
#define R_B 0.4

#define A_R 0.7
#define A_G 0.2
#define A_B 0.1

uniform float time;
uniform vec2 resolution;


void main(void)
{
    vec2 uv = (gl_FragCoord.xy / resolution.xy) - vec2(0.5, 0.5);
    uv.x *= resolution.x/resolution.y;
      
	uv.x += sin(time)*0.25;
	uv.y -= cos(time)*0.25;
    // Calculate polar coordinates from cartesian.
    float polar_r = length(uv);
    float polar_theta = atan(uv.y, uv.x);

    // Intensity depends on r and theta.
    float intensity_r = sin(polar_r * 12.0);
    float intensity_a = sin((polar_theta + (ROTATION_SPEED * time)) * 12.0);
	
    // Blend (intensity_a is multiplied by polar_r to get a fade towards the centre).
    float r = (intensity_r * R_R) + (intensity_a * A_R * polar_r);
    float g = (intensity_r * R_G) + (intensity_a * A_G * polar_r);
    float b = (intensity_r * R_B) + (intensity_a * A_B * polar_r);

    gl_FragColor = vec4(r, g, b, 1.0);
}