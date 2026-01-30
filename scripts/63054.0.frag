/*
 * Original shader from: https://www.shadertoy.com/view/XdVGDz
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// static values
const float PI=3.14159265358979323846;
const float TAU = 6.28318530717958647692;
const float STEP_LENGTH = 0.01;
const float ANGLE_OFFSET = PI*0.5;				// angle of dial
const vec4 color1 = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 color2 = vec4(1.0, 1.0, 0.0, 1.0);
const float duration = 3.0;						// duration of dial


// Get the color value based on where in the circle the uv is
vec4 getGradientValue(in vec2 uv)
{
    vec2 dist =	vec2(1.0, 0.0) - vec2(-1.0, 0.0);
	float val = dot( uv - vec2(-1,0), dist ) / dot( dist, dist );
	clamp( val, 0.0, 1.0 );
    
	vec4 color = mix( color1, color2, val );
	// clamp depending on higher alpha value
	if( color1.a >= color2.a )
		color.a = clamp( color.a, color2.a, color1.a );
	else
		color.a = clamp( color.a, color1.a, color2.a );
	return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float progress = mod(iTime, duration) / duration;
    float innerRadius = 0.5;
    float outerRadius = 0.65;
    float startAngle = 0.0;
    float endAngle = progress* TAU;
    vec2 uv = (2.0*fragCoord.xy - iResolution.xy)/iResolution.y;
    float d = length( uv );
    vec4 ioColor = getGradientValue(uv);    

    // Perform adaptive anti-aliasing.
    float w = fwidth( d ) * 1.0;
    float c = smoothstep( outerRadius + w, outerRadius - w, d );
    c -= smoothstep( innerRadius + w, innerRadius - w, d );
    
    // set color for the area within inner and outer radius
    fragColor = vec4(ioColor.rgb * vec3(c), 1.0);
	
    // limit to active progress
    float angle = (atan(uv.y,uv.x)) + ANGLE_OFFSET;
	if( angle < 0.0 ) angle += PI * 2.0;
    if( angle > endAngle){
        float a = smoothstep( 0.75, -w*2.0,  abs(endAngle - angle) );        
        //float a = smoothstep( 0.0, -w*2.0,  abs(endAngle - angle) );        
        fragColor *= a;
    }
    if(angle - w*2.0 < startAngle ){
        float a = smoothstep(  -w*2.0, w*2.0, (abs(startAngle - angle)) );
        fragColor *= a;    
    }
    
    /*
    // round butt stuff
	float lineWidth = (outerRadius - innerRadius) * 0.5;
    float midRadius = innerRadius + lineWidth;
    
   	// distance from pt at end angle
    vec2 endAnglePos = vec2( cos(endAngle-ANGLE_OFFSET), sin(endAngle-ANGLE_OFFSET)) * vec2(midRadius);
    float dist = length( uv - endAnglePos );
    float buttAlpha = smoothstep( lineWidth + w, lineWidth - w, dist );
    fragColor = mix(fragColor, ioColor, buttAlpha );

    // distance from pt at start angle
    vec2 startAnglePos = vec2( cos(startAngle-ANGLE_OFFSET), sin(startAngle-ANGLE_OFFSET)) * vec2(midRadius);
    dist = length( uv - startAnglePos );
    buttAlpha = smoothstep( lineWidth + w, lineWidth - w, dist );
    fragColor = mix(fragColor, ioColor, buttAlpha );
	*/
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}