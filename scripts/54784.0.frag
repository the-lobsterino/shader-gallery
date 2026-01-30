// https://www.shadertoy.com/view/4dcyW7

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define tri(t, scale, shift) ( abs(t * 2. - 1.) - shift ) * (scale)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}


void main( void ) {
	
 	vec2 R = resolution.xy;
    vec2 uv = ( gl_FragCoord.xy - 0.5 * R ) / R.y + 0.5;
    
    // sun
    float dist = length(uv-vec2(0.5,0.5));
    float divisions = 6.0;
    float divisionsShift= 0.5;
	
    float pattern = tri(fract(( uv.y + 0.5)* 20.0), 2.0/  divisions, divisionsShift)- (-uv.y + 0.26) * 0.85;
    float sunOutline = smoothstep( 0.0,-0.015, max( dist - 0.315, -pattern)) ;
   
    vec3 c = sunOutline * mix(vec3( 4.0, 0.0, 0.2), vec3(1.0, 1.1, 0.0), uv.y);  
    
    // glow 
    float glow = max(0.0, 1.0 - dist * 1.25);
    glow = min(glow * glow * glow, 0.325);
    c = glow * vec3(1.5, 0.3, (sin(time)+ 1.0));

 
    //vec2 ground;
    
    vec2 planeuv = uv;
 
    gl_FragColor = vec4(c,1.0);	

}