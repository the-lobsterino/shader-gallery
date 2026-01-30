/*
 * Original shader from: https://www.shadertoy.com/view/7stGWj
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
const int MAX_STEPS = 64;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 1e-6;

//------- Offset the sample point by blue noise every frame to get rid of banding
//#define DITHERING
const float goldenRatio = 1.61803398875;

//https://www.shadertoy.com/view/3s3GDn
float getGlow(float dist, float radius, float intensity){
	return pow(radius / max(dist, 1e-6), intensity);	
}


//----------------------------- Camera ------------------------------

vec3 rayDirection(float fieldOfView, vec2 fragCoord) {
    vec2 xy = fragCoord - iResolution.xy / 2.0;
    float z = (0.5 * iResolution.y) / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

//https://www.geertarien.com/blog/2017/07/30/breakdown-of-the-lookAt-function-in-OpenGL/
mat3 lookAt(vec3 camera, vec3 targetDir, vec3 up){
    vec3 zaxis = normalize(targetDir);    
    vec3 xaxis = normalize(cross(zaxis, up));
    vec3 yaxis = cross(xaxis, zaxis);

    return mat3(xaxis, yaxis, -zaxis);
}


//-------------------------- SDF and scene ---------------------------

vec3 rotate(vec3 p, vec4 q){
  return 2.0 * cross(q.xyz, p * q.w + cross(q.xyz, p)) + p;
}

//https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float torusSDF( vec3 p, vec2 t ){
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

uniform sampler2D backbuffer;
float getSDF(vec3 position) {
	
	position.z += -1.04*sign(position.z);
	position.z += -1.04*sign(position.z);
	position.z += -1.04*sign(position.z);
	position.x += 0.1*cos(-length(position.yz)*22.+time*6.) + sin(position.x+time)*length(texture2D(backbuffer, gl_FragCoord.xy/resolution).rgb)*0.5;
	
   	float angle = iTime;
    vec3 axis = normalize(vec3(1.0, 1.0, 1.0));
    position = rotate(position, vec4(axis * sin(-angle*0.5), cos(-angle*0.5))); 
    return torusSDF(position, vec2(1.0, 0.2));

}


//---------------------------- Raymarching ----------------------------

// Glow variable is passed in by reference using the keyword inout. The result written in this
// function can be read afterwards from where it was called.
float distanceToScene(vec3 cameraPos, vec3 rayDir, float start, float end, inout float glow) {
	
    // Start at a predefined distance from the camera in the ray direction
    float depth = start;
    
    // Variable that tracks the distance to the scene at the current ray endpoint
    float dist;
    
    // For a set number of steps
    for (int i = 0; i < MAX_STEPS; i++) {
        
        // Get the SDF value at the ray endpoint, giving the maximum 
        // safe distance we can travel in any direction without hitting a surface
        dist = getSDF(cameraPos + depth * rayDir);
        
        // Calculate the glow at the current distance using the distance based glow function
        // Accumulate this value over the whole view ray
        // The smaller the step size, the smoother the final result
        glow += getGlow(dist, 1e-3, 0.5);
        
        // If the distance is small enough, we have hit a surface
        // Return the depth that the ray travelled through the scene
        if(dist < EPSILON){
            return depth;
        }
        
        // Else, march the ray by the sdf value
        depth += dist;
        
        // Test if we have left the scene
        if(depth >= end){
            return end;
        }
    }
    
    // Return max value if we hit nothing but remain in the scene after max steps
    return end;
}


//----------------------- Tonemapping and render ------------------------

//https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
vec3 ACESFilm(vec3 x){
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ){

    // Get the default direction of the ray (along the negative Z direction)
    vec3 rayDir = rayDirection(60.0, fragCoord);
    
    //----------------- Define a camera -----------------

    vec3 cameraPos = vec3(2.0);
    
    vec3 target = -normalize(cameraPos);
    vec3 up = vec3(0.0, 1.0, 0.0);
    
    // Get the view matrix from the camera orientation
    mat3 viewMatrix = lookAt(cameraPos, target, up);
    
    //---------------------------------------------------

    // Transform the ray to point in the correct direction
    rayDir = viewMatrix * rayDir;

    // Initialize glow to 0
    float glow = 0.0;
    
    float offset = 0.0;
    
    #ifdef DITHERING
    //Sometimes the blue noise texture is not immediately loaded into iChannel0
    //leading to jitters.
    if(iChannelResolution[0].xy == vec2(1024)){
        //From https://blog.demofox.org/2020/05/10/ray-marching-fog-with-blue-noise/
        //Get blue noise for the fragment.
        float blueNoise = texture(iChannel0, fragCoord / 1024.0).r;

    	//Blue noise texture is blue in space but animating it leads to white noise in time.
        //Adding golden ratio to a number yields a low discrepancy sequence (apparently),
    	//making the offset of each pixel more blue in time (use fract() for modulo 1).
        //https://blog.demofox.org/2017/10/31/animating-noise-for-integration-over-time/
        offset = fract(blueNoise + float(mod(iTime*32.,32.)) * goldenRatio);
    }
    #endif
    
    float ditherStrength = 2.0;

    if(fragCoord.x < 0.5 * iResolution.x){
        ditherStrength = 0.0;
    }
    
    // Find the distance to where the ray stops, pass in the glow variable to be accumulated
    float dist = distanceToScene(cameraPos, rayDir, MIN_DIST + ditherStrength * offset, MAX_DIST, glow);
    
    // Dist can now be used to render surfaces in the scene. We will only render the glow
  
    vec3 glowColour = vec3(0.2, 0.5, 1.0);
    
    // Glow now holds the value from the ray marching
    vec3 col = glow * glowColour;

    // Tonemapping
    col = ACESFilm(col);

    // Gamma
    col = pow(col, vec3(0.4545));
        
    fragColor = vec4(col, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}