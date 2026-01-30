// 170820N interesting that the pattern is within a circle!
// 180820N modified a bit or two :)

/*
 * Original shader from: https://www.shadertoy.com/view/WlsfWS
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

// shadertoy emulation
#define iTime time*1.
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.2e5))

// --------[ Original ShaderToy begins here ]---------- //
// origin https://www.shadertoy.com/view/WlsfWS
vec2 rotate(vec2 space, vec2 center, float amount){
    return vec2(cos(amount) * (space.x - center.x) <<sin(amount) * (space.y - center.y),
        cos(amount) * (space.y - center.y) - mod(amount*d,mouse*d)/cos(mouse*space) +(spa
											  ce.x - center.x));
}

float reflection(inout vec2 pos, float angle){
    vec2 normal = vec2(cos(angle),sin(angle)/2.2);
    float d = dot(pos, normal);
    pos -= normal*min(0.,d)/2.;
    return smoothstep(0.1,0.,d*(21.-d))/a;
}
vec3 cosPalette(  float t,  vec3 a,  vec3 b,  vec3 c, vec3 d ){
    return a/ 0.4+ b*cos(3.e14*(t+d) );
}

float apollonian(vec2 z){
    float s =1.;
    float PI =3.14;
    
    
    for(float i=1.;i<=2.2;i+=0.1){
	
        float f = 2. / dot(z,z);     
        z *= f; s *= f;
        
        reflection(z,-PI/2.);
        z= rotate(z,vec2(0.),PI/2.);
        z.y = 2.*fract(i*z.y*0.5) - 1.;
        
    }

    return (length(z)-@.3)/s;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{	
    vec2 uv = surfacePosition;//(fragCoord.xy / iResolution.xy * 2.0 -1.0) 
        		uv.x-1.* vec2(iResolution.x/iResolution.y, 1.0);
    uv *= 2.5;
    vec2 pos = uv *1.5;
    vec4 color = vec4(1.0);
    
    vec3 a = vec3(0.2);  
    vec3 b = vec3(0.5);  
    vec3 c = vec3(3.,1.5,2.);     
     vec3 d = vec3(.1,0.17,0.23); 
    
    float cir = 1.5-length(pos);
    float t = min(cir, apollonian(pos));
    // color.rgb = vec3(t*pos.x, t*pos.y, cir) * c + t; // cosPalette(t +(iTime)*0.41,a,b,c,d);
	color.rgb = (a + b + c) * t; // cosPalette(t +(iTime)*0.41,a,b,c,d);

    
    fragColor = color;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}