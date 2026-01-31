#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float color_sin(float val, float offset){
	return (sin(((val+offset)*1.3)*3.1415926)+1.0)/2.0;
}

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}



void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p = p * 3.4;
	p = p*noise(p+9.0);
	
	vec3 color = vec3(0.0);
	
	float y_scale = 1.5;
	float off = 0.2;
	float y_shift = 0.1 + time;
	
	color.r = color_sin(p.y*y_scale, y_shift + off * -1.0);
	color.g = color_sin(p.y*y_scale, y_shift);
	color.b = color_sin(p.y*y_scale, y_shift + off);
	

	gl_FragColor = vec4( color, 1.0 );

}