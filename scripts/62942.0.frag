precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define iResolution resolution
#define iTime time
#define iMouse mouse

void mainImage(out vec4 fragColor, in vec2 fragCoord);

void main(void) {
    vec4 col;
    mainImage(col, gl_FragCoord.xy);
    gl_FragColor = col;
}

//////////

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    // Time varying pixel color
    vec3 col = uv.xyx+vec3(255,0,0);

    // Output to screen
    fragColor = vec4(col,1.0);
}