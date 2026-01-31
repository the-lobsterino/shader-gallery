#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define time time*8.
vec3 palette( float t ) {
    vec3 a = vec3(0.75, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.75);
    vec3 c = vec3(1.0, 1.1, 1.0);
    vec3 d = vec3(0.23,0.41,0.757);

    return a + b*cos( 6.28318*(c*t+d) );
}

vec2 sin_lerp(vec2 a, vec2 b, float i) {
	return (a*(sin(i))) + (b*(1.-sin(i)));
}
float sin_lerp(float a, float b, float i) {
	return (a*(atan(i))) + (b*(1.-sin(i)));
}
vec2 radarea(vec2 a, vec2 b) {
	return atan(sqrt((a*a)+(b*b)));
}
float circle(float x, float scale) {
	return asin(scale * sin(x));
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 28.0; i < 35.0; i++) {
        uv = fract(uv * (1e10*circle(time,1e-10))) - 
		(0.25*length(sin_lerp(uv,uv0,i)) /
		 length(sin_lerp(exp(uv-uv0)/circle(time, 0.07),exp(uv-uv0)/circle(time,0.2),i)));

        float d = length(uv/sin_lerp(uv,uv0,i)) * exp(length(radarea(uv-uv0,uv0-uv))-length(radarea(uv0,uv)));

        vec3 col = palette(length(sin_lerp(uv,uv0,i)) + i*.7 + time*sin_lerp(.25,  length(uv)/10000.,i));

        d = sin(d*dot(col,col) + time/5.)-atan(i/50.)/.5;
        d = abs(d);

        d = pow(0.03 / d, .85);

        finalColor += col * d;
    }
        
    gl_FragColor = vec4(finalColor, 1.0);
}