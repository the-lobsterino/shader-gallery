/*
 * Original shader from: https://www.shadertoy.com/view/wstBzn
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
vec2 csquare(vec2 a){
    return vec2(a.x*a.x-a.y*a.y, 2.0*a.x*a.y);
}

float mandelbrot(vec2 z, vec2 c, int max_it_){
    const int max_it = 200;
    for(int it = 0; it < max_it; it++){
        z = csquare(z) + c;
        if(z.x*z.x+z.y*z.y > 4.0){
            return float(it);
        }
    }
    return float(max_it);
}

vec3 angles2vec3(float a,float b){
    return normalize(vec3(cos(a)*cos(b), sin(a)*cos(b), sin(b)));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    float alfa = iTime/7.0;
    float beeta = iTime/5.0;
    
    vec3 cameraDir = angles2vec3(alfa,beeta);
    
    vec3 screenX = angles2vec3(alfa + 3.1416/2.0, 0.0);
    vec3 screenY = angles2vec3(alfa, beeta + 3.1416/2.0);
    
    
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy*vec2(8,4.5) + vec2(-4.0, -2.25);
    vec3 ray = cameraDir*3.0 + uv.x*screenX + uv.y*screenY;
    
    vec3 rayStep = normalize(ray-cameraDir*100.0)/60.0;
    
    vec3 col = vec3(0.0,0.0,0.0);
    
    const int max_ray_steps = 300;
    float sum = 0.0;
    
    for(int stepCount = 0; stepCount <  max_ray_steps; stepCount++){
    
        vec2 z = vec2(ray.x,ray.y);
        vec2 c = vec2(ray.z, sin(iTime/30.0+1.7)); 

        float a = mandelbrot(z,c,200)/200.0;
        sum += a;
        
        if( a < 0.0 ){
            float b = 0.5-float(stepCount)/400.0;
            col = vec3(b,b,b);
            break;
        }
        
        if( stepCount == max_ray_steps - 1 ){
            sum = log(sum)+1.0;
            col = vec3(sum)/6.;
        }
        
        ray += rayStep;

    }

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}