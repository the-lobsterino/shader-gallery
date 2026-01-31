#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float lum(float r, float g, float b) {
    return sqrt(0.299*r*r + 0.587*g*g + 0.114*b*b);
}


float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
    if (t < 0.5) return q;
    if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
    return p;
}

vec3 hsl2rgb(float h, float s, float l) {

    float r, g, b;
    if (s == 0.0) {
        r = g = b = l; // achromatic
    } else {
        float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
        float p = 2.0 * l - q;
        r = hue2rgb(p, q, h + 1.0 / 3.0);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1.0 / 3.0);
    }

    return vec3(r, g, b);
}

vec3 hsx2rgb(float hue, float sat, float targetLuminance) {
	
    vec3 color = hsl2rgb(hue, sat, targetLuminance);
    const float epsilon = 0.001;
    float low = 0.0;
    float high = 1.0;
    float mid;

    for(int i = 0; i < 16; i++) { // Limiting the number of iterations for performance
        mid = (low + high) * 0.5;
        vec3 rgb = hsl2rgb(hue, sat, mid);
        float currentLum = lum(rgb.r, rgb.g, rgb.b);

        if (currentLum < targetLuminance) {
            low = mid;
        } else {
            high = mid;
        }

        if (high - low < epsilon) {
            break; 
        }
    }

    return hsl2rgb(hue, sat, mid);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float value = mouse.x;
	
	float hue = position.x;
	float sat = position.y;
	
	//color = rgb2hsl(color.r, color.g, color.b);
	//color = hsl2rgb(color.r, color.g, color.b);
	
	
	//color = balance(color, value);	
	vec3 color = hsx2rgb(hue, sat, value);
	
	
	float lum1 = lum(color.r, color.g, color.b);
	gl_FragColor = vec4( vec3(lum1), 1.0 );
	gl_FragColor = vec4( color, 1.0 );
	

}