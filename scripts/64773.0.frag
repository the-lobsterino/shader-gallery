/*
 * Original shader from: https://www.shadertoy.com/view/wdtSWH
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
// Author: bitless
// Title: Colormixing Metaballs
// Thanks Patricio Gonzalez Vivo & Jen Lowe for "The Book of Shaders" and inspiration 

#define PI 3.1415926

float rand (vec2 st) {
    float f = fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
    return max(f,0.2);
}

// translate color from HSB space to RGB space
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 random_color (vec2 p){
    return hsb2rgb(vec3(rand(p),.5,0.8));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 st = fragCoord.xy/iResolution.xy;
    st -= 0.5;
    if (iResolution.y > iResolution.x ) 
        st.y *= iResolution.y/iResolution.x;
    else 
        st.x *= iResolution.x/iResolution.y;
    
    st *= 5.;

    float f;
    vec3 clr = vec3(0);
    
    for (float i=1.;i<6.;i++)    {  //draw rings
        vec2 v = st + vec2(cos(iTime*4.0),sin(iTime*4.0))*0.15*(sign(mod(i,2.)-0.5)); //shift ring center
        float a = fract((atan(v.y,v.x)+(iTime*0.5+length(v)/i*0.75)*(sign(mod(i,2.)-0.5)))/PI*6.*i); //calc stripes angle
	    float f = smoothstep(0.3,0.4,a)*(1.0-smoothstep(0.6,0.7,a)); //stripes
		f*= step(0.2,length(v));
        float alpha = (1.0-(smoothstep(i-0.05,i,length(v))))*(smoothstep(i-1.0,i-0.95,length(v))); //ring alpha mask
	    vec3 col = random_color(vec2(floor(length(v)+floor(iTime*0.25))))*(1.0-f); //ring color
        clr = mix (clr,col,alpha);
        clr *= 1.0-(smoothstep(i-1.1,i-1.0,length(v+vec2(-0.075,0.075)))-smoothstep(i-1.05,i-0.85,length(v)))*0.5; //add ring shadow
    }

    fragColor = vec4(clr,1.);

}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}