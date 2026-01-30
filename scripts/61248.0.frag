/*
 * Original shader from: https://www.shadertoy.com/view/3sKGWw
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

//https://www.shadertoy.com/view/3s3GDn
float getGlow(float dist, float radius, float intensity){
    return pow(radius/dist, intensity);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    
    float t = 1.0 + iTime * 0.06;
    const float layers = 10.0;
    const float scale = 32.0;
    float depth;
    float phase;
    float rotationAngle = iTime * -0.1;
    float size;
    float glow;
    //Iteration step size for outermost loop
    const float del = 1.0/layers;
    
    vec2 uv;
    //Value of floor(uv)
    vec2 fl;
    vec2 local_uv;
    vec2 index;
    vec2 pos;
    //Seed for random values
    vec2 seed;
    vec2 centre;    
    //The indices of 3x3 cells surrounding the fragment
    vec2 cell;
    //To move the focus of the camera in a circle
    vec2 rot = vec2(cos(t), sin(t));
    
    //To rotate layers
    mat2 rotation = mat2(cos(rotationAngle), -sin(rotationAngle), 
                         sin(rotationAngle),  cos(rotationAngle));
    vec3 col = vec3(0);
    vec3 tone;
    
    //For all layers
    for(float i = 0.0; i <= 1.0; i+=del){
        //Find depth from layer index and move it in time
        depth = fract(i + t);
        
        //Move centre in a circle depending on the depth of the layer
        centre = rot * 0.2 * depth + 0.5;
        
        //Get uv from the fragment coordinates, rotation and depth
    	uv = centre-fragCoord/iResolution.x;
        uv *= rotation;
    	uv *= mix(scale, 0.0, depth);
        fl = floor(uv);
        //The local cell coordinates. uv-fl == frac(uv)
        local_uv = uv - fl - 0.5;

        
        //For a 3x3 group of cells around the fragment, find the distance from the points 
        //of each to the current fragment and draw an accumulative glow accordingly
        //The local cell is (0,0)
       	for(float j = -1.0; j <= 1.0; j++){
            for(float k = -1.0; k <= 1.0; k++){
        		cell = vec2(j,k);
            
                //Cell index
        		index = fl + cell;
        
                //Cell seed
        		seed = 128.0 * i + index;
                
        		//Get a random position in the considered cell
        		pos = cell + 0.9 * (random2(seed) - 0.5);
        
        		//Get a random phase
        		phase = 128.0 * random(seed);
                //Get colour from cell information
        		tone = vec3(random(seed), random(seed + 1.0), random(seed + 2.0));
        
        		//Get distance to the generated point, fade distant points
                //and make glow radius pulse in time
        		size = (0.1 + 0.5 + 0.5 * sin(phase * t)) * depth;
        		glow = size * getGlow(length(local_uv-pos), 0.09, 2.0);
                //Add white core and glow
        		col += 5.0 * vec3(0.02 * glow) + tone * glow;
        	}
        }
    }
    
    //Tone mapping
    col = 1.0 - exp(-col);
    
    //Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}