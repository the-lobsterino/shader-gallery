#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

#define A 2.25 // Amplitude
#define V 2.5 // Velocity
#define W 1.1 // Wavelength
#define T 1.3 // Thickness
#define S 2.5 // Sharpness

float mmmm_sine(vec2 p, float o){
    // Offset the sine function by subtracting 1.0 from p.y to keep the line at the bottom
    return pow(T / abs((p.y + sin((p.x * W + o)) * A)), S);
}

// Gaussian function to create a glow effect
float mmmm_gaussian(float x, float sigma){
    return exp(-0.5 * (x * x) / (sigma * sigma));
}

void sub_mmmm()
{
    vec2 p = gl_FragCoord.xy / resolution.xy * 5. - 1.;

    // Calculate the sine value for the current pixel
    float sinevalue = mmmm_sine(p, 12.*0.1 * V);

    // Set the RGB channels to color the sine line (red: 10, green: 60, blue: 112)
    vec3 lineColor = vec3(160.0 / 255.0, 132.0 / 255.0, 232.0 / 255.0);

    // Glow effect using Gaussian function
    float glow = mmmm_gaussian(sinevalue, 0.3); // Adjust the second parameter for glow intensity

    // Blend the background color (black) with the line color using the glow effect
    vec3 finalColor = mix(lineColor, vec3(0.0), glow);

    // Set the alpha value to 1 for the sine line, and 0 for the background
    gl_FragColor += vec4(finalColor, sinevalue);
}

vec2 tile_num = vec2(40.0,16.0);
void main( void ) {
vec2 p = gl_FragCoord.xy/resolution.xy;
p.x+=time*0.05;
vec2 p2 = floor(p*tile_num)/tile_num;
p2.x+=time*0.0;
float vb = .75*sin(16.*(p2.x+p2.x*5.50)+time*0.5)+0.5;
gl_FragColor -= vec4(0.,0.,p.y*vb,1);
sub_mmmm();
}