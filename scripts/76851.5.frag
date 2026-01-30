/*
 * Original shader from: https://www.shadertoy.com/view/Nl33Wr
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
/**************************************************************/
//Try a value between 5.0 and 100.0 
//and fullscreen (if your GPU can handle it...)
const float WAVE_NR = 8.0;

/*************************************************************/
    

void mainImage( out vec4  
fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    // Move origin so x and y goes from -0.5 to 0.5
    uv -= 0.5;
    // Scale x coordinate to rectangular window (x is about -0.8 to 0.8)
    uv.x *= iResolution.x / iResolution.y;
	
	//uv.x = abs(sin(sin(uv.y*4.+time*0.5)+uv.x*4.0+time*0.5)*0.1);
	uv.x += sin(time*0.1+uv.x*uv.y);
 
    float WAVE_WIDTH = 0.02/sqrt(WAVE_NR);
    //nr_factor allows the waves to live for 10 seconds
    float nr_factor = WAVE_NR/10.0;
    //Background color
    //solid color
    vec3 col = vec3(0.1,0.4,0.7);
    //soft moving bluish color
    float red   = (sin(iTime*0.354)+1.0)*0.15;
    float green = (sin(iTime*0.123)+1.0)*0.15+0.25;
    float blue  = (sin(iTime*0.678)+1.0)*0.25+0.5;
    col = vec3(red,green,blue);
    //White color (for wave)
    vec3 white = vec3(1.0);
    //"Integer" part of iTime (adjusted with nr_factor if more than 10 waves)
    float intTime = floor(iTime*nr_factor)/nr_factor;
    //Create a loop that looks back in time
    for (float i = 0.0; i < WAVE_NR; i++)
    {
        //Calculate time backwards
        float iT = (intTime - i/nr_factor);
        //See where the startPoint was some time ago
        vec2 startPoint = 0.5*vec2(sin(iT*0.95), cos(iT*0.67));
        //Get the distance from a previous startpoint to the current point (pixel)
        float dist = distance(uv,startPoint);
        //The edge of the wave has a radius that grows.
        //The further back in time, the larger the radius
        //The radius goes from 0.0 up to 1.0, because i goes from 0.0 to 10.0
        float waveRadius = (fract(iTime*nr_factor)/nr_factor + i/nr_factor)/10.0;
        //Compare the distance to the wave radius
        float wave = abs(dist-waveRadius);
        //If the distance and the radius are close then color this pixel
        if (wave < WAVE_WIDTH){
            //The center of the wave edge should be most intense
            //float intensity = (WAVE_WIDTH-wave)*50.0;
            float intensity = 0.5*smoothstep(WAVE_WIDTH,0.5*WAVE_WIDTH,wave);
            //Create fading effect
            //If the distance is small, the color should be intense
            //If the distance is large, the color should be pale
            intensity = (1.0-dist)*intensity;
            //Use intensity to make white color
            col += white*intensity;
            
        }
        //Testing the path of startpoint
        //if (dist < 0.1) col += vec3(0.5,0.0,0.5)/i;
    }
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}