/*
 * Original shader from: https://www.shadertoy.com/view/WlsSW2
 */

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
const int n = 2000; // maximum number
const float rate = 2.;
const float acceleration = .2; // increase in rate per second
const float lineThickness = 2.2;
const float colours = .05; // proportion of cells to colour in
const bool wrap = true;
const bool border = true;

const vec2 quasi2 = vec2(.754877666247,.569840290998); // from http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/

void mainImage( out vec4 fragColour, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
    
    if ( border && abs(uv.x) > .5 )
    {
        fragColour = vec4(.8);
        return;
    }
    
    float penOut = lineThickness/iResolution.y;
    float penIn = (lineThickness-2.8)/iResolution.y;
    
    float t = 3. + rate*iTime + 0.5*acceleration*iTime*iTime;
    
    fragColour = vec4(0,0,0,1);

    float scale = 1.;
    
    float closest = 1e38;
    float closest2 = 1e38;
    for ( int i=0; i < n; i++ )
    {
        if ( float(i) > t ) break;
        
        vec2 pos = fract(quasi2*float(i+1));

		if ( wrap )
        {
        	// wrap the pattern based on what pixel we're drawing
            pos += floor(uv+.5-pos);
        }
        else
        {
            pos = fract(pos+.5)-.5; // centre the pattern
        }
        
        vec3 col = sin(vec3(1,2,3)+vec3(7,11,5)*(float(i*(1+i/30))))*.5+.5;
        if ( fract(col.y*64.) > colours ) col = vec3(1);

        float l = length(pos-uv);
        
        // animate the last one
        l += smoothstep(1.,0.,t-float(i)) * .65/sqrt(t);

		if ( l < closest )
        {
            if ( closest < closest2 ) closest2 = closest;
            closest = l;
			fragColour.rgb = col; // *(1.-l*sqrt(float(n)));
        }
        else if ( l < closest2 )
        {
            closest2 = l;
        }
        fragColour.rgb = mix(fragColour.rgb,vec3(0),smoothstep(penOut,penIn,length(pos-uv)));
    }
    
    // cell borders
    fragColour.rgb *= smoothstep(penIn,penOut,(closest2-closest));//*scale);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}