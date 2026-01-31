

#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 #define rot( a ) mat2( cos( a ), -sin( a ), sin( a), cos( a ) )
const float PI = acos(-1.0);
const float TAU = PI * 2.0;
const float phi = sqrt(5.0) * 0.5 + 0.5;
 
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
vec2 p0;
float goldenAngle =  sin(time/1000.) / (0.5+ abs(cos(time/100.)));

#define time time*40.
vec2 rotateAroundPoint(float x){
    return vec2(sin(time/2.), cos(x));
}
 
vec3 hsv2rgb(vec3 c)
{
    const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
 
vec3 calculateGoldenShape(vec2 p){
    const int steps =64;
    const float rSteps = 1.0 / float(steps);
    
    vec3 result = vec3(0.0);
    
    for (int i = steps; i > 0; --i)
    {
        float n = float(i);
        
        float inc = n * rSteps;
        vec2 offset = rotateAroundPoint(fract(time*0.055)*6.28+n * goldenAngle*cos(time*0.0025)) * inc * 0.45;
        
        vec3 dist = vec3(distance(p, offset));
             dist = exp2(-dist * 64.0) * hsv2rgb(vec3(fract(time*0.2)+inc*0.75, 1.0, 1.0));
        
        result = max(result, dist);
    }
    
    return result;
}
 
void main( void ) {
 
    vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(resolution.x/ resolution.y, 1.0);
#define p position
	p *= rot( time/19. );
	p *= sin( time/65.);
	p0 = gl_FragCoord.xy/resolution; 
    vec3 color = vec3(0.0);
         color += sin(calculateGoldenShape(position) * 3.0);
         color = pow(color, vec3(2.2));
         color /= sin(color + 1.0);
         color = pow(color, vec3(1.0 / 2.2));
 #define c color
 	c = 1. - exp2( -c );
	c = .14*c + .963333*texture2D(bb, p0).xyz;   
    gl_FragColor = vec4(color, 1.0 );
 
}//ändrom3da4twist