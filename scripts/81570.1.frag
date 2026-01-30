#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}


void main( void ) {

	vec2 coords = vec2(gl_FragCoord.x * 1.77777777778, gl_FragCoord.y);	
	
    vec2 res = coords.xy/resolution;

	
	
    //vec2 translate = vec2(cos(u_time),sin(u_time));
    //res += translate*0.35;
    res *= 5.0;
    res = fract(res); 

    float circle =  distance(res, vec2(0.5, 0.5));

    float color =
    map(
    step(map(sin(time * 2.5), -1.0, 1.0, 0.1, 0.3), circle),
    0.0, 1.0, 1.0, 0.0);

    vec3 colorFinal = mix(vec3(0.4118, 0.0902, 0.5608), 
      vec3(0.5961, 0.0824, 0.8941), color
    );

    gl_FragColor = vec4(vec3(colorFinal),1.0);

}