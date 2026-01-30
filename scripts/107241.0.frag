#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

// Define colors
vec3 red = vec3(0.698, 0.132, 0.203);
vec3 white = vec3(1.0, 1.0, 1.0);
vec3 blue = vec3(0.234, 0.233, 0.430);

vec3 getFlagColor(vec2 uv) {
    if(uv.y < 0.4) {
        float stripeWidth = 1.0/13.0;
        if(mod(uv.y, 2.0*stripeWidth) < stripeWidth) {
            return red;
        }
        return white;
    } else {
        if(uv.x < 0.4) {
            float starSpaceX = 0.08;
            float starSpaceY = 0.07;
            vec2 starUV = mod(uv, vec2(starSpaceX, starSpaceY));
            float distToCenter = length(starUV - vec2(starSpaceX/2.0, starSpaceY/2.0));
            if(distToCenter < 0.03) {
                return white;
            }
            return blue;
        }
        float stripeWidth = 1.0/13.0;
        if(mod(uv.y, 2.0*stripeWidth) < stripeWidth) {
            return red;
        }
        return white;
    }
}

void main(void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv.y = 1.0 - uv.y;  // Invert the y-coordinate
    uv.y = uv.y + sin(uv.x * 10.0 + time) * 0.1;  // Waving effect
    vec3 color = getFlagColor(uv);
    gl_FragColor = vec4(color, 1.0);
}