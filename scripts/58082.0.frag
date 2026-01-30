/*
 * Original shader from: https://www.shadertoy.com/view/3d33zM
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
//Based on https://www.youtube.com/watch?v=3CycKKJiwis

float random(vec2 par){
   return fract(sin(dot(par.xy,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 random2(vec2 par){
	float rand = random(par);
	return vec2(rand, random(par+rand));
}

vec3 hsvToRgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
	
    //The ratio of the width and height of the screen
    float widthHeightRatio = iResolution.x/iResolution.y;
    
    float t = iTime * 0.1;
    float dist = 0.0;
    const float layers = 16.0;
    float scale = 32.0;
    float depth;
    float phase;
    float rotationAngle = iTime * -0.01;
    
    vec2 offset;
    vec2 local_uv;
    vec2 index;
    vec2 pos;
    vec2 seed;
    vec2 centre = vec2(0.5, 0.5);
    
    mat2 rotation = mat2(cos(rotationAngle), -sin(rotationAngle), 
                         sin(rotationAngle),  cos(rotationAngle));
 	
    for(float i = 0.0; i < layers; i++){
        depth = fract(i/layers + t);
        
        //Move centre in a circle depending on the depth of the layer
        centre.x = 0.5 + 0.1 * cos(t) * depth;
        centre.y = 0.5 + 0.1 * sin(t) * depth;
        
        //Get uv from the fragment coordinates, rotation and depth
    	uv = centre-fragCoord/iResolution.xy;
    	uv.y /= widthHeightRatio;
        uv *= rotation;
    	uv *= mix(scale, 0.0, depth);
        
        //The local cell
        index = floor(uv);
        
        //Local cell seed;
        seed = 20.0 * i + index;
        
        //The local cell coordinates
        local_uv = fract(i + uv) - 0.5;
        
        //Get a random position for the local cell
        pos = 0.8 * (random2(seed) - 0.5);
        
        //Get a random phase
        phase = 128.0 * random(seed);
        
        //Get distance to the generated point, add fading to distant points
        //Add the distance to the sum
    	dist += pow(abs(1.0-length(local_uv-pos)), 50.0 + 20.0 * sin(phase + 8.0 * iTime)) 
            * min(1.0, depth*2.0);
        
    }
    vec3 hsl = hsvToRgb(vec3(fragCoord.x / resolution.x, 0.7, 1));
    fragColor = vec4(floor(vec3(dist) * hsl + 0.6),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}