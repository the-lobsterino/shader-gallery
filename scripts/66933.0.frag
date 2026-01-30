/*
 * Original shader from: https://www.shadertoy.com/view/WlsfWS
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// origin https://www.shadertoy.com/view/WlsfWS
vec2 rotate(vec2 space, vec2 center, float amount){
    return vec2(cos(amount) * (space.x - center.x) + sin(amount) * (space.y - center.y),
        cos(amount) * (space.y - center.y) - sin(amount) * (space.x - center.x));
}

float reflection(inout vec2 pos, float angle){
    vec2 normal = vec2(cos(angle),sin(angle));
    float d = dot(pos, normal);
    pos -= normal*min(0.,d)*2.;
    return smoothstep(0.1,0.,abs(d));
}
vec3 cosPalette(  float t,  vec3 a,  vec3 b,  vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

float apollonian(vec2 z){
    float s =1.;
    float PI =3.14;
    
    for(int i=0;i<10;i++){
        float f = 2. / dot(z,z);     
        z *= f; s *= f;
        
        reflection(z,-PI/2.);
        z= rotate(z,vec2(0.),PI/2.);
        z.y = 2.*fract(z.y*0.5) - 1.;
        
    }

    return (length(z)-.3)/s;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
    vec2 uv = surfacePosition;//(fragCoord.xy / iResolution.xy * 2.0 -1.0) 
        		//* vec2(iResolution.x/iResolution.y, 1.0);
    vec2 pos = uv *1.5;
    vec4 color = vec4(1.0);
    
    vec3 a = vec3(0.2);  
    vec3 b = vec3(0.5);  
    vec3 c = vec3(3.,1.5,2.);     
     vec3 d = vec3(.1,0.17,0.23); 
    
    float cir = 1.5-length(pos);
    float t = min(cir, apollonian(pos));
    color.rgb = cosPalette(t +(iTime)*0.41,a,b,c,d);

    
    fragColor = color;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}